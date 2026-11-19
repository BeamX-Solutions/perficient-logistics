// ── Google Maps JavaScript SDK, loaded once and shared by address search and routing ──

export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;

// Load Google Maps script once
let googleMapsLoaded = false;
let googleMapsLoadPromise: Promise<void> | null = null;

/** True once the Places library is loaded, so suggestions can be relied on. */
export function isGoogleMapsReady() {
  return googleMapsLoaded && !!window.google?.maps?.places;
}

export function loadGoogleMapsScript(): Promise<void> {
  if (googleMapsLoaded && window.google?.maps?.places) return Promise.resolve();
  if (googleMapsLoadPromise) return googleMapsLoadPromise;

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      googleMapsLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&language=en`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleMapsLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });

  return googleMapsLoadPromise;
}

// Extend Window for google types
declare global {
  interface Window {
    google: typeof google;
  }
}
