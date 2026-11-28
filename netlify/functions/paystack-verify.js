import { offerById } from '../../src/data/offers.ts';
import { findBooking, json, markPaid, missingConfig, paystack } from '../lib/payments.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method Not Allowed' });

  const missing = missingConfig();
  if (missing.length) {
    console.error('Payments not configured, missing:', missing.join(', '));
    return json(500, { error: 'Payments are not configured' });
  }

  const reference = event.queryStringParameters?.reference;
  if (!reference || !/^PL-[0-9a-f-]{36}$/i.test(reference)) {
    return json(400, { error: 'Invalid booking reference' });
  }

  try {
    let booking = await findBooking(reference);
    if (!booking || !booking.offer_id) return json(404, { error: 'Booking not found' });

    let status = booking.payment_status === 'paid' ? 'paid' : 'pending';
    if (status !== 'paid' && booking.paystack_authorization_url) {
      let tx = null;
      try {
        tx = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
      } catch (err) {
        // Paystack answers 400 for a reference it hasn't seen yet. An opened-but-unpaid checkout is 'abandoned', which we treat as pending.
        console.warn('Paystack verify:', err.message);
      }
      if (tx?.status === 'success') {
        booking = (await markPaid(reference, tx)) || booking;
        status = booking.payment_status === 'paid' ? 'paid' : 'failed';
      } else if (tx && ['failed', 'reversed'].includes(tx.status)) {
        status = 'failed';
      }
    }

    return json(200, {
      status,
      offerTitle: offerById(booking.offer_id)?.title,
      amount: booking.payment_amount_kobo ? booking.payment_amount_kobo / 100 : offerById(booking.offer_id)?.price,
      fullName: booking.full_name,
      email: booking.email,
      pickupDate: booking.pickup_date,
    });
  } catch (err) {
    console.error('paystack-verify error:', err);
    return json(502, { error: 'Could not check payment' });
  }
};
