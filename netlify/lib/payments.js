// Shared server code for Paystack payments on December offers.
// Lives outside netlify/functions so Netlify doesn't publish it as an endpoint.
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { offerById, formatNaira } from '../../src/data/offers.ts';

const FROM = 'Perficient Logistics <info@perficientlogisticsltd.com>';
const STAFF = ['perficientlogisticsltd@gmail.com', 'obinna.nweke@beamxsolutions.com'];

export const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export function missingConfig() {
  const required = ['PAYSTACK_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_URL'];
  return required.filter((name) => !process.env[name]);
}

export function supabaseAdmin() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/** Price of the offer in kobo, or null if the offer doesn't exist. */
export function expectedKobo(offerId) {
  const offer = offerById(offerId);
  return offer ? offer.price * 100 : null;
}

export async function paystack(path, init = {}) {
  const res = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status === false) {
    const err = new Error(body.message || `Paystack request failed (${res.status})`);
    err.paystack = body;
    throw err;
  }
  return body.data;
}

export async function findBooking(reference) {
  const { data, error } = await supabaseAdmin()
    .from('bookings')
    .select('*')
    .eq('payment_reference', reference)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** True when Paystack's transaction is a successful, full NGN payment for this booking. */
export function isFullPayment(booking, tx) {
  const amount = expectedKobo(booking.offer_id);
  return !!tx && tx.status === 'success' && tx.currency === 'NGN' && amount !== null && tx.amount === amount;
}

/**
 * Mark the booking paid if the Paystack transaction checks out. Only the call
 * that actually flips the row sends the payment emails, so repeats are safe.
 * Returns the booking (updated or as found), or null if it doesn't exist.
 */
export async function markPaid(reference, tx) {
  const booking = await findBooking(reference);
  if (!booking) return null;
  if (booking.payment_status === 'paid') return booking;
  if (!isFullPayment(booking, tx)) {
    if (tx?.status === 'success') {
      console.error('Paystack payment does not match booking', { reference, amount: tx.amount, currency: tx.currency });
    }
    return booking;
  }

  const { data, error } = await supabaseAdmin()
    .from('bookings')
    .update({
      payment_status: 'paid',
      payment_amount_kobo: tx.amount,
      paid_at: tx.paid_at || new Date().toISOString(),
    })
    .eq('payment_reference', reference)
    .neq('payment_status', 'paid')
    .select();
  if (error) throw error;

  const updated = data?.[0];
  if (!updated) return findBooking(reference); // another call got there first

  try {
    await sendPaymentEmails(updated);
  } catch (err) {
    console.error('Payment email error:', err);
  }
  return updated;
}

async function sendPaymentEmails(booking) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set; skipping payment emails');
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const offer = offerById(booking.offer_id);
  const amount = formatNaira(booking.payment_amount_kobo / 100);
  const e = escapeHtml;

  const details = `
    <p><strong>Package:</strong> ${e(offer?.title || booking.offer_id)}</p>
    <p><strong>Vehicle:</strong> ${e(booking.selected_vehicle || 'N/A')}</p>
    <p><strong>Pickup:</strong> ${e(booking.pickup_location)} on ${e(booking.pickup_date)} at ${e(booking.pickup_time)}</p>
    <p><strong>Last day:</strong> ${e(booking.dropoff_date || 'N/A')}</p>
    <p><strong>Amount paid:</strong> ${e(amount)}</p>
    <p><strong>Paystack reference:</strong> ${e(booking.payment_reference)}</p>
  `;

  const { error: staffError } = await resend.emails.send({
    from: FROM,
    to: STAFF,
    subject: `Payment received – ${offer?.title || 'December offer'} (${amount}) from ${booking.full_name || booking.phone_number || 'customer'}`,
    html: `
      <h2>December offer paid</h2>
      <p><strong>Full Name:</strong> ${e(booking.full_name)}</p>
      <p><strong>Phone Number:</strong> ${e(booking.phone_number)}</p>
      <p><strong>Email:</strong> ${e(booking.email)}</p>
      <hr />
      ${details}
    `,
  });
  if (staffError) console.error('Resend staff payment email error:', staffError);

  if (booking.email) {
    const { error: guestError } = await resend.emails.send({
      from: FROM,
      to: booking.email,
      subject: 'Payment received – your December package is confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://bookings.perficientlogisticsltd.com/logo--2--2.png" alt="Perficient Logistics" style="max-width: 200px; height: auto;" />
          </div>
          <h2 style="color: #1e40af;">Payment received</h2>
          <p>Hi ${e(booking.full_name || 'Valued Customer')},</p>
          <p>Thank you! We've received your payment of ${e(amount)} and your December package is confirmed. We'll be in touch before your start date with driver details.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${details}
          </div>
          <p style="margin-top: 20px;">Best regards,<br/><strong>Perficient Logistics Team</strong></p>
        </div>
      `,
    });
    if (guestError) console.error('Resend guest payment email error:', guestError);
  }
}
