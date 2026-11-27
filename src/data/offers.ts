// December 2026 seasonal offers. Regular rates stay on sale alongside these.

export interface Offer {
  id: string;
  title: string;
  tagline: string;
  /** Vehicle category in vehicleData.ts the offer belongs to. */
  categoryId: string;
  /** Vehicles the guest can choose for this offer. */
  vehicles: string[];
  days: number;
  hoursPerDay: number;
  regularDailyRate: number;
  price: number;
  includes: string[];
}

export const OFFERS: Offer[] = [
  {
    id: 'prado-3-day',
    title: 'Luxury 3-Day Package',
    tagline: 'Toyota Prado',
    categoryId: 'premium-suv',
    vehicles: ['Toyota Prado'],
    days: 3,
    hoursPerDay: 10,
    regularDailyRate: 170000,
    price: 450000,
    includes: ['Toyota Prado with professional driver', '3 days, 10 hours per day', 'Within one state, no interstate travel'],
  },
  {
    id: 'sedan-1-week',
    title: 'Sedan 1-Week Package',
    tagline: 'Toyota Camry or Corolla',
    categoryId: 'economy',
    vehicles: ['Toyota Camry', 'Toyota Corolla'],
    days: 7,
    hoursPerDay: 10,
    regularDailyRate: 80000,
    price: 500000,
    includes: ['Car, driver and fuel included', '7 days, 10 hours per day', 'Within one state, no interstate travel'],
  },
];

/** Offers stop showing once December 2026 is over (Lagos time). */
export const OFFERS_END = new Date('2027-01-01T00:00:00+01:00');

export function offersActive(now = new Date()) {
  return now < OFFERS_END;
}

export const regularPrice = (o: Offer) => o.regularDailyRate * o.days;
export const savings = (o: Offer) => regularPrice(o) - o.price;

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function offerById(id: string): Offer | undefined {
  return OFFERS.find((o) => o.id === id);
}

/** Label stored as the booked vehicle, e.g. "Toyota Camry (Sedan 1-Week Package)". */
export const offerVehicleLabel = (o: Offer, vehicle: string) => `${vehicle} (${o.title})`;

/** One line for the booking record and the staff email. */
export function offerSummary(o: Offer) {
  return `December offer: ${o.title}, ${formatNaira(o.price)} for ${o.days} days (${o.hoursPerDay} hrs/day)`;
}

/** A picked address: its position and, when Google knows it, its state. */
export interface PlacePoint {
  lat: number;
  lon: number;
  state?: string;
}

export interface OfferLocationError {
  /** 'interstate' is shown straight away; 'unverified' only once the guest tries to continue. */
  kind: 'interstate' | 'unverified';
  message: string;
}

/**
 * December offers cover travel within one state only. Returns why the trip
 * doesn't qualify, or null when it does. `canVerify` is false when address
 * suggestions are unavailable, in which case staff check it on confirmation.
 */
export function sameStateError(
  pickup: PlacePoint | null,
  dropoff: PlacePoint | null,
  canVerify: boolean,
): OfferLocationError | null {
  if (!pickup || !dropoff) {
    return canVerify
      ? { kind: 'unverified', message: 'Choose both addresses from the suggestions so we can confirm they are in the same state.' }
      : null;
  }
  if (pickup.state && dropoff.state && pickup.state !== dropoff.state) {
    return { kind: 'interstate', message: `December offers cover trips within one state only. Your pickup is in ${pickup.state} and your drop-off is in ${dropoff.state}. Choose a drop-off in ${pickup.state}, or book at regular rates for interstate travel.` };
  }
  return null;
}

/** Last day of the package, counting the pickup day as day one. */
export function offerEndDate(o: Offer, pickupDate: string) {
  if (!pickupDate) return '';
  const d = new Date(`${pickupDate}T00:00:00`);
  d.setDate(d.getDate() + o.days - 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
