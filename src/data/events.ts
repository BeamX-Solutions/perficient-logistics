import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { DURATIONS, timeSlots, type Booking, type LatLon } from '../booking/BookingContext';
import { supabase } from '../lib/supabase';
import type { CityName } from './site';

// Events are published by staff at /admin/events and stored in Supabase
// (see supabase/migrations/20261109_events.sql).

export const EVENT_IMAGES_BUCKET = 'event-images';
export const EVENT_CATEGORIES = ['Concert', 'Festival', 'Conference', 'Sport', 'Nightlife', 'Art', 'Fashion', 'Food'];

export interface EventRow {
  id: string;
  city: CityName;
  title: string;
  category: string | null;
  description: string | null;
  venue_name: string;
  address: string;
  lat: number | null;
  lon: number | null;
  starts_at: string;
  ends_at: string | null;
  image_path: string | null;
  ticket_url: string | null;
  published: boolean;
}

export interface SiteEvent {
  id: string;
  city: CityName;
  title: string;
  category: string;
  description: string;
  venueName: string;
  address: string;
  coords: LatLon | null;
  startsAt: Date;
  endsAt: Date | null;
  imageUrl: string | null;
  ticketUrl: string | null;
}

export function eventImageUrl(client: SupabaseClient, path: string | null) {
  return path ? client.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl : null;
}

export function toSiteEvent(row: EventRow, client: SupabaseClient): SiteEvent {
  return {
    id: row.id,
    city: row.city,
    title: row.title,
    category: row.category ?? '',
    description: row.description ?? '',
    venueName: row.venue_name,
    address: row.address,
    coords: row.lat != null && row.lon != null ? { lat: row.lat, lon: row.lon } : null,
    startsAt: new Date(row.starts_at),
    endsAt: row.ends_at ? new Date(row.ends_at) : null,
    imageUrl: eventImageUrl(client, row.image_path),
    ticketUrl: row.ticket_url,
  };
}

export async function fetchUpcomingEvents(): Promise<SiteEvent[]> {
  if (!supabase) return [];
  const client = supabase;
  const { data, error } = await client
    .from('events')
    .select('*')
    .eq('published', true)
    .order('starts_at', { ascending: true })
    .limit(40);
  if (error) throw error;
  const now = Date.now();
  return (data as EventRow[])
    .map((row) => toSiteEvent(row, client))
    .filter((e) => (e.endsAt ?? e.startsAt).getTime() > now);
}

export function useUpcomingEvents() {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let stale = false;
    fetchUpcomingEvents()
      .then((list) => {
        if (!stale) setEvents(list);
      })
      .catch((err) => {
        console.error('Could not load events:', err);
        if (!stale) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, []);

  return { events, loading, error };
}

// ── Lagos time (UTC+1 all year, no daylight saving) ──

const TZ = 'Africa/Lagos';

function parts(d: Date) {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(d);
  const get = (t: Intl.DateTimeFormatPartTypes) => p.find((x) => x.type === t)?.value ?? '';
  return { y: get('year'), m: get('month'), d: get('day'), h: get('hour'), min: get('minute') };
}

/** `YYYY-MM-DD` in Lagos. */
export function lagosDate(d: Date) {
  const p = parts(d);
  return `${p.y}-${p.m}-${p.d}`;
}

/** `HH:mm` in Lagos. */
export function lagosTime(d: Date) {
  const p = parts(d);
  return `${p.h}:${p.min}`;
}

/** A Lagos wall-clock date and time as an absolute instant. */
export function fromLagos(date: string, time: string) {
  return new Date(`${date}T${time}:00+01:00`);
}

export function formatEventDay(d: Date) {
  return d.toLocaleDateString('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatEventTime(d: Date) {
  return d.toLocaleTimeString('en-GB', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });
}

/** e.g. "Sat 13 Dec · 8:00 pm" */
export function formatEventWhen(e: Pick<SiteEvent, 'startsAt'>) {
  return `${formatEventDay(e.startsAt)} · ${formatEventTime(e.startsAt)}`;
}

/** Date badge, e.g. { day: "13", month: "DEC" } */
export function eventBadge(d: Date) {
  return {
    day: d.toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric' }),
    month: d.toLocaleDateString('en-GB', { timeZone: TZ, month: 'short' }).toUpperCase(),
  };
}

/** e.g. "Afro Nation · Eko Atlantic, Sat 13 Dec 8:00 pm" */
export function eventLabel(e: SiteEvent) {
  return `${e.title} · ${e.venueName}, ${formatEventDay(e.startsAt)} ${formatEventTime(e.startsAt)}`;
}

/** Venue name and address, without repeating the name when the address already starts with it. */
export function venueAddress(e: Pick<SiteEvent, 'venueName' | 'address'>) {
  return e.address.toLowerCase().startsWith(e.venueName.toLowerCase()) ? e.address : `${e.venueName}, ${e.address}`;
}

// ── Booking prefill ──

const PICKUP_LEAD_MINUTES = 60;

function durationFor(e: SiteEvent) {
  if (!e.endsAt) return 'Half day (5 hours)';
  // Time at the event plus roughly two hours of driving and waiting.
  const hours = (e.endsAt.getTime() - e.startsAt.getTime()) / 3_600_000 + 2;
  if (hours <= 3) return DURATIONS[0];
  if (hours <= 5) return DURATIONS[1];
  if (hours <= 10) return DURATIONS[2];
  return DURATIONS[3];
}

/** Everything the booking drawer needs to take a guest to this event. */
export function eventPatch(e: SiteEvent, now = new Date()): Partial<Booking> {
  const pickup = new Date(e.startsAt.getTime() - PICKUP_LEAD_MINUTES * 60_000);
  const date = lagosDate(pickup);
  const [h, m] = lagosTime(pickup).split(':').map(Number);
  const slot = `${String(h).padStart(2, '0')}:${m < 30 ? '00' : '30'}`;
  return {
    city: e.city,
    service: 'chauffeur',
    experience: '',
    rideType: 'round-trip',
    date,
    // Too soon for the usual notice: leave it for the guest to choose.
    time: timeSlots(date, now).includes(slot) ? slot : '',
    dropoffLocation: venueAddress(e),
    dropoffCoords: e.coords,
    duration: durationFor(e),
    event: eventLabel(e),
  };
}
