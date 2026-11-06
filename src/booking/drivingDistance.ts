import type { LatLon } from './BookingContext';
import { GOOGLE_MAPS_KEY, loadGoogleMapsScript } from './googleMaps';

export interface Route {
  km: number;
  minutes: number;
}

// Driving distance and time from Google, so the estimate follows the roads
// rather than a straight line (Lagos trips around the lagoon run ~40% longer).
export async function drivingRoute(from: LatLon, to: LatLon): Promise<Route | null> {
  if (!GOOGLE_MAPS_KEY) return null;
  await loadGoogleMapsScript();
  const { rows } = await new window.google.maps.DistanceMatrixService().getDistanceMatrix({
    origins: [{ lat: from.lat, lng: from.lon }],
    destinations: [{ lat: to.lat, lng: to.lon }],
    travelMode: window.google.maps.TravelMode.DRIVING,
  });
  const el = rows[0]?.elements[0];
  if (!el || el.status !== 'OK') return null;
  return { km: el.distance.value / 1000, minutes: el.duration.value / 60 };
}
