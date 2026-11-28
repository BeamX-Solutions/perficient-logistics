-- Paystack payments for December offers. Run in the Supabase SQL editor.
alter table bookings
  add column if not exists offer_id text,
  add column if not exists payment_reference text unique,
  add column if not exists payment_status text,          -- null (regular) | 'pending' | 'paid'
  add column if not exists payment_amount_kobo integer,
  add column if not exists paystack_authorization_url text,
  add column if not exists paid_at timestamptz;
