import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import type { LatLon } from '../booking/BookingContext';
import { GOOGLE_MAPS_KEY } from '../booking/googleMaps';
import { LocationSearchInput } from '../booking/LocationSearchInput';
import { EventCard } from '../components/luxe/Events';
import {
  EVENT_CATEGORIES,
  EVENT_IMAGES_BUCKET,
  eventImageUrl,
  formatEventWhen,
  fromLagos,
  lagosDate,
  lagosTime,
  type EventRow,
  type SiteEvent,
} from '../data/events';
import { CITIES, type CityName } from '../data/site';
import { staffSupabase } from '../lib/supabaseStaff';

// Staff page for publishing the "What's on" events. Access is enforced by Supabase
// row-level security (see supabase/migrations/20261109_events.sql); this page only
// decides what to show.

const db = staffSupabase;
const CITY_NAMES = Object.keys(CITIES) as CityName[];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

type Access = 'checking' | 'signed-out' | 'not-staff' | 'staff';

export default function AdminEventsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [access, setAccess] = useState<Access>('checking');
  const [notice, setNotice] = useState('');
  const [ready, setReady] = useState(false);

  // Keep crawlers out while this page is open.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const title = document.title;
    document.title = 'Events admin';
    return () => {
      meta.remove();
      document.title = title;
    };
  }, []);

  useEffect(() => {
    if (!db) return;
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = db.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!db) return;
    if (!userId) {
      setAccess('signed-out');
      return;
    }
    let stale = false;
    setAccess('checking');
    db.from('staff')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (stale) return;
        if (data && !error) {
          setAccess('staff');
          return;
        }
        if (error) console.error('Staff check failed:', error);
        setNotice('This account is not authorised to manage events.');
        setAccess('not-staff');
        await db.auth.signOut();
      });
    return () => {
      stale = true;
    };
  }, [userId]);

  if (!db) {
    return (
      <Shell>
        <p className="text-ivory/70">Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</p>
      </Shell>
    );
  }

  if (!ready || (access === 'checking' && session)) {
    return (
      <Shell>
        <p className="text-ivory/50">Checking access…</p>
      </Shell>
    );
  }

  if (access !== 'staff') {
    return (
      <Shell>
        <SignIn notice={notice} onAttempt={() => setNotice('')} />
      </Shell>
    );
  }

  return (
    <Shell
      action={
        <button type="button" onClick={() => db.auth.signOut()} className="eyebrow link-underline text-ivory/60 hover:text-ivory">
          Sign out
        </button>
      }
    >
      <Dashboard />
    </Shell>
  );
}

function Shell({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-ivory">
      <header className="border-b border-ivory/15">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="eyebrow text-ivory/60 hover:text-ivory">
            ← Back to site
          </Link>
          <p className="eyebrow text-sky">Events admin</p>
          <div className="min-w-[6rem] text-right">{action}</div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-12 md:px-10">{children}</main>
    </div>
  );
}

// ── Sign in ──

function SignIn({ notice, onAttempt }: { notice: string; onAttempt: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!db) return;
    onAttempt();
    setBusy(true);
    setError('');
    const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message === 'Invalid login credentials' ? 'Email or password is incorrect.' : error.message);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-12 grid max-w-md gap-8">
      <h1 className="display text-5xl">Staff sign in</h1>
      <Field label="Email">
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
      </Field>
      <Field label="Password">
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />
      </Field>
      {(error || notice) && (
        <p role="alert" className="text-sm text-sky">
          {error || notice}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-sky">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

// ── List ──

function isPast(row: EventRow, now = Date.now()) {
  return new Date(row.ends_at ?? row.starts_at).getTime() <= now;
}

function Dashboard() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [city, setCity] = useState<CityName | 'all'>('all');
  const [editing, setEditing] = useState<EventRow | 'new' | null>(null);

  const load = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    const { data, error } = await db.from('events').select('*').order('starts_at', { ascending: true });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError('');
    setRows(data as EventRow[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(() => {
    const now = Date.now();
    const list = rows.filter((r) => (tab === 'past') === isPast(r, now) && (city === 'all' || r.city === city));
    return tab === 'past' ? list.reverse() : list;
  }, [rows, tab, city]);

  async function togglePublished(row: EventRow) {
    if (!db) return;
    const { error } = await db.from('events').update({ published: !row.published }).eq('id', row.id);
    if (error) {
      alert(`Could not update: ${error.message}`);
      return;
    }
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, published: !row.published } : r)));
  }

  async function remove(row: EventRow) {
    if (!db || !confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    const { error } = await db.from('events').delete().eq('id', row.id);
    if (error) {
      alert(`Could not delete: ${error.message}`);
      return;
    }
    if (row.image_path) await db.storage.from(EVENT_IMAGES_BUCKET).remove([row.image_path]);
    setRows((rs) => rs.filter((r) => r.id !== row.id));
  }

  if (editing) {
    return (
      <EventForm
        row={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h1 className="display text-5xl">Events</h1>
        <button type="button" onClick={() => setEditing('new')} className="btn-sky">
          + New event
        </button>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-b border-ivory/15 pb-4">
        <div className="flex gap-8" role="tablist">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`eyebrow press ${tab === t ? 'text-ivory' : 'text-ivory/40 hover:text-ivory/70'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <select value={city} onChange={(e) => setCity(e.target.value as CityName | 'all')} className="field w-auto cursor-pointer !text-base">
          <option value="all">All cities</option>
          {CITY_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-8 text-sky">Could not load events: {error}</p>}
      {loading ? (
        <p className="mt-8 text-ivory/50">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 text-ivory/50">No {tab} events{city !== 'all' ? ` in ${city}` : ''}.</p>
      ) : (
        <ul className="divide-y divide-ivory/10">
          {shown.map((r) => (
            <li key={r.id} className="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow text-sky">
                  {r.city}
                  {r.category ? ` · ${r.category}` : ''}
                </p>
                <p className="mt-2 font-display text-2xl">{r.title}</p>
                <p className="mt-1 text-sm text-ivory/50">
                  {formatEventWhen({ startsAt: new Date(r.starts_at) })} · {r.venue_name}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ivory/70">
                  <input type="checkbox" checked={r.published} onChange={() => togglePublished(r)} className="accent-sky" />
                  Published
                </label>
                <button type="button" onClick={() => setEditing(r)} className="eyebrow link-underline text-ivory/80 hover:text-sky">
                  Edit
                </button>
                <button type="button" onClick={() => remove(r)} className="eyebrow link-underline text-ivory/50 hover:text-sky">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Create / edit ──

interface FormState {
  city: CityName;
  title: string;
  category: string;
  description: string;
  venueName: string;
  address: string;
  coords: LatLon | null;
  date: string;
  start: string;
  end: string;
  ticketUrl: string;
  published: boolean;
}

function initialForm(row: EventRow | null): FormState {
  if (!row) {
    return {
      city: 'Lagos',
      title: '',
      category: '',
      description: '',
      venueName: '',
      address: '',
      coords: null,
      date: '',
      start: '',
      end: '',
      ticketUrl: '',
      published: true,
    };
  }
  const starts = new Date(row.starts_at);
  return {
    city: row.city,
    title: row.title,
    category: row.category ?? '',
    description: row.description ?? '',
    venueName: row.venue_name,
    address: row.address,
    coords: row.lat != null && row.lon != null ? { lat: row.lat, lon: row.lon } : null,
    date: lagosDate(starts),
    start: lagosTime(starts),
    end: row.ends_at ? lagosTime(new Date(row.ends_at)) : '',
    ticketUrl: row.ticket_url ?? '',
    published: row.published,
  };
}

/** Start and end as instants. An end time at or before the start means the event runs past midnight. */
function times(f: FormState) {
  if (!f.date || !f.start) return { startsAt: null, endsAt: null, overnight: false };
  const startsAt = fromLagos(f.date, f.start);
  if (!f.end) return { startsAt, endsAt: null, overnight: false };
  let endsAt = fromLagos(f.date, f.end);
  const overnight = endsAt <= startsAt;
  if (overnight) endsAt = new Date(endsAt.getTime() + 24 * 3_600_000);
  return { startsAt, endsAt, overnight };
}

type FormErrors = Partial<Record<keyof FormState | 'image', string>>;

function validate(f: FormState, file: File | null): FormErrors {
  const e: FormErrors = {};
  if (!f.title.trim()) e.title = 'Add a title';
  if (!f.venueName.trim()) e.venueName = 'Add the venue name';
  if (!f.address.trim()) e.address = 'Search for the venue address';
  // Without a Maps key there are no suggestions, so a typed address has to do.
  else if (!f.coords && GOOGLE_MAPS_KEY) e.address = 'Choose the address from the suggestions so we know where it is';
  if (!f.date) e.date = 'Choose a date';
  if (!f.start) e.start = 'Choose a start time';
  if (f.ticketUrl && !/^https?:\/\//i.test(f.ticketUrl.trim())) e.ticketUrl = 'Use a full link starting with https://';
  if (file) {
    if (!file.type.startsWith('image/')) e.image = 'Choose an image file';
    else if (file.size > MAX_IMAGE_BYTES) e.image = 'Images must be 3 MB or smaller';
  }
  return e;
}

function EventForm({ row, onCancel, onSaved }: { row: EventRow | null; onCancel: () => void; onSaved: () => void }) {
  const [f, setF] = useState<FormState>(() => initialForm(row));
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setF((s) => ({ ...s, [key]: value }));
  const onAddress = useCallback((v: string) => setF((s) => ({ ...s, address: v })), []);
  const onCoords = useCallback((c: LatLon | null) => setF((s) => ({ ...s, coords: c })), []);

  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
  }, [filePreview]);

  const { startsAt, endsAt, overnight } = times(f);
  const existingImage = db && row && !removeImage ? eventImageUrl(db, row.image_path) : null;

  const preview: SiteEvent = {
    id: row?.id ?? 'preview',
    city: f.city,
    title: f.title,
    category: f.category,
    description: f.description,
    venueName: f.venueName,
    address: f.address,
    coords: f.coords,
    startsAt: startsAt ?? new Date(),
    endsAt,
    imageUrl: filePreview ?? existingImage,
    ticketUrl: f.ticketUrl || null,
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!db) return;
    const errs = validate(f, file);
    setErrors(errs);
    if (Object.keys(errs).length || !startsAt) return;

    setSaving(true);
    setSaveError('');
    try {
      let imagePath = removeImage ? null : (row?.image_path ?? null);
      if (file) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await db.storage
          .from(EVENT_IMAGES_BUCKET)
          .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
        if (error) throw error;
        imagePath = path;
      }

      const values = {
        city: f.city,
        title: f.title.trim(),
        category: f.category.trim() || null,
        description: f.description.trim() || null,
        venue_name: f.venueName.trim(),
        address: f.address.trim(),
        lat: f.coords?.lat ?? null,
        lon: f.coords?.lon ?? null,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt?.toISOString() ?? null,
        image_path: imagePath,
        ticket_url: f.ticketUrl.trim() || null,
        published: f.published,
      };
      const { error } = row
        ? await db.from('events').update(values).eq('id', row.id)
        : await db.from('events').insert(values);
      if (error) throw error;

      // The old image is no longer referenced once the event is saved.
      if (row?.image_path && row.image_path !== imagePath) {
        await db.storage.from(EVENT_IMAGES_BUCKET).remove([row.image_path]);
      }
      onSaved();
    } catch (err) {
      console.error('Saving event failed:', err);
      setSaveError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={onSubmit} noValidate className="grid grid-cols-2 content-start gap-x-8 gap-y-8">
        <div className="col-span-2 flex items-end justify-between gap-6">
          <h1 className="display text-5xl">{row ? 'Edit event' : 'New event'}</h1>
          <button type="button" onClick={onCancel} className="eyebrow link-underline text-ivory/60 hover:text-ivory">
            Cancel
          </button>
        </div>

        <Field label="City">
          <select value={f.city} onChange={(e) => set('city', e.target.value as CityName)} className="field cursor-pointer">
            {CITY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <input
            list="event-categories"
            value={f.category}
            onChange={(e) => set('category', e.target.value)}
            placeholder="Concert, Festival…"
            className="field"
          />
          <datalist id="event-categories">
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field label="Title" error={errors.title} className="col-span-2">
          <input value={f.title} onChange={(e) => set('title', e.target.value)} className="field" />
        </Field>

        <Field label="Venue name" error={errors.venueName} className="col-span-2">
          <input value={f.venueName} onChange={(e) => set('venueName', e.target.value)} placeholder="Eko Convention Centre" className="field" />
        </Field>

        <Field label="Venue address" error={errors.address} className="col-span-2">
          <LocationSearchInput
            value={f.address}
            onChange={onAddress}
            onCoordinatesChange={onCoords}
            invalid={!!errors.address}
            placeholder={`Search the venue in ${f.city}`}
          />
          {f.coords && <span className="mt-2 block text-xs text-ivory/40">Location pinned ✓</span>}
        </Field>

        <Field label="Date (Lagos time)" error={errors.date} className="col-span-2 sm:col-span-1">
          <input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} className="field" />
        </Field>
        <div className="col-span-2 grid grid-cols-2 gap-x-8 sm:col-span-1">
          <Field label="Starts" error={errors.start}>
            <input type="time" value={f.start} onChange={(e) => set('start', e.target.value)} className="field" />
          </Field>
          <Field label="Ends (optional)">
            <input type="time" value={f.end} onChange={(e) => set('end', e.target.value)} className="field" />
            {overnight && <span className="mt-2 block text-xs text-ivory/40">Ends the next day</span>}
          </Field>
        </div>

        <Field label="Description (optional)" className="col-span-2">
          <textarea rows={3} value={f.description} onChange={(e) => set('description', e.target.value)} className="field resize-none" />
        </Field>

        <Field label="Ticket link (optional)" error={errors.ticketUrl} className="col-span-2">
          <input type="url" value={f.ticketUrl} onChange={(e) => set('ticketUrl', e.target.value)} placeholder="https://" className="field" />
        </Field>

        <Field label="Image (portrait works best, up to 3 MB)" error={errors.image} className="col-span-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setRemoveImage(false);
            }}
            className="block w-full text-sm text-ivory/70 file:mr-4 file:cursor-pointer file:border file:border-ivory/30 file:bg-transparent file:px-4 file:py-2 file:text-ivory hover:file:border-sky"
          />
        </Field>
        {row?.image_path && !file && (
          <label className="col-span-2 -mt-4 flex cursor-pointer items-center gap-2 text-sm text-ivory/60">
            <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} className="accent-sky" />
            Remove the current image
          </label>
        )}

        <label className="col-span-2 flex cursor-pointer items-center gap-3 text-ivory/80">
          <input type="checkbox" checked={f.published} onChange={(e) => set('published', e.target.checked)} className="accent-sky" />
          Published (visible on the site)
        </label>

        {saveError && (
          <p role="alert" className="col-span-2 text-sm text-sky">
            Could not save: {saveError}
          </p>
        )}

        <div className="col-span-2 flex gap-4">
          <button type="submit" disabled={saving} className="btn-sky flex-1">
            {saving ? 'Saving…' : row ? 'Save changes' : 'Publish event'}
          </button>
          <button type="button" onClick={onCancel} className="btn-line">
            Cancel
          </button>
        </div>
      </form>

      <aside className="lg:sticky lg:top-12 lg:self-start">
        <p className="eyebrow mb-6 text-ivory/50">Preview</p>
        <div className="max-w-sm">
          <EventCard event={preview} />
        </div>
      </aside>
    </div>
  );
}

function Field({ label, error, className = '', children }: { label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-[0.72rem] tracking-wide text-sky">
          {error}
        </span>
      )}
    </label>
  );
}
