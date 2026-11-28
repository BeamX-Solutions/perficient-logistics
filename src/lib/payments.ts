// Browser side of December offer payments. The amount is always set by the
// server from the saved booking; nothing here is trusted for pricing.

const WHATSAPP_NUMBER = '2348052702261';

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function newPaymentReference() {
  return `PL-${crypto.randomUUID()}`;
}

/** What the payment page shows. Display only. */
export interface PaymentSummary {
  offerId: string;
  vehicle: string;
  pickupDate: string;
  pickupTime: string;
  fullName: string;
  email: string;
}

const key = (reference: string) => `payment:${reference}`;

export function savePaymentSummary(reference: string, summary: PaymentSummary) {
  try {
    sessionStorage.setItem(key(reference), JSON.stringify(summary));
  } catch {
    // Storage can be unavailable (private mode); the pages fall back to a generic card.
  }
}

export function loadPaymentSummary(reference: string): PaymentSummary | null {
  try {
    const raw = sessionStorage.getItem(key(reference));
    return raw ? (JSON.parse(raw) as PaymentSummary) : null;
  } catch {
    return null;
  }
}

export function clearPaymentSummary(reference: string) {
  try {
    sessionStorage.removeItem(key(reference));
  } catch {
    // ignore
  }
}

export interface VerifyResult {
  status: 'paid' | 'pending' | 'failed';
  offerTitle?: string;
  amount?: number;
  fullName?: string;
  email?: string;
  pickupDate?: string;
}

/** Ask the server to set up Paystack checkout for this booking. */
export async function initializePayment(reference: string): Promise<{ status?: 'paid'; authorization_url?: string }> {
  const res = await fetch('/.netlify/functions/paystack-initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not start payment');
  return data;
}

export async function verifyPayment(reference: string): Promise<VerifyResult> {
  const res = await fetch(`/.netlify/functions/paystack-verify?reference=${encodeURIComponent(reference)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not check payment');
  return data;
}
