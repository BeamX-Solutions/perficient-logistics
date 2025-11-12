/*
  # Create bookings and newsletter tables

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `service_type` (text) - Airport Shuttle, Full-Day Personal Chauffeur, or VIP Event & Special Rides
      - `pickup_location` (text)
      - `dropoff_location` (text)
      - `pickup_date` (date)
      - `pickup_time` (time)
      - `dropoff_date` (date, nullable)
      - `dropoff_time` (time, nullable)
      - `passengers` (integer)
      - `ride_type` (text) - one way or round trip
      - `full_name` (text)
      - `phone_number` (text)
      - `special_request` (text, nullable)
      - `created_at` (timestamp)
    
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscribed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public insert access (bookings and newsletter signups)
    - Add policies for authenticated admin access to view data
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  pickup_date date NOT NULL,
  pickup_time time NOT NULL,
  dropoff_date date,
  dropoff_time time,
  passengers integer NOT NULL DEFAULT 1,
  ride_type text NOT NULL DEFAULT 'one-way',
  full_name text NOT NULL,
  phone_number text NOT NULL,
  special_request text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a booking"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);