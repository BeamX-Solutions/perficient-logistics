import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookingFormProps {
  embedded?: boolean;
  selectedService?: string;
}

export function BookingForm({ embedded = false, selectedService }: BookingFormProps) {
  const [serviceType, setServiceType] = useState(selectedService || 'Airport Shuttle Transfers');
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    passengers: '1',
    rideType: 'round-trip',
    fullName: '',
    phoneNumber: '',
    specialRequest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Update serviceType when selectedService prop changes
  useEffect(() => {
    if (selectedService) {
      setServiceType(selectedService);
    }
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          service_type: serviceType,
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          pickup_date: formData.pickupDate,
          pickup_time: formData.pickupTime,
          dropoff_date: formData.dropoffDate || null,
          dropoff_time: formData.dropoffTime || null,
          passengers: parseInt(formData.passengers),
          ride_type: formData.rideType,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          special_request: formData.specialRequest || null,
        },
      ]);

      if (error) throw error;

      // Fire-and-forget call to Netlify function that sends an email via Resend
      try {
        const response = await fetch('/.netlify/functions/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceType,
            pickupLocation: formData.pickupLocation,
            dropoffLocation: formData.dropoffLocation,
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            dropoffDate: formData.dropoffDate,
            dropoffTime: formData.dropoffTime,
            passengers: formData.passengers,
            rideType: formData.rideType,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            specialRequest: formData.specialRequest,
          }),
        });

        const text = await response.text();
        console.log('send-booking-email response:', response.status, text);
      } catch (emailError) {
        console.error('Error sending booking notification email:', emailError);
      }

      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({
          pickupLocation: '',
          dropoffLocation: '',
          pickupDate: '',
          pickupTime: '',
          dropoffDate: '',
          dropoffTime: '',
          passengers: '1',
          rideType: 'round-trip',
          fullName: '',
          phoneNumber: '',
          specialRequest: '',
        });
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={embedded ? 'bg-gray-50 py-8' : ''}>
      <div className={embedded ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8' : ''}>
        <div className={embedded ? 'bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-black' : 'border border-black'}>
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">
            Book Your Ride Now
          </h2>

          <div className="bg-blue-50 rounded-2xl p-1 mb-6 flex">
            {['Airport Shuttle Transfers', 'Full-Day Personal Chauffeur', 'VIP Event & Special Rides'].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setServiceType(type)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${
                    serviceType === type
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {type === 'VIP Event & Special Rides' ? 'Event & Special Rides' : type}
                </button>
              )
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Pick-up Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder="Select Pick-up Location"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Pick-up date
                </label>
                <div className="relative overflow-hidden">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Pick-up time
                </label>
                <div className="relative overflow-hidden">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Drop-off Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    placeholder="Select Drop-off Location"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Drop-off date
                </label>
                <div className="relative overflow-hidden">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    name="dropoffDate"
                    value={formData.dropoffDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Drop-off time
                </label>
                <div className="relative overflow-hidden">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="time"
                    name="dropoffTime"
                    value={formData.dropoffTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  No. of Passenger
                </label>
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  required
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
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ride type
                </label>
                <div className="flex gap-6 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rideType"
                      value="one-way"
                      checked={formData.rideType === 'one-way'}
                      onChange={handleChange}
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
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-500"
                    />
                    <span className="text-gray-900">Round trip</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Special Request
              </label>
              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {submitStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg text-center">
                Booking submitted successfully!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg text-center">
                Failed to submit booking. Please try again.
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-12 py-3.5 rounded-lg font-medium text-lg transition-colors"
              >
                {isSubmitting ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}