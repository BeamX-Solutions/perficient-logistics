// December 2026 seasonal offers. Regular rates stay on sale alongside these.
//
// Payment links are Paystack Payment Pages, set per environment (Netlify env vars):
//   VITE_PAYSTACK_PRADO_OFFER_URL  e.g. https://paystack.com/pay/perficient-prado-december
//   VITE_PAYSTACK_SEDAN_OFFER_URL  e.g. https://paystack.com/pay/perficient-sedan-december
// When a link is missing the card falls back to booking without online payment.

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
  paystackUrl: string | null;
}

function paymentUrl(value: string | undefined): string | null {
  const url = value?.trim();
  return url && url.startsWith('https://') ? url : null;
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
    includes: ['Toyota Prado with professional driver', '3 days, 10 hours per day'],
    paystackUrl: paymentUrl(import.meta.env.VITE_PAYSTACK_PRADO_OFFER_URL),
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
    includes: ['Car, driver and fuel included', '7 days, 10 hours per day'],
    paystackUrl: paymentUrl(import.meta.env.VITE_PAYSTACK_SEDAN_OFFER_URL),
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

/** Last day of the package, counting the pickup day as day one. */
export function offerEndDate(o: Offer, pickupDate: string) {
  if (!pickupDate) return '';
  const d = new Date(`${pickupDate}T00:00:00`);
  d.setDate(d.getDate() + o.days - 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
