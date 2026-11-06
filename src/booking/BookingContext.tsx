/* eslint-disable react-refresh/only-export-components -- the context file also exports its helpers */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CITIES, SERVICES, type CityName, type Place, type ServiceId } from '../data/site';
import { drivingRoute, type Route } from './drivingDistance';

// Booking state lives here so any section of the page (city guide, services,
// fleet) can prefill the reservation and open the booking drawer.
// The real submission (Supabase + email) lives in ./submitBooking.ts.

export interface LatLon {
  lat: number;
  lon: number;
}

export interface Booking {
  // From the hero booking bar
  city: CityName;
  service: ServiceId;
  date: string;
  time: string;
  // Service specific extras
  flight: string;
  duration: string;
  experience: string;
  // Trip
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoords: LatLon | null;
  dropoffCoords: LatLon | null;
  /** Driving distance/time between the two, filled in from Google once both are known. */
  route: Route | null;
  dropoffDate: string;
  passengers: string;
  rideType: 'one-way' | 'round-trip';
  // Vehicle
  vehicleCategory: string;
  selectedVehicle: string;
  // Guest
  fullName: string;
  phoneNumber: string;
  email: string;
  specialRequest: string;
}

export type BookingErrors = Partial<Record<keyof Booking | 'terms', string>>;

export function todayISO(d = new Date()) {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function timeSlots(date: string, now = new Date()) {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  if (date !== todayISO(now)) return slots;
  // Same day bookings need at least an hour of notice.
  const cutoff = now.getHours() * 60 + now.getMinutes() + 60;
  return slots.filter((s) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m >= cutoff;
  });
}

export function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export const EMPTY: Booking = {
  city: 'Abuja',
  service: 'chauffeur',
  date: '',
  time: '',
  flight: '',
  duration: 'Half day (5 hours)',
  experience: '',
  pickupLocation: '',
  dropoffLocation: '',
  pickupCoords: null,
  dropoffCoords: null,
  route: null,
  dropoffDate: '',
  passengers: '1',
  rideType: 'round-trip',
  vehicleCategory: '',
  selectedVehicle: '',
  fullName: '',
  phoneNumber: '',
  email: '',
  specialRequest: '',
};

export const DURATIONS = ['3 hours', 'Half day (5 hours)', 'Full day (10 hours)', 'Several days'];

export const usesDuration = (s: ServiceId) => ['chauffeur', 'tours', 'protocol'].includes(s);

export function validateTrip(b: Pick<Booking, 'date' | 'time'>, now = new Date()) {
  const e: BookingErrors = {};
  if (!b.date) e.date = 'Choose a date';
  if (!b.time) e.time = 'Choose a time';
  if (b.date && b.time && new Date(`${b.date}T${b.time}`) < now) e.time = 'Please choose a later time';
  return e;
}

export function serviceTitle(id: ServiceId) {
  return SERVICES.find((s) => s.id === id)?.title ?? id;
}

export const experienceLabel = (p: Place) => `${p.verb ?? 'A day at'} ${p.name}`;

function placeFor(city: CityName, experience: string) {
  return experience ? CITIES[city].places.find((p) => experienceLabel(p) === experience) : undefined;
}

// Switch the experience (and optionally the city) and keep the drop-off in step:
// the place becomes the drop-off unless the guest has typed their own.
export function experiencePatch(b: Booking, experience: string, city: CityName = b.city): Partial<Booking> {
  const patch: Partial<Booking> = { city, experience };
  const next = placeFor(city, experience);
  if (next) {
    // Choosing a place is an explicit "take me there", so it always wins,
    // even over an address the guest picked or typed earlier.
    patch.dropoffLocation = next.address;
    patch.dropoffCoords = next.coords;
    return patch;
  }
  // Clearing the experience only clears a drop-off that still points at the old place.
  // Google may have reworded its address, so compare by position, not text.
  const prev = placeFor(b.city, b.experience);
  if (prev && (b.dropoffLocation === prev.address || isNear(b.dropoffCoords, prev.coords))) {
    patch.dropoffLocation = '';
    patch.dropoffCoords = null;
  }
  return patch;
}

// Within roughly 300 m: the same venue, however its address is written.
function isNear(a: LatLon | null, b: LatLon) {
  return !!a && Math.abs(a.lat - b.lat) < 0.003 && Math.abs(a.lon - b.lon) < 0.003;
}

interface BookingContextValue {
  booking: Booking;
  update: (patch: Partial<Booking>) => void;
  plan: (patch?: Partial<Booking>, opts?: { open?: boolean }) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(EMPTY);
  const [open, setOpen] = useState(false);

  const update = useCallback((patch: Partial<Booking>) => setBooking((b) => ({ ...b, ...patch })), []);

  // Look up the driving route whenever either end changes.
  const { pickupCoords: from, dropoffCoords: to } = booking;
  useEffect(() => {
    setBooking((b) => (b.route ? { ...b, route: null } : b));
    if (!from || !to) return;
    let stale = false;
    drivingRoute(from, to)
      .then((route) => {
        if (!stale) setBooking((b) => ({ ...b, route }));
      })
      .catch((err) => console.error('Driving distance lookup failed:', err));
    return () => {
      stale = true;
    };
  }, [from, to]);

  // Prefill from anywhere on the page, then take the guest to the booking bar,
  // or straight into the booking drawer when there is enough to start from.
  const plan = useCallback((patch: Partial<Booking> = {}, opts: { open?: boolean } = {}) => {
    setBooking((b) => ({ ...b, ...patch }));
    if (opts.open) setOpen(true);
    else document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const reset = useCallback(() => {
    setBooking((b) => ({ ...EMPTY, city: b.city }));
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ booking, update, plan, open, setOpen, reset }),
    [booking, update, plan, open, reset],
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}
