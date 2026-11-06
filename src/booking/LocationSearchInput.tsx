import { useEffect, useRef, useState } from 'react';
import type { LatLon } from './BookingContext';
import { GOOGLE_MAPS_KEY, loadGoogleMapsScript } from './googleMaps';

export function LocationSearchInput({
  id,
  value,
  onChange,
  onCoordinatesChange,
  placeholder,
  invalid,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (coords: LatLon | null) => void;
  placeholder: string;
  invalid?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isReady, setIsReady] = useState(!GOOGLE_MAPS_KEY);

  // Keep the latest callbacks without re-attaching the autocomplete.
  const onChangeRef = useRef(onChange);
  const onCoordsRef = useRef(onCoordinatesChange);
  onChangeRef.current = onChange;
  onCoordsRef.current = onCoordinatesChange;

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Load Google Maps SDK and attach autocomplete
  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || !inputRef.current) return;

    let cancelled = false;

    loadGoogleMapsScript()
      .then(() => {
        if (cancelled || !inputRef.current || autocompleteRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'ng' },
          fields: ['formatted_address', 'geometry', 'name'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place) return;

          // Combine place name with address so "Eti-Osa Local Government" doesn't
          // get replaced by just the street address
          const name = place.name || '';
          const address = place.formatted_address || '';
          const displayName =
            name && address && !address.toLowerCase().startsWith(name.toLowerCase())
              ? `${name}, ${address}`
              : address || name;
          setInputValue(displayName);
          onChangeRef.current(displayName);

          if (place.geometry?.location) {
            onCoordsRef.current?.({
              lat: place.geometry.location.lat(),
              lon: place.geometry.location.lng(),
            });
          } else {
            onCoordsRef.current?.(null);
          }
        });

        autocompleteRef.current = autocomplete;
        setIsReady(true);
      })
      .catch(() => {
        // Fall back to a plain text field if Google Maps can't load.
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    onCoordinatesChange?.(null);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={isReady ? placeholder : 'Loading locations...'}
      autoComplete="off"
      aria-invalid={invalid || undefined}
      className="field"
    />
  );
}
