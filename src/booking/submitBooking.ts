import { supabase } from '../lib/supabase';
import { vehicleCategories } from '../data/vehicleData';
import { BRAND } from '../data/site';
import {
  formatDate,
  serviceTitle,
  usesDuration,
  validateTrip,
  type Booking,
  type BookingErrors,
  type LatLon,
} from './BookingContext';

// ── Distance ──

export function haversineDistance(a: LatLon, b: LatLon): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Prefer Google's driving distance; fall back to a straight line only if that lookup failed.
export function estimatedDistance(b: Booking): { km: number; minutes: number | null; byRoad: boolean } | null {
  if (b.route) return { km: b.route.km, minutes: b.route.minutes, byRoad: true };
  if (b.pickupCoords && b.dropoffCoords) {
    return { km: haversineDistance(b.pickupCoords, b.dropoffCoords), minutes: null, byRoad: false };
  }
  return null;
}

export function distanceText(d: NonNullable<ReturnType<typeof estimatedDistance>>) {
  if (!d.byRoad) return `About ${Math.round(d.km)} km (straight line)`;
  const mins = d.minutes ?? 0;
  const time = mins >= 60 ? `${Math.floor(mins / 60)} h ${Math.round(mins % 60)} min` : `${Math.round(mins)} min`;
  return `About ${Math.round(d.km)} km by road, ${time} drive`;
}

// ── Vehicles ──

export function vehiclePrice(categoryId: string, vehicleLabel: string): string | null {
  const category = vehicleCategories.find((c) => c.id === categoryId);
  return category?.vehicles.find((v) => v.label === vehicleLabel)?.price ?? null;
}

export function categoryName(categoryId: string): string {
  return vehicleCategories.find((c) => c.id === categoryId)?.name ?? categoryId;
}

// ── Validation (same rules as the previous booking wizard) ──

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidNigerianPhone(phone: string) {
  // +234XXXXXXXXXX or 0XXXXXXXXXX
  const digits = phone.replace(/[\s\-()]/g, '');
  return /^\+234\d{10}$/.test(digits) || /^0[7-9]\d{9}$/.test(digits);
}

export function validateStep(step: number, b: Booking): BookingErrors {
  const e: BookingErrors = {};
  if (step === 1) {
    Object.assign(e, validateTrip(b));
    if (!b.pickupLocation.trim()) e.pickupLocation = 'Where should we collect you?';
    if (!b.dropoffLocation.trim()) e.dropoffLocation = 'Where shall we take you?';
    if (b.dropoffDate && b.date && b.dropoffDate < b.date) {
      e.dropoffDate = 'Drop-off date cannot be before pick-up date';
    }
  }
  if (step === 2) {
    if (!b.vehicleCategory || !b.selectedVehicle) e.selectedVehicle = 'Open a category and choose a vehicle';
  }
  if (step === 3) {
    if (!b.fullName.trim()) e.fullName = 'Your name, please';
    if (!b.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    else if (!isValidNigerianPhone(b.phoneNumber)) {
      e.phoneNumber = 'Enter a valid Nigerian number (e.g. +2348012345678 or 08012345678)';
    }
    if (!b.email.trim()) e.email = 'Email address is required';
    else if (!EMAIL_RE.test(b.email)) e.email = 'Please check this email';
  }
  return e;
}

// ── Summary ──

export function summaryLines(b: Booking): [string, string][] {
  const lines: [string, string][] = [
    ['Service', serviceTitle(b.service)],
    ['City', b.city],
    ['When', `${formatDate(b.date)} at ${b.time}`],
    ['Pickup', b.pickupLocation],
    ['Drop off', b.dropoffLocation],
  ];
  if (b.dropoffDate) lines.push(['Until', formatDate(b.dropoffDate)]);
  lines.push(['Ride', b.rideType === 'one-way' ? 'One way' : 'Round trip']);
  if (b.service === 'airport' && b.flight) lines.push(['Flight', b.flight]);
  if (usesDuration(b.service)) lines.push(['Duration', b.duration]);
  if (b.service === 'tours' && b.experience) lines.push(['Experience', b.experience]);
  const distance = estimatedDistance(b);
  if (distance) lines.push(['Distance', distanceText(distance)]);
  lines.push(['Vehicle', b.selectedVehicle || categoryName(b.vehicleCategory)]);
  const price = vehiclePrice(b.vehicleCategory, b.selectedVehicle);
  if (price) lines.push(['Rate', `${price} per day`]);
  lines.push(['Guests', b.passengers], ['Name', b.fullName], ['Phone', b.phoneNumber], ['Email', b.email]);
  if (b.specialRequest) lines.push(['Notes', b.specialRequest]);
  return lines;
}

export function whatsappLink(b: Booking, ref: string) {
  const text = [`Hello ${BRAND.fullName}, I would like to confirm reservation ${ref}.`, '']
    .concat(summaryLines(b).map(([k, v]) => `${k}: ${v}`))
    .join('\n');
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function makeReference(b: Booking) {
  return `PS-${b.city.slice(0, 3).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// ── Submit: Supabase insert, then the Netlify email notification ──

export async function submitBooking(b: Booking): Promise<{ ref: string }> {
  const ref = makeReference(b);
  const distance = estimatedDistance(b);
  const flightNumber = b.service === 'airport' ? b.flight : '';
  const duration = usesDuration(b.service) ? b.duration : '';
  const experience = b.service === 'tours' ? b.experience : '';

  // The bookings table has no city/reference/flight columns, so these lead the special request.
  const extras = [
    `City: ${b.city}`,
    `Ref: ${ref}`,
    flightNumber && `Flight: ${flightNumber}`,
    duration && `Duration: ${duration}`,
    experience && `Experience: ${experience}`,
  ]
    .filter(Boolean)
    .join(' · ');
  const specialRequest = b.specialRequest ? `${extras}\n${b.specialRequest}` : extras;

  if (!supabase) throw new Error('Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');

  const { error } = await supabase.from('bookings').insert([
    {
      service_type: serviceTitle(b.service),
      pickup_location: b.pickupLocation,
      dropoff_location: b.dropoffLocation,
      pickup_date: b.date,
      pickup_time: b.time,
      dropoff_date: b.dropoffDate || null,
      passengers: parseInt(b.passengers),
      ride_type: b.rideType,
      vehicle_category: b.vehicleCategory,
      selected_vehicle: b.selectedVehicle || null,
      full_name: b.fullName,
      phone_number: b.phoneNumber,
      email: b.email,
      special_request: specialRequest,
    },
  ]);

  if (error) throw error;

  try {
    const response = await fetch('/.netlify/functions/send-booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceType: serviceTitle(b.service),
        pickupLocation: b.pickupLocation,
        dropoffLocation: b.dropoffLocation,
        pickupDate: b.date,
        pickupTime: b.time,
        dropoffDate: b.dropoffDate,
        passengers: b.passengers,
        rideType: b.rideType,
        vehicleCategory: b.vehicleCategory,
        selectedVehicle: b.selectedVehicle,
        fullName: b.fullName,
        phoneNumber: b.phoneNumber,
        email: b.email,
        specialRequest: b.specialRequest,
        estimatedDistance: distance ? distanceText(distance) : null,
        city: b.city,
        reference: ref,
        flightNumber,
        duration,
        experience,
      }),
    });
    const text = await response.text();
    if (response.ok) {
      console.log('send-booking-email response:', response.status, text);
    } else {
      // 404 here usually means the site is running without Netlify Functions
      // (plain `vite` dev server); use `netlify dev` to test emails locally.
      console.error('send-booking-email failed:', response.status, text.slice(0, 300));
    }
  } catch (emailError) {
    // The booking is saved; a failed notification email should not block the guest.
    console.error('Error sending booking notification email:', emailError);
  }

  return { ref };
}
