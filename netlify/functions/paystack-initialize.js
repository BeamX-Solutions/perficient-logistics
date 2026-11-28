import { expectedKobo, findBooking, json, missingConfig, paystack, supabaseAdmin } from '../lib/payments.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

  const missing = missingConfig();
  if (missing.length) {
    console.error('Payments not configured, missing:', missing.join(', '));
    return json(500, { error: 'Payments are not configured' });
  }

  try {
    const { reference } = JSON.parse(event.body || '{}');
    if (typeof reference !== 'string' || !/^PL-[0-9a-f-]{36}$/i.test(reference)) {
      return json(400, { error: 'Invalid booking reference' });
    }

    const booking = await findBooking(reference);
    const amount = booking && expectedKobo(booking.offer_id);
    if (!booking || !amount) return json(404, { error: 'Booking not found' });
    if (booking.payment_status === 'paid') return json(200, { status: 'paid' });

    // Paystack won't accept the same reference twice, so reuse the checkout we already opened.
    if (booking.paystack_authorization_url) {
      return json(200, { authorization_url: booking.paystack_authorization_url });
    }

    const origin = process.env.URL || `https://${event.headers.host}`;
    const tx = await paystack('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: booking.email,
        amount,
        currency: 'NGN',
        reference,
        callback_url: `${origin}/payment/complete`,
        metadata: {
          offer_id: booking.offer_id,
          full_name: booking.full_name,
          phone: booking.phone_number,
        },
      }),
    });

    const { error } = await supabaseAdmin()
      .from('bookings')
      .update({ paystack_authorization_url: tx.authorization_url })
      .eq('payment_reference', reference);
    if (error) console.error('Could not store Paystack checkout URL:', error);

    return json(200, { authorization_url: tx.authorization_url });
  } catch (err) {
    console.error('paystack-initialize error:', err, err.paystack);
    return json(502, { error: 'Could not start payment' });
  }
};
