import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Check,
  ChevronDown,
  Car,
  Crown,
  Bus,
  Truck,
  User,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  MessageCircle,
  Gift,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { vehicleCategories } from '../data/vehicleData';
import {
  formatNaira,
  offerById,
  offerEndDate,
  offerSummary,
  offerVehicleLabel,
  sameStateError,
  type Offer,
  type OfferLocationError,
} from '../data/offers';

const WHATSAPP_NUMBER = '2348052702261';

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

interface BookingFormProps {
  embedded?: boolean;
  selectedService?: string;
  /** December offer chosen from the offer cards ('' for regular rates). */
  offerId?: string;
  onOfferChange?: (offerId: string) => void;
}

interface WizardFormData {
  serviceType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  passengers: string;
  rideType: string;
  vehicleCategory: string;
  selectedVehicle: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  specialRequest: string;
  /** Id of the December offer being booked, '' for regular rates. */
  offer: string;
}

const INITIAL_FORM_DATA: WizardFormData = {
  serviceType: 'Airport Shuttle Transfers',
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: '',
  pickupTime: '',
  dropoffDate: '',
  passengers: '1',
  rideType: 'round-trip',
  vehicleCategory: '',
  selectedVehicle: '',
  fullName: '',
  phoneNumber: '',
  email: '',
  specialRequest: '',
  offer: '',
};

/** Special request as stored and emailed: the offer leads so staff see it first. */
function requestWithOffer(formData: WizardFormData): string {
  const offer = offerById(formData.offer);
  return [offer && offerSummary(offer), formData.specialRequest].filter(Boolean).join('\n');
}

function OfferBanner({ offer, onRemove }: { offer: Offer; onRemove?: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <Gift className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-gray-900">
            December offer: {offer.title} ({offer.tagline})
          </p>
          <p className="text-gray-600">
            {formatNaira(offer.price)} for {offer.days} days, {offer.hoursPerDay} hours per day
          </p>
        </div>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove offer and use regular rates"
          className="text-gray-400 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

const STEPS = [
  { number: 1, label: 'Trip Details', shortLabel: 'Trip' },
  { number: 2, label: 'Vehicle', shortLabel: 'Vehicle' },
  { number: 3, label: 'Your Info', shortLabel: 'Info' },
  { number: 4, label: 'Review', shortLabel: 'Review' },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  economy: Car,
  'premium-suv': Truck,
  luxury: Crown,
  'bus-van': Bus,
};

function getVehiclePrice(categoryId: string, vehicleLabel: string): string | null {
  const category = vehicleCategories.find((c) => c.id === categoryId);
  if (!category) return null;
  const vehicle = category.vehicles.find((v) => v.label === vehicleLabel);
  return vehicle?.price || null;
}

// ── Google Places Autocomplete (JavaScript SDK) ──

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;

interface LatLon {
  lat: number;
  lon: number;
  /** State from Google's address details, e.g. "Lagos" or "Federal Capital Territory". */
  state?: string;
}

function stateOf(components: google.maps.GeocoderAddressComponent[] | undefined): string | undefined {
  const name = components?.find((c) => c.types.includes('administrative_area_level_1'))?.long_name;
  if (!name) return undefined;
  if (/federal capital territory/i.test(name)) return 'Abuja (FCT)';
  return name.replace(/\s+State$/i, '');
}

function haversineDistance(a: LatLon, b: LatLon): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

interface Route {
  km: number;
  minutes: number;
}

// Driving distance and time from Google, so the estimate follows the roads
// rather than a straight line (Lagos trips around the lagoon run much longer).
async function drivingRoute(from: LatLon, to: LatLon): Promise<Route | null> {
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

interface DistanceEstimate {
  km: number;
  minutes: number | null;
  byRoad: boolean;
}

function distanceText(d: DistanceEstimate): string {
  if (!d.byRoad) return `About ${Math.round(d.km)} km (straight line)`;
  const mins = Math.round(d.minutes ?? 0);
  const time = mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;
  return `About ${Math.round(d.km)} km by road, ${time} drive`;
}

// Load Google Maps script once
let googleMapsLoaded = false;
let googleMapsLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
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

function LocationSearchInput({
  value,
  onChange,
  onCoordinatesChange,
  placeholder,
  showError,
}: {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (coords: LatLon | null) => void;
  placeholder: string;
  showError: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isReady, setIsReady] = useState(false);

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Load Google Maps SDK and attach autocomplete
  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || !inputRef.current) return;

    let cancelled = false;

    loadGoogleMapsScript().then(() => {
      if (cancelled || !inputRef.current || autocompleteRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ng' },
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
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
        onChange(displayName);

        if (place.geometry?.location) {
          onCoordinatesChange?.({
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng(),
            state: stateOf(place.address_components),
          });
        } else {
          onCoordinatesChange?.(null);
        }
      });

      autocompleteRef.current = autocomplete;
      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [onChange, onCoordinatesChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    onCoordinatesChange?.(null);
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={isReady ? placeholder : 'Loading locations...'}
        autoComplete="off"
        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${
          showError && !value ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
        }`}
      />
    </div>
  );
}

// ── Progress Bar ──

function StepProgressBar({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isClickable = isCompleted;

        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                    : isCurrent
                      ? 'bg-blue-500 text-white cursor-default'
                      : 'bg-gray-200 text-gray-500 cursor-default'
                }`}
                aria-label={isClickable ? `Go back to ${step.label}` : step.label}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </button>
              <span
                className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Trip Details ──

function StepTripDetails({
  formData,
  onChange,
  onLocationChange,
  onCoordsChange,
  showErrors,
  onRemoveOffer,
  locationError,
}: {
  onRemoveOffer: () => void;
  /** Why the addresses don't qualify for the selected offer, if they don't. */
  locationError: OfferLocationError | null;
  formData: WizardFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onLocationChange: (field: 'pickupLocation' | 'dropoffLocation', value: string) => void;
  onCoordsChange: (field: 'pickup' | 'dropoff', coords: LatLon | null) => void;
  showErrors: boolean;
}) {
  const today = getTodayString();

  const errorClass = (value: string) =>
    showErrors && !value ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300';

  const dropoffDateInvalid =
    formData.dropoffDate && formData.pickupDate && formData.dropoffDate < formData.pickupDate;

  const offer = offerById(formData.offer);

  return (
    <div className="space-y-4">
      {offer && <OfferBanner offer={offer} onRemove={onRemoveOffer} />}
      {offer && (
        <p className="-mt-2 text-xs text-gray-500">
          Your drop-off date is set to the last day of the package when you pick a date.
        </p>
      )}
      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Service Type
        </label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Airport Shuttle Transfers">Airport Shuttle Transfers</option>
          <option value="Full-Day Personal Chauffeur">Full-Day Personal Chauffeur</option>
          <option value="VIP Event & Special Rides">VIP Event & Special Rides</option>
        </select>
      </div>

      {/* Pickup / Dropoff Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Pick-up Location
          </label>
          <LocationSearchInput
            value={formData.pickupLocation}
            onChange={(val) => onLocationChange('pickupLocation', val)}
            onCoordinatesChange={(coords) => onCoordsChange('pickup', coords)}
            placeholder="Search or type pick-up location"
            showError={showErrors}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Drop-off Location
          </label>
          <LocationSearchInput
            value={formData.dropoffLocation}
            onChange={(val) => onLocationChange('dropoffLocation', val)}
            onCoordinatesChange={(coords) => onCoordsChange('dropoff', coords)}
            placeholder="Search or type drop-off location"
            showError={showErrors}
          />
        </div>
      </div>

      {locationError && (showErrors || locationError.kind === 'interstate') && (
        <p role="alert" className="text-sm text-red-500">
          {locationError.message}
        </p>
      )}

      {/* Dates & Times */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Pick-up Date</label>
          <div className="relative overflow-hidden">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={onChange}
              min={today}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none ${errorClass(formData.pickupDate)}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Pick-up Time</label>
          <div className="relative overflow-hidden">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={onChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none ${errorClass(formData.pickupTime)}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Drop-off Date <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative overflow-hidden">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              type="date"
              name="dropoffDate"
              value={formData.dropoffDate}
              onChange={onChange}
              min={formData.pickupDate || today}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none ${
                dropoffDateInvalid ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
              }`}
            />
          </div>
          {dropoffDateInvalid && (
            <p className="text-xs text-red-500 mt-1">Drop-off date cannot be before pick-up date.</p>
          )}
        </div>

      </div>

      {/* Passengers & Ride Type */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            No. of Passengers
          </label>
          <select
            name="passengers"
            value={formData.passengers}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Ride Type</label>
          <div className="flex gap-6 pt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rideType"
                value="one-way"
                checked={formData.rideType === 'one-way'}
                onChange={onChange}
                className="w-5 h-5 text-blue-500"
              />
              <span className="text-gray-900">One way trip</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rideType"
                value="round-trip"
                checked={formData.rideType === 'round-trip'}
                onChange={onChange}
                className="w-5 h-5 text-blue-500"
              />
              <span className="text-gray-900">Round trip</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Vehicle Category ──

function StepVehicleCategory({
  formData,
  onCategorySelect,
  onVehicleSelect,
  showErrors,
  onRemoveOffer,
}: {
  formData: WizardFormData;
  onCategorySelect: (categoryId: string) => void;
  onVehicleSelect: (categoryId: string, vehicleLabel: string) => void;
  showErrors: boolean;
  onRemoveOffer: () => void;
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const offer = offerById(formData.offer);

  if (offer) {
    return (
      <div>
        <OfferBanner offer={offer} />
        <p className="text-sm text-gray-600 mb-3">Choose your vehicle for this package.</p>
        {showErrors && !formData.selectedVehicle && (
          <p className="text-sm text-red-500 mb-3">Please select a vehicle to continue.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {offer.vehicles.map((vehicle) => {
            const label = offerVehicleLabel(offer, vehicle);
            const isSelected = formData.selectedVehicle === label;
            return (
              <label
                key={vehicle}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                  isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="selectedVehicle"
                  value={label}
                  checked={isSelected}
                  onChange={() => onVehicleSelect(offer.categoryId, label)}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="font-medium text-gray-900">{vehicle}</span>
              </label>
            );
          })}
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={onRemoveOffer}
            className="text-sm font-medium text-blue-500 hover:text-blue-700"
          >
            Book at regular rates instead
          </button>
        </div>
      </div>
    );
  }

  const toggleExpand = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">
        Expand a category and select a specific vehicle for your ride.
      </p>

      {showErrors && !formData.selectedVehicle && (
        <p className="text-sm text-red-500 mb-3">Please expand a category and select a vehicle to continue.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {vehicleCategories.map((category) => {
          const isSelected = formData.vehicleCategory === category.id;
          const isExpanded = expandedCategory === category.id;
          const IconComponent = CATEGORY_ICONS[category.id] || Car;

          return (
            <div
              key={category.id}
              className={`border-2 rounded-2xl transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Card header */}
              <div
                onClick={() => onCategorySelect(category.id)}
                className="p-5 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-500'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm font-medium text-blue-600">
                      {category.startingPrice}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>

              {/* Expand toggle */}
              <div className="px-5 pb-2">
                <button
                  onClick={(e) => toggleExpand(category.id, e)}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium"
                >
                  {isExpanded ? 'Hide vehicles' : `View ${category.vehicles.length} vehicles`}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Expandable vehicle list */}
              {isExpanded && (
                <div className="px-5 pb-5">
                  <div className="pt-3 border-t border-gray-200 space-y-1.5 max-h-56 overflow-y-auto">
                    {category.vehicles.map((vehicle) => {
                      const isVehicleSelected = formData.selectedVehicle === vehicle.label;
                      return (
                        <label
                          key={vehicle.label}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                            isVehicleSelected
                              ? 'bg-blue-100 border border-blue-300'
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="selectedVehicle"
                              value={vehicle.label}
                              checked={isVehicleSelected}
                              onChange={() => onVehicleSelect(category.id, vehicle.label)}
                              className="w-4 h-4 text-blue-500"
                            />
                            <span className="text-gray-900">{vehicle.label}</span>
                          </div>
                          <span className="font-semibold text-gray-900 whitespace-nowrap ml-2">
                            {vehicle.price}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Terms link */}
      <div className="text-center">
        <Link
          to="/terms"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          View full Terms & Rates
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ── Step 3: Personal Information ──

function StepPersonalInfo({
  formData,
  onChange,
  showErrors,
}: {
  formData: WizardFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  showErrors: boolean;
}) {
  const errorClass = (value: string) =>
    showErrors && !value ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300';

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const emailErrorClass =
    showErrors && (!formData.email || !emailValid)
      ? 'border-red-400 ring-1 ring-red-400'
      : 'border-gray-300';

  // Nigerian phone: +234XXXXXXXXXX (13-14 chars) or 0XXXXXXXXXX (11 chars)
  const phoneDigits = formData.phoneNumber.replace(/[\s\-()]/g, '');
  const phoneValid =
    /^\+234\d{10}$/.test(phoneDigits) || /^0[7-9]\d{9}$/.test(phoneDigits);
  const phoneErrorClass =
    showErrors && (!formData.phoneNumber || !phoneValid)
      ? 'border-red-400 ring-1 ring-red-400'
      : 'border-gray-300';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-5 h-5 text-blue-500" />
        <p className="text-sm text-gray-600">
          Tell us who you are so we can confirm your booking.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="John Doe"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorClass(formData.fullName)}`}
          />
          {showErrors && !formData.fullName && (
            <p className="text-xs text-red-500 mt-1">Full name is required.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onChange}
            placeholder="+234 801 234 5678"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${phoneErrorClass}`}
          />
          {showErrors && !formData.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">Phone number is required.</p>
          )}
          {showErrors && formData.phoneNumber && !phoneValid && (
            <p className="text-xs text-red-500 mt-1">Enter a valid Nigerian number (e.g. +2348012345678 or 08012345678).</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@example.com"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${emailErrorClass}`}
        />
        {showErrors && !formData.email && (
          <p className="text-xs text-red-500 mt-1">Email address is required.</p>
        )}
        {showErrors && formData.email && !emailValid && (
          <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Special Request <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="specialRequest"
          value={formData.specialRequest}
          onChange={onChange}
          rows={3}
          placeholder="Any special requirements or notes..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}

// ── Step 4: Review & Submit ──

function StepReview({
  formData,
  onEditStep,
  onSubmit,
  isSubmitting,
  submitStatus,
  agreedToTerms,
  onToggleTerms,
  showTermsError,
  estimatedDistance,
}: {
  formData: WizardFormData;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  agreedToTerms: boolean;
  onToggleTerms: () => void;
  showTermsError: boolean;
  estimatedDistance: string | null;
}) {
  const categoryInfo = vehicleCategories.find((c) => c.id === formData.vehicleCategory);
  const vehiclePrice = formData.selectedVehicle
    ? getVehiclePrice(formData.vehicleCategory, formData.selectedVehicle)
    : null;

  const offer = offerById(formData.offer);

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600 mb-2">
        Review your booking details before submitting.
      </p>
      {offer && <OfferBanner offer={offer} />}

      {/* Trip Details */}
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Trip Details</h3>
          <button
            onClick={() => onEditStep(1)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Service: </span>
            <span className="font-medium text-gray-900">{formData.serviceType}</span>
          </div>
          <div>
            <span className="text-gray-500">Ride Type: </span>
            <span className="font-medium text-gray-900 capitalize">{formData.rideType}</span>
          </div>
          <div>
            <span className="text-gray-500">Pickup: </span>
            <span className="font-medium text-gray-900">{formData.pickupLocation}</span>
          </div>
          <div>
            <span className="text-gray-500">Dropoff: </span>
            <span className="font-medium text-gray-900">{formData.dropoffLocation}</span>
          </div>
          <div>
            <span className="text-gray-500">Pickup Date/Time: </span>
            <span className="font-medium text-gray-900">
              {formData.pickupDate} at {formData.pickupTime}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Drop-off Date: </span>
            <span className="font-medium text-gray-900">
              {formData.dropoffDate || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Passengers: </span>
            <span className="font-medium text-gray-900">{formData.passengers}</span>
          </div>
          {estimatedDistance && (
            <div className="sm:col-span-2">
              <span className="text-gray-500">Est. Distance: </span>
              <span className="font-medium text-blue-600">{estimatedDistance}</span>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle */}
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Vehicle</h3>
          <button
            onClick={() => onEditStep(2)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-500">Category: </span>
            <span className="font-medium text-gray-900">
              {categoryInfo?.name || formData.vehicleCategory}
            </span>
          </div>
          {formData.selectedVehicle && (
            <div className="flex items-center gap-2">
              <div>
                <span className="text-gray-500">Vehicle: </span>
                <span className="font-medium text-gray-900">{formData.selectedVehicle}</span>
              </div>
              {offer ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                  {formatNaira(offer.price)} package
                </span>
              ) : vehiclePrice && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {vehiclePrice}/day
                </span>
              )}
            </div>
          )}
          {!formData.selectedVehicle && categoryInfo && (
            <div>
              <span className="text-gray-500">Starting from: </span>
              <span className="font-medium text-blue-600">{categoryInfo.startingPrice}</span>
            </div>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <button
            onClick={() => onEditStep(3)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Name: </span>
            <span className="font-medium text-gray-900">{formData.fullName}</span>
          </div>
          <div>
            <span className="text-gray-500">Phone: </span>
            <span className="font-medium text-gray-900">{formData.phoneNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">Email: </span>
            <span className="font-medium text-gray-900">{formData.email}</span>
          </div>
          {formData.specialRequest && (
            <div className="sm:col-span-2">
              <span className="text-gray-500">Special Request: </span>
              <span className="font-medium text-gray-900">{formData.specialRequest}</span>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions checkbox */}
      <div className={`rounded-xl p-4 ${showTermsError && !agreedToTerms ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={onToggleTerms}
            className="w-5 h-5 text-blue-500 mt-0.5 rounded"
          />
          <span className="text-sm text-gray-700">
            I have read and agree to the{' '}
            <Link
              to="/terms"
              target="_blank"
              className="text-blue-500 hover:text-blue-700 underline font-medium"
            >
              Terms & Rates
            </Link>
            , including the cancellation policy (100% charge for no-shows, 50% if cancelled 24+ hours in advance).
          </span>
        </label>
        {showTermsError && !agreedToTerms && (
          <p className="text-xs text-red-500 mt-2 ml-8">You must agree to the terms before booking.</p>
        )}
      </div>

      {/* Status messages */}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg text-center font-medium">
          Failed to submit booking. Please try again.
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-12 py-3.5 rounded-lg font-medium text-lg transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm & Book'}
        </button>
      </div>
    </div>
  );
}

// ── Booking Confirmation View ──

function BookingConfirmation({
  formData,
  onBookAnother,
}: {
  formData: WizardFormData;
  onBookAnother: () => void;
}) {
  const categoryInfo = vehicleCategories.find((c) => c.id === formData.vehicleCategory);
  const vehiclePrice = formData.selectedVehicle
    ? getVehiclePrice(formData.vehicleCategory, formData.selectedVehicle)
    : null;

  const offer = offerById(formData.offer);

  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-9 h-9 text-green-600" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
      <p className="text-gray-600 mb-6">
        Thank you, {formData.fullName}. We've received your booking and will contact you shortly to confirm the details.
      </p>

      <div className="bg-gray-50 rounded-xl p-5 text-left mb-6 max-w-md mx-auto">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Service</span>
            <span className="font-medium text-gray-900">{formData.serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vehicle</span>
            <span className="font-medium text-gray-900">
              {formData.selectedVehicle || categoryInfo?.name || formData.vehicleCategory}
            </span>
          </div>
          {offer ? (
            <div className="flex justify-between">
              <span className="text-gray-500">December offer</span>
              <span className="font-medium text-blue-600">
                {formatNaira(offer.price)} for {offer.days} days
              </span>
            </div>
          ) : vehiclePrice && (
            <div className="flex justify-between">
              <span className="text-gray-500">Rate</span>
              <span className="font-medium text-blue-600">{vehiclePrice}/day</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Pickup</span>
            <span className="font-medium text-gray-900 text-right max-w-[200px] truncate">
              {formData.pickupDate} at {formData.pickupTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ride Type</span>
            <span className="font-medium text-gray-900 capitalize">{formData.rideType}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        A confirmation email has been sent to <span className="font-medium text-gray-700">{formData.email}</span>
      </p>

      <button
        onClick={onBookAnother}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
      >
        Book Another Ride
      </button>
    </div>
  );
}

// ── Navigation Buttons ──

function StepNavigation({
  currentStep,
  onBack,
  onNext,
}: {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      {currentStep > 1 ? (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Main BookingForm Component ──

export function BookingForm({ embedded = false, selectedService, offerId = '', onOfferChange }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>({
    ...INITIAL_FORM_DATA,
    serviceType: selectedService || INITIAL_FORM_DATA.serviceType,
  });
  const [pickupCoords, setPickupCoords] = useState<LatLon | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showStepErrors, setShowStepErrors] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [confirmedFormData, setConfirmedFormData] = useState<WizardFormData | null>(null);

  // Sync selectedService prop
  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({ ...prev, serviceType: selectedService }));
      setCurrentStep(1);
      setSubmitStatus('idle');
      setConfirmedFormData(null);
    }
  }, [selectedService]);

  // Apply (or drop) the December offer chosen from the offer cards.
  useEffect(() => {
    const offer = offerById(offerId);
    setFormData((prev) => {
      if (offer) {
        if (prev.offer === offer.id) return prev;
        return {
          ...prev,
          offer: offer.id,
          serviceType: 'Full-Day Personal Chauffeur',
          vehicleCategory: offer.categoryId,
          selectedVehicle: offer.vehicles.length === 1 ? offerVehicleLabel(offer, offer.vehicles[0]) : '',
          dropoffDate: offerEndDate(offer, prev.pickupDate) || prev.dropoffDate,
        };
      }
      if (!prev.offer) return prev;
      return { ...prev, offer: '', vehicleCategory: '', selectedVehicle: '', dropoffDate: '' };
    });
    if (offer) {
      setCurrentStep(1);
      setSubmitStatus('idle');
      setConfirmedFormData(null);
    }
  }, [offerId]);

  const removeOffer = () => onOfferChange?.('');

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Offer packages run for a fixed number of days from pickup.
      const offer = offerById(prev.offer);
      if (name === 'pickupDate' && offer) next.dropoffDate = offerEndDate(offer, value);
      return next;
    });
  };

  const handleLocationChange = (field: 'pickupLocation' | 'dropoffLocation', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoordsChange = (field: 'pickup' | 'dropoff', coords: LatLon | null) => {
    if (field === 'pickup') setPickupCoords(coords);
    else setDropoffCoords(coords);
  };

  // Ask Google for the driving route whenever either end changes.
  const [route, setRoute] = useState<Route | null>(null);
  useEffect(() => {
    setRoute(null);
    if (!pickupCoords || !dropoffCoords) return;
    let stale = false;
    drivingRoute(pickupCoords, dropoffCoords)
      .then((r) => {
        if (!stale) setRoute(r);
      })
      .catch((err) => console.error('Driving distance lookup failed:', err));
    return () => {
      stale = true;
    };
  }, [pickupCoords, dropoffCoords]);

  // December offers are for travel within one state.
  const selectedOffer = offerById(formData.offer);
  const offerLocationError = selectedOffer
    ? sameStateError(pickupCoords, dropoffCoords, !!GOOGLE_MAPS_KEY && !!window.google?.maps?.places)
    : null;

  // Prefer Google's driving distance; fall back to a straight line only if that lookup failed.
  const distance: DistanceEstimate | null = route
    ? { km: route.km, minutes: route.minutes, byRoad: true }
    : pickupCoords && dropoffCoords
      ? { km: haversineDistance(pickupCoords, dropoffCoords), minutes: null, byRoad: false }
      : null;
  const estimatedDistance = distance ? distanceText(distance) : null;

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      vehicleCategory: categoryId,
      selectedVehicle: '',
    }));
  };

  const handleVehicleSelect = (categoryId: string, vehicleLabel: string) => {
    setFormData((prev) => ({ ...prev, vehicleCategory: categoryId, selectedVehicle: vehicleLabel }));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const basicValid = !!(
          formData.serviceType &&
          formData.pickupLocation &&
          formData.pickupDate &&
          formData.pickupTime &&
          formData.dropoffLocation
        );
        const dropoffDateValid =
          !formData.dropoffDate ||
          !formData.pickupDate ||
          formData.dropoffDate >= formData.pickupDate;
        return basicValid && dropoffDateValid && !offerLocationError;
      }
      case 2:
        return !!(formData.vehicleCategory && formData.selectedVehicle);
      case 3: {
        const digits = formData.phoneNumber.replace(/[\s\-()]/g, '');
        const validPhone =
          /^\+234\d{10}$/.test(digits) || /^0[7-9]\d{9}$/.test(digits);
        return !!(
          formData.fullName &&
          formData.phoneNumber &&
          validPhone &&
          formData.email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );
      }
      case 4:
        return true;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setShowStepErrors(false);
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowStepErrors(true);
    }
  };

  const goToPrevStep = () => {
    setShowStepErrors(false);
    setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (step: number) => {
    setShowStepErrors(false);
    setCurrentStep(step);
  };

  const handleBookAnother = () => {
    setFormData({ ...INITIAL_FORM_DATA });
    setCurrentStep(1);
    setSubmitStatus('idle');
    setAgreedToTerms(false);
    setShowTermsError(false);
    setConfirmedFormData(null);
    setPickupCoords(null);
    setDropoffCoords(null);
    onOfferChange?.('');
  };

  // Submit
  const handleSubmit = async () => {
    if (!agreedToTerms) {
      setShowTermsError(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          service_type: formData.serviceType,
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          pickup_date: formData.pickupDate,
          pickup_time: formData.pickupTime,
          dropoff_date: formData.dropoffDate || null,
          passengers: parseInt(formData.passengers),
          ride_type: formData.rideType,
          vehicle_category: formData.vehicleCategory,
          selected_vehicle: formData.selectedVehicle || null,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          special_request: requestWithOffer(formData) || null,
        },
      ]);

      if (error) throw error;

      try {
        const response = await fetch('/.netlify/functions/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceType: formData.serviceType,
            pickupLocation: formData.pickupLocation,
            dropoffLocation: formData.dropoffLocation,
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            dropoffDate: formData.dropoffDate,
            passengers: formData.passengers,
            rideType: formData.rideType,
            vehicleCategory: formData.vehicleCategory,
            selectedVehicle: formData.selectedVehicle,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            specialRequest: requestWithOffer(formData),
            estimatedDistance: distance ? Math.round(distance.km) : null,
            estimatedDistanceText: estimatedDistance,
          }),
        });

        const text = await response.text();
        console.log('send-booking-email response:', response.status, text);
      } catch (emailError) {
        console.error('Error sending booking notification email:', emailError);
      }

      setConfirmedFormData({ ...formData });
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp booking link
  const whatsappMessage = encodeURIComponent(
    "Hi! I'd like to book a ride. Can you help me with the details?"
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <section className={embedded ? 'bg-gray-50 py-8' : ''}>
      <div className={embedded ? 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' : ''}>
        <div
          className={
            embedded
              ? 'bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200'
              : 'border border-gray-200'
          }
        >
          {/* Show confirmation view after successful submission */}
          {submitStatus === 'success' && confirmedFormData ? (
            <BookingConfirmation
              formData={confirmedFormData}
              onBookAnother={handleBookAnother}
            />
          ) : (
            <>
              <h2 className="text-3xl font-semibold text-gray-900 text-center mb-2">
                Book Your Ride
              </h2>
              <p className="text-center text-gray-500 text-sm mb-6">
                Complete the steps below to reserve your vehicle.
              </p>

              <StepProgressBar currentStep={currentStep} onStepClick={goToStep} />

              <div key={currentStep} className="animate-fadeUp">
                {currentStep === 1 && (
                  <StepTripDetails
                    formData={formData}
                    onChange={handleChange}
                    onLocationChange={handleLocationChange}
                    onCoordsChange={handleCoordsChange}
                    showErrors={showStepErrors}
                    onRemoveOffer={removeOffer}
                    locationError={offerLocationError}
                  />
                )}

                {currentStep === 2 && (
                  <StepVehicleCategory
                    formData={formData}
                    onCategorySelect={handleCategorySelect}
                    onVehicleSelect={handleVehicleSelect}
                    showErrors={showStepErrors}
                    onRemoveOffer={removeOffer}
                  />
                )}

                {currentStep === 3 && (
                  <StepPersonalInfo
                    formData={formData}
                    onChange={handleChange}
                    showErrors={showStepErrors}
                  />
                )}

                {currentStep === 4 && (
                  <StepReview
                    formData={formData}
                    onEditStep={goToStep}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitStatus={submitStatus}
                    agreedToTerms={agreedToTerms}
                    onToggleTerms={() => {
                      setAgreedToTerms((prev) => !prev);
                      setShowTermsError(false);
                    }}
                    showTermsError={showTermsError}
                    estimatedDistance={estimatedDistance}
                  />
                )}
              </div>

              {currentStep < 4 && (
                <StepNavigation
                  currentStep={currentStep}
                  onBack={goToPrevStep}
                  onNext={goToNextStep}
                />
              )}
            </>
          )}
        </div>

        {/* WhatsApp alternative */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Prefer to book via chat?{' '}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#1da851] font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Book on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
