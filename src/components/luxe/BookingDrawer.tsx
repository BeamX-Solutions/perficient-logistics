import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  DURATIONS,
  experienceLabel,
  experiencePatch,
  formatDate,
  serviceTitle,
  timeSlots,
  todayISO,
  useBooking,
  usesDuration,
  type Booking,
  type BookingErrors,
  type LatLon,
} from '../../booking/BookingContext';
import { LocationSearchInput } from '../../booking/LocationSearchInput';
import { CITY_BOUNDS, cityOf, inCity, PICK_FROM_LIST, restrictsDropoff, wrongCityError } from '../../booking/cityBounds';
import {
  categoryName,
  distanceText,
  estimatedDistance,
  submitBooking,
  summaryLines,
  validateStep,
  vehiclePrice,
  whatsappLink,
} from '../../booking/submitBooking';
import { vehicleCategories } from '../../data/vehicleData';
import { BRAND, CITIES, type CityName } from '../../data/site';

const STEPS = ['Trip', 'Vehicle', 'Details', 'Review'];

type Status = 'idle' | 'sending' | 'error' | 'done';

type AddressField = 'pickup' | 'drop-off';

/** A pop-up explaining why an address can't be used. */
interface Notice {
  title: string;
  message: string;
  /** Label for the button that closes the pop-up. */
  dismiss: string;
  /** Offer to switch the booking to the city the address is in. */
  switchTo?: CityName;
}

function wrongCityNotice(city: CityName, field: AddressField, c: LatLon): Notice {
  const other = cityOf(c);
  return other
    ? {
        title: `That address is in ${other}`,
        message: `Your city is set to ${city}, so you can't choose a ${field} address in ${other}. Choose an address in ${city}, or switch your city to ${other}.`,
        dismiss: 'Choose another address',
        switchTo: other,
      }
    : {
        title: `That address is outside ${city}`,
        message: `Your city is set to ${city}, so your ${field} address needs to be in ${city}. Please choose an address in ${city}.`,
        dismiss: 'Choose another address',
      };
}

function pickFromListNotice(city: CityName, field: AddressField): Notice {
  return {
    title: 'Choose an address from the list',
    message: `Start typing your ${field} address, then pick it from the suggestions that appear. That lets us confirm it's in ${city}.`,
    dismiss: 'Got it',
  };
}

export default function BookingDrawer() {
  const { booking: b, update, open, setOpen, reset } = useBooking();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [agreed, setAgreed] = useState(false);
  const [ref, setRef] = useState('');
  // A snapshot of what was booked, so the confirmation survives a reset.
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeRef = useRef(notice);
  noticeRef.current = notice;
  const panel = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);

  // Every fresh opening starts at the first step.
  useEffect(() => {
    if (open && status !== 'done') {
      setStep(1);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = useCallback(() => {
    if (status === 'done') {
      reset();
      setStatus('idle');
      setErrors({});
      setAgreed(false);
      setConfirmed(null);
      setStep(1);
    } else {
      setOpen(false);
    }
  }, [status, reset, setOpen]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      // Escape first closes the Google Places suggestions, not the drawer.
      if (e.key !== 'Escape' || document.querySelector('.pac-container:not([style*="display: none"])')) return;
      // ...and an open pop-up before the drawer.
      if (noticeRef.current) setNotice(null);
      else close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  function goTo(n: number) {
    setErrors({});
    setStep(n);
    body.current?.scrollTo({ top: 0 });
  }

  function next() {
    const errs = validateStep(step, b);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      goTo(step + 1);
      return;
    }
    if (step === 1) setNotice(addressNotice(b, errs));
  }

  // Explain an address problem in a pop-up, not just the small text under the field.
  function addressNotice(bk: Booking, errs: BookingErrors): Notice | null {
    const fields: [AddressField, keyof Booking, LatLon | null][] = [
      ['pickup', 'pickupLocation', bk.pickupCoords],
      ['drop-off', 'dropoffLocation', bk.dropoffCoords],
    ];
    for (const [field, key, coords] of fields) {
      const msg = errs[key];
      if (!msg) continue;
      if (coords && !inCity(bk.city, coords)) return wrongCityNotice(bk.city, field, coords);
      if (msg === PICK_FROM_LIST) return pickFromListNotice(bk.city, field);
    }
    return null;
  }

  // Picking an address in the wrong city explains itself straight away.
  const onWrongCity = useCallback(
    (field: AddressField, c: LatLon) => {
      setErrors((x) => ({ ...x, [field === 'pickup' ? 'pickupLocation' : 'dropoffLocation']: wrongCityError(b.city, c) }));
      setNotice(wrongCityNotice(b.city, field, c));
    },
    [b.city],
  );

  function switchCity(city: CityName) {
    // Addresses left behind in the old city are cleared by BookingProvider.
    update(experiencePatch(b, '', city));
    setErrors({});
    setNotice(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) {
      next();
      return;
    }
    if (!agreed) {
      setErrors({ terms: 'You must agree to the terms before booking' });
      return;
    }
    setStatus('sending');
    try {
      const res = await submitBooking(b);
      setRef(res.ref);
      setConfirmed({ ...b });
      setStatus('done');
    } catch (err) {
      console.error('Error submitting booking:', err);
      setStatus('error');
    }
  }

  const patch = useCallback(
    (p: Partial<Booking>) => {
      update(p);
      setErrors((x) => {
        const keys = Object.keys(p) as (keyof Booking)[];
        if (!keys.some((k) => x[k])) return x;
        const n = { ...x };
        keys.forEach((k) => delete n[k]);
        return n;
      });
    },
    [update],
  );

  const set =
    (key: keyof Booking) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      patch({ [key]: e.target.value } as Partial<Booking>);

  const done = status === 'done' && confirmed;
  const shown = done ? confirmed : b;

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] ${open ? 'visible' : 'invisible delay-300'}`}
      aria-hidden={!open}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100 duration-400 ease-out' : 'opacity-0 duration-250 ease-out'
        }`}
      />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-ivory/10 bg-ink-2 outline-none transition-transform ease-drawer ${
          open ? 'translate-x-0 duration-500' : 'translate-x-full duration-300'
        }`}
      >
        <header className="flex items-start justify-between border-b border-ivory/10 px-8 py-7">
          <div>
            <p className="eyebrow text-sky">{done ? 'Reservation received' : 'Your reservation'}</p>
            <h2 key={done ? 'done' : 'form'} id="drawer-title" className="display mt-3 animate-swap text-4xl">
              {done ? (
                <>
                  Thank you, <em className="italic text-sky">{shown.fullName.split(' ')[0]}.</em>
                </>
              ) : (
                <>
                  {serviceTitle(b.service)}, <em className="italic text-sky">{b.city}</em>
                </>
              )}
            </h2>
            {!done && b.date && b.time && (
              <p className="mt-3 font-display text-lg italic text-ivory/60">
                {formatDate(b.date)} at {b.time}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="press eyebrow mt-1 text-ivory/50 hover:text-sky"
            aria-label="Close reservation"
          >
            Close
          </button>
        </header>

        {done ? (
          <Confirmation b={confirmed} refCode={ref} onDone={close} />
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <Progress step={step} onStep={goTo} />

            <div ref={body} className="flex-1 overflow-y-auto">
              <div key={step} className="animate-swap px-8 py-8">
                {step === 1 && <StepTrip b={b} errors={errors} set={set} patch={patch} onWrongCity={onWrongCity} />}
                {step === 2 && <StepVehicle b={b} errors={errors} patch={patch} />}
                {step === 3 && <StepDetails b={b} errors={errors} set={set} />}
                {step === 4 && (
                  <StepReview
                    b={b}
                    onEdit={goTo}
                    agreed={agreed}
                    onAgree={(v) => {
                      setAgreed(v);
                      setErrors({});
                    }}
                    error={errors.terms}
                  />
                )}
              </div>
            </div>

            <footer className="border-t border-ivory/10 bg-ink-2 px-8 py-6">
              {status === 'error' && (
                <p role="alert" className="mb-4 text-center text-sm text-sky">
                  We couldn’t submit your booking. Please try again, or reach us on WhatsApp.
                </p>
              )}
              <div className={`grid gap-3 ${step > 1 ? 'grid-cols-[auto_1fr]' : ''}`}>
                {step > 1 && (
                  <button type="button" onClick={() => goTo(step - 1)} className="btn-line !px-6">
                    ← Back
                  </button>
                )}
                <button type="submit" disabled={status === 'sending'} className="btn-sky w-full">
                  <span key={`${step}-${status}`} className="animate-swap">
                    {step < 4 ? 'Continue →' : status === 'sending' ? 'Reserving...' : 'Confirm reservation'}
                  </span>
                </button>
              </div>
              <p className="mt-4 text-center text-xs text-ivory/40">
                No payment is taken now. Prefer to book via chat?{' '}
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                    "Hi! I'd like to book a ride. Can you help me with the details?",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ivory/70 underline decoration-ivory/20 underline-offset-2 hover:text-sky"
                >
                  Book on WhatsApp
                </a>
              </p>
            </footer>
          </form>
        )}

        {notice && <AddressNotice notice={notice} onClose={() => setNotice(null)} onSwitch={switchCity} />}
      </aside>
    </div>
  );
}

// ── Progress ──

function Progress({ step, onStep }: { step: number; onStep: (n: number) => void }) {
  return (
    <ol className="flex items-center gap-3 border-b border-ivory/10 px-8 py-4">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const complete = n < step;
        const current = n === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-3 last:flex-none">
            <button
              type="button"
              disabled={!complete}
              onClick={() => onStep(n)}
              aria-current={current ? 'step' : undefined}
              aria-label={complete ? `Back to ${label}` : label}
              className={`press eyebrow flex items-center gap-2 whitespace-nowrap !tracking-[0.3em] ${
                current ? 'text-ivory' : complete ? 'text-sky hover:text-ivory' : 'text-ivory/30'
              }`}
            >
              <span className="font-display text-base italic normal-case tracking-normal">
                {complete ? '✓' : String(n).padStart(2, '0')}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {n < STEPS.length && (
              <span className={`h-px flex-1 transition-colors duration-300 ${complete ? 'bg-sky/60' : 'bg-ivory/10'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

type SetFn = (
  key: keyof Booking,
) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;

// ── Step 1: Trip ──

function StepTrip({
  b,
  errors,
  set,
  patch,
  onWrongCity,
}: {
  b: Booking;
  errors: BookingErrors;
  set: SetFn;
  patch: (p: Partial<Booking>) => void;
  onWrongCity: (field: AddressField, c: LatLon) => void;
}) {
  const city = CITIES[b.city];
  const slots = useMemo(() => (b.date ? timeSlots(b.date) : []), [b.date]);
  const onPickup = useCallback((v: string) => patch({ pickupLocation: v }), [patch]);
  const onDropoff = useCallback((v: string) => patch({ dropoffLocation: v }), [patch]);
  const onPickupCoords = useCallback(
    (c: LatLon | null) => {
      patch({ pickupCoords: c });
      if (c && !inCity(b.city, c)) onWrongCity('pickup', c);
    },
    [patch, b.city, onWrongCity],
  );
  const onDropoffCoords = useCallback(
    (c: LatLon | null) => {
      patch({ dropoffCoords: c });
      if (c && restrictsDropoff(b.service) && !inCity(b.city, c)) onWrongCity('drop-off', c);
    },
    [patch, b.city, b.service, onWrongCity],
  );

  function onDate(date: string) {
    const p: Partial<Booking> = { date };
    // Drop a time that is no longer valid for the new date.
    if (b.time && !timeSlots(date).includes(b.time)) p.time = '';
    patch(p);
  }

  return (
    <div className="grid grid-cols-2 content-start gap-x-8 gap-y-8">
      {b.event && (
        <div className="col-span-2 flex items-start justify-between gap-4 bg-ivory px-5 py-4 text-ink">
          <p className="leading-snug">
            <span className="eyebrow block text-sky-deep">Getting you to</span>
            <em className="mt-2 block font-display text-xl italic">{b.event}</em>
          </p>
          <button
            type="button"
            onClick={() => patch({ event: '' })}
            aria-label="Remove the event from this booking"
            className="press -mr-1 -mt-1 p-1 text-xl leading-none text-ink/50 hover:text-ink"
          >
            ×
          </button>
        </div>
      )}
      <Field label={b.service === 'airport' ? 'Pickup (airport or address)' : 'Pickup address'} error={errors.pickupLocation} className="col-span-2">
        <LocationSearchInput
          value={b.pickupLocation}
          onChange={onPickup}
          onCoordinatesChange={onPickupCoords}
          bounds={CITY_BOUNDS[b.city]}
          invalid={!!errors.pickupLocation}
          placeholder={b.service === 'airport' ? city.airport : `Hotel, residence or office in ${b.city}`}
        />
      </Field>

      <Field label={b.service === 'interstate' ? 'Destination' : 'Drop off'} error={errors.dropoffLocation} className="col-span-2">
        <LocationSearchInput
          value={b.dropoffLocation}
          onChange={onDropoff}
          onCoordinatesChange={onDropoffCoords}
          bounds={restrictsDropoff(b.service) ? CITY_BOUNDS[b.city] : null}
          invalid={!!errors.dropoffLocation}
          placeholder={b.service === 'interstate' ? 'Ibadan, Benin, Kaduna, Port Harcourt...' : 'Where shall we take you?'}
        />
      </Field>

      <Field label="Pickup date" error={errors.date} className="col-span-2 sm:col-span-1">
        <input
          type="date"
          className="field cursor-pointer"
          min={todayISO()}
          value={b.date}
          onChange={(e) => onDate(e.target.value)}
        />
      </Field>

      <Field label="Pickup time" error={errors.time} className="col-span-2 sm:col-span-1">
        <select
          className="field cursor-pointer disabled:cursor-not-allowed disabled:text-ivory/30"
          value={b.time}
          disabled={!b.date}
          onChange={set('time')}
        >
          <option value="">{b.date ? 'Select' : 'Date first'}</option>
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Drop-off date (optional)" error={errors.dropoffDate} className="col-span-2 sm:col-span-1">
        <input
          type="date"
          className="field cursor-pointer"
          min={b.date || todayISO()}
          value={b.dropoffDate}
          onChange={set('dropoffDate')}
        />
      </Field>

      <Field label="Passengers" className="col-span-2 sm:col-span-1">
        <select className="field cursor-pointer" value={b.passengers} onChange={set('passengers')}>
          {['1', '2', '3', '4', '5', '6', '7', '8'].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </Field>

      <div className="col-span-2">
        <span className="field-label">Ride type</span>
        <div role="radiogroup" aria-label="Ride type" className="mt-1 flex gap-1">
          {(
            [
              ['one-way', 'One way'],
              ['round-trip', 'Round trip'],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={b.rideType === v}
              onClick={() => patch({ rideType: v })}
              className={`press eyebrow border px-4 py-3 ${
                b.rideType === v ? 'border-sky bg-sky text-ink' : 'border-ivory/20 text-ivory/60 hover:text-ivory'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {b.service === 'airport' && (
        <Field label="Flight number (optional)" className="col-span-2 sm:col-span-1">
          <input className="field" value={b.flight} onChange={set('flight')} placeholder="e.g. BA 083" />
        </Field>
      )}

      {usesDuration(b.service) && (
        <Field label="Duration" className="col-span-2 sm:col-span-1">
          <select className="field cursor-pointer" value={b.duration} onChange={set('duration')}>
            {DURATIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
      )}

      {b.service === 'tours' && (
        <Field label="Experience" className="col-span-2">
          <select
            className="field cursor-pointer"
            value={b.experience}
            onChange={(e) => patch(experiencePatch(b, e.target.value))}
          >
            <option value="">Let our concierge curate it</option>
            {city.places.map((p) => {
              const label = experienceLabel(p);
              return (
                <option key={p.name} value={label}>
                  {label}
                </option>
              );
            })}
          </select>
        </Field>
      )}
    </div>
  );
}

// ── Step 2: Vehicle ──

function StepVehicle({
  b,
  errors,
  patch,
}: {
  b: Booking;
  errors: BookingErrors;
  patch: (p: Partial<Booking>) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(b.vehicleCategory || null);

  return (
    <div>
      <p className="font-display text-xl italic text-ivory/60">
        Open a category and choose the vehicle for your journey.
      </p>
      {errors.selectedVehicle && (
        <p role="alert" className="mt-3 text-[0.72rem] tracking-wide text-sky">
          {errors.selectedVehicle}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {vehicleCategories.map((c) => {
          const selected = b.vehicleCategory === c.id;
          const isOpen = expanded === c.id;
          return (
            <li
              key={c.id}
              className={`border transition-colors duration-200 ${selected ? 'border-sky' : 'border-ivory/15 hover:border-ivory/30'}`}
            >
              <button
                type="button"
                onClick={() => {
                  setExpanded(isOpen ? null : c.id);
                  if (!selected) patch({ vehicleCategory: c.id, selectedVehicle: '' });
                }}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
              >
                <span>
                  <span className="display block text-3xl">{c.name}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-ivory/55">{c.description}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="font-display text-lg italic text-sky">{c.startingPrice}</span>
                  <span className="eyebrow mt-2 block text-ivory/40">
                    {isOpen ? 'Hide' : `${c.vehicles.length} vehicles`}
                  </span>
                </span>
              </button>

              {isOpen && (
                <div
                  role="radiogroup"
                  aria-label={`${c.name} vehicles`}
                  className="border-t border-ivory/10 px-3 py-3 transition-[opacity,translate] duration-200 ease-out starting:-translate-y-1 starting:opacity-0"
                >
                  {c.vehicles.map((v) => {
                    const on = b.selectedVehicle === v.label && selected;
                    return (
                      <button
                        key={v.label}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => patch({ vehicleCategory: c.id, selectedVehicle: v.label })}
                        className={`press flex w-full items-center justify-between gap-4 px-3 py-3 text-left ${
                          on ? 'bg-sky text-ink' : 'text-ivory/80 hover:bg-ivory/5'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 shrink-0 rotate-45 ${on ? 'bg-ink' : 'border border-ivory/30'}`}
                          />
                          {v.label}
                        </span>
                        <span className={`whitespace-nowrap font-display text-lg ${on ? '' : 'text-sky'}`}>
                          {v.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-center">
        <Link
          to="/terms"
          target="_blank"
          className="eyebrow link-underline text-ivory/60 transition-colors duration-200 hover:text-sky"
        >
          View full terms and rates ↗
        </Link>
      </p>
    </div>
  );
}

// ── Step 3: Details ──

function StepDetails({ b, errors, set }: { b: Booking; errors: BookingErrors; set: SetFn }) {
  return (
    <div className="grid grid-cols-2 content-start gap-x-8 gap-y-8">
      <p className="eyebrow col-span-2 text-ivory/40">Who are we welcoming?</p>
      <Field label="Full name" error={errors.fullName} className="col-span-2">
        <input className="field" value={b.fullName} onChange={set('fullName')} autoComplete="name" />
      </Field>
      <Field label="Phone or WhatsApp" error={errors.phoneNumber} className="col-span-2 sm:col-span-1">
        <input
          className="field"
          type="tel"
          value={b.phoneNumber}
          onChange={set('phoneNumber')}
          autoComplete="tel"
          placeholder="+234 801 234 5678"
        />
      </Field>
      <Field label="Email" error={errors.email} className="col-span-2 sm:col-span-1">
        <input
          className="field"
          type="email"
          value={b.email}
          onChange={set('email')}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Anything we should know? (optional)" className="col-span-2">
        <textarea
          rows={3}
          className="field resize-none"
          value={b.specialRequest}
          onChange={set('specialRequest')}
          placeholder="A child seat, a favourite playlist, a quiet ride..."
        />
      </Field>
    </div>
  );
}

// ── Step 4: Review ──

function StepReview({
  b,
  onEdit,
  agreed,
  onAgree,
  error,
}: {
  b: Booking;
  onEdit: (step: number) => void;
  agreed: boolean;
  onAgree: (v: boolean) => void;
  error?: string;
}) {
  const distance = estimatedDistance(b);
  const price = vehiclePrice(b.vehicleCategory, b.selectedVehicle);

  const trip: [string, string][] = [
    ['Service', serviceTitle(b.service)],
    ['When', `${formatDate(b.date)} at ${b.time}`],
    ['Pickup', b.pickupLocation],
    ['Drop off', b.dropoffLocation],
    ['Drop-off date', b.dropoffDate ? formatDate(b.dropoffDate) : 'Not set'],
    ['Ride', b.rideType === 'one-way' ? 'One way' : 'Round trip'],
    ['Passengers', b.passengers],
  ];
  if (b.service === 'airport' && b.flight) trip.push(['Flight', b.flight]);
  if (usesDuration(b.service)) trip.push(['Duration', b.duration]);
  if (b.service === 'tours' && b.experience) trip.push(['Experience', b.experience]);
  if (b.event) trip.push(['Event', b.event]);
  if (distance) trip.push(['Distance', distanceText(distance)]);

  const vehicle: [string, string][] = [
    ['Category', categoryName(b.vehicleCategory)],
    ['Vehicle', b.selectedVehicle],
  ];
  if (price) vehicle.push(['Rate', `${price} per day`]);

  const details: [string, string][] = [
    ['Name', b.fullName],
    ['Phone', b.phoneNumber],
    ['Email', b.email],
  ];
  if (b.specialRequest) details.push(['Notes', b.specialRequest]);

  return (
    <div className="space-y-6">
      <ReviewBlock title="Trip" rows={trip} onEdit={() => onEdit(1)} />
      <ReviewBlock title="Vehicle" rows={vehicle} onEdit={() => onEdit(2)} />
      <ReviewBlock title="Details" rows={details} onEdit={() => onEdit(3)} />

      <label
        className={`flex cursor-pointer items-start gap-4 border px-6 py-5 transition-colors duration-200 ${
          error ? 'border-sky' : 'border-ivory/15'
        }`}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgree(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-sky"
        />
        <span className="text-sm leading-relaxed text-ivory/70">
          I have read and agree to the{' '}
          <Link to="/terms" target="_blank" className="text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-sky">
            Terms and Rates
          </Link>
          , including the cancellation policy (100% charge for no-shows, 50% if cancelled 24+ hours in advance).
        </span>
      </label>
      {error && (
        <p role="alert" className="-mt-3 text-[0.72rem] tracking-wide text-sky">
          {error}
        </p>
      )}
    </div>
  );
}

function ReviewBlock({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <div className="border border-ivory/15">
      <div className="flex items-baseline justify-between border-b border-ivory/10 px-6 py-4">
        <span className="eyebrow text-sky">{title}</span>
        <button type="button" onClick={onEdit} className="press eyebrow text-ivory/50 hover:text-sky">
          Edit
        </button>
      </div>
      <dl className="divide-y divide-ivory/10">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 px-6 py-3">
            <dt className="eyebrow pt-1 text-ivory/40">{k}</dt>
            <dd className="font-display text-lg break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ── Shared ──

function Field({
  label,
  error,
  className = '',
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`relative block ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {error && (
        <span
          role="alert"
          className="mt-2 block text-[0.72rem] tracking-wide text-sky transition-[opacity,translate] duration-200 ease-out starting:-translate-y-1 starting:opacity-0"
        >
          {error}
        </span>
      )}
    </label>
  );
}

// ── Confirmation ──

function Confirmation({ b, refCode, onDone }: { b: Booking; refCode: string; onDone: () => void }) {
  return (
    <div className="flex flex-1 animate-swap flex-col overflow-y-auto px-8 py-8">
      <p className="text-lg leading-relaxed text-ivory/70">
        Your reservation is held. A Perficient concierge will call you on{' '}
        <span className="text-ivory">{b.phoneNumber}</span> to confirm your chauffeur and vehicle.
      </p>

      <div className="mt-8 border border-ivory/15">
        <div className="flex items-baseline justify-between border-b border-ivory/10 px-6 py-4">
          <span className="eyebrow text-ivory/50">Reference</span>
          <span className="font-display text-2xl tracking-[0.12em] text-sky">{refCode}</span>
        </div>
        <dl className="divide-y divide-ivory/10">
          {summaryLines(b).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 px-6 py-3">
              <dt className="eyebrow pt-1 text-ivory/40">{k}</dt>
              <dd className="font-display text-lg break-words">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-6 text-sm text-ivory/50">
        A confirmation email has been sent to <span className="text-ivory/80">{b.email}</span>.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a href={whatsappLink(b, refCode)} target="_blank" rel="noreferrer" className="btn-sky">
          Send on WhatsApp
        </a>
        <a href={BRAND.phoneHref} className="btn-line">
          Call concierge
        </a>
      </div>
      <button type="button" onClick={onDone} className="press eyebrow mx-auto mt-10 text-ivory/50 hover:text-sky">
        Back to the city
      </button>
    </div>
  );
}

// ── Address pop-up ──

function AddressNotice({
  notice,
  onClose,
  onSwitch,
}: {
  notice: Notice;
  onClose: () => void;
  onSwitch: (city: CityName) => void;
}) {
  const primary = useRef<HTMLButtonElement>(null);
  useEffect(() => primary.current?.focus(), [notice]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/75 p-6 backdrop-blur-sm transition-opacity duration-200 ease-out starting:opacity-0">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="address-notice-title"
        aria-describedby="address-notice-message"
        className="w-full max-w-md border border-sky/40 bg-ink-3 px-7 py-8 shadow-2xl transition-[opacity,translate] duration-300 ease-out starting:translate-y-2 starting:opacity-0"
      >
        <p className="eyebrow text-sky">Check your address</p>
        <h3 id="address-notice-title" className="display mt-4 text-3xl">
          {notice.title}
        </h3>
        <p id="address-notice-message" className="mt-4 leading-relaxed text-ivory/75">
          {notice.message}
        </p>
        <div className="mt-8 grid gap-3">
          <button ref={primary} type="button" onClick={onClose} className="btn-sky w-full">
            {notice.dismiss}
          </button>
          {notice.switchTo && (
            <button type="button" onClick={() => onSwitch(notice.switchTo!)} className="btn-line w-full">
              Switch my city to {notice.switchTo}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
