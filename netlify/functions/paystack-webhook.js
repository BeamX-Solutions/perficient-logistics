import crypto from 'node:crypto';
import { markPaid, missingConfig, paystack } from '../lib/payments.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  if (missingConfig().length) {
    console.error('Payments not configured; ignoring webhook');
    return { statusCode: 500, body: 'Not configured' };
  }

  const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
  const expected = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(raw).digest('hex');
  const given = String(event.headers['x-paystack-signature'] || '');
  const valid =
    given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!valid) return { statusCode: 401, body: 'Invalid signature' };

  try {
    const payload = JSON.parse(raw);
    const reference = payload?.data?.reference;
    if (payload.event === 'charge.success' && typeof reference === 'string' && reference.startsWith('PL-')) {
      // Confirm with Paystack directly rather than trusting the payload alone.
      const tx = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
      await markPaid(reference, tx);
    }
  } catch (err) {
    console.error('paystack-webhook error:', err);
  }
  return { statusCode: 200, body: 'ok' };
};
