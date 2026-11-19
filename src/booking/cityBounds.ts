import type { CityName, ServiceId } from '../data/site';
import type { LatLon } from './BookingContext';

// Addresses offered and accepted for each city. Rough rectangles, so the
// commuter fringe just across the state line (Suleja, Mararaba) still counts.
export interface Bounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export const CITY_BOUNDS: Record<CityName, Bounds> = {
  Abuja: { south: 8.38, west: 6.74, north: 9.4, east: 7.62 }, // FCT
  Lagos: { south: 6.36, west: 2.69, north: 6.72, east: 4.36 }, // Lagos State
};

export function inCity(city: CityName, c: LatLon | null): boolean {
  if (!c) return false;
  const b = CITY_BOUNDS[city];
  return c.lat >= b.south && c.lat <= b.north && c.lon >= b.west && c.lon <= b.east;
}

/** Which of our cities an address falls in, if any. */
export function cityOf(c: LatLon | null): CityName | null {
  return (Object.keys(CITY_BOUNDS) as CityName[]).find((city) => inCity(city, c)) ?? null;
}

/** Short message shown under the address field. */
export function wrongCityError(city: CityName, c: LatLon) {
  const other = cityOf(c);
  return other ? `This address is in ${other}, not ${city}.` : `This address is outside ${city}.`;
}

export const PICK_FROM_LIST = 'Choose an address from the suggestions';

/** Inter-state trips start in the city but may end anywhere in Nigeria. */
export function restrictsDropoff(service: ServiceId) {
  return service !== 'interstate';
}
