import { useState } from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';

export default function BookingForm({ initialServiceType = 'airport' }) {
  const [serviceType, setServiceType] = useState(initialServiceType);
  const [rideType, setRideType] = useState('round-trip');
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffLocation: '',
    dropoffDate: '',
    dropoffTime: '',
    passengers: '1',
    fullName: '',
    phoneNumber: '',
    specialRequest: '',
  });

  interface FormData {
    pickupLocation: string;
    pickupDate: string;
    pickupTime: string;
    dropoffLocation: string;
    dropoffDate: string;
    dropoffTime: string;
    passengers: string;
    fullName: string;
    phoneNumber: string;
    specialRequest: string;
  }

  interface ServiceType {
    id: string;
    label: string;
  }

  interface BookingFormProps {
    initialServiceType?: string;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Booking submitted:', { serviceType, rideType, ...formData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const serviceTypes: ServiceType[] = [
    { id: 'airport', label: 'Airport Shuttle Transfers' },
    { id: 'full-day', label: 'Full-Day Personal Chauffeur' },
    { id: 'vip', label: 'VIP Event & Special Rides' },
  ];

  return (
    <section id="booking" className="w-full max-w-7xl mx-auto px-4 py-16 bg-gray-50">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Book Your Ride Now
        </h2>

        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-2 rounded-lg">
          {serviceTypes.map((service) => (
            <button
              key={service.id}
              onClick={() => setServiceType(service.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                serviceType === service.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              {service.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Pick-up Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="Select Pick-up Location"
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Pick-up date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Pick-up time
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Drop-off Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleInputChange}
                  placeholder="Select Drop-off Location"
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Drop-off date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dropoffDate"
                  value={formData.dropoffDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Drop-off time
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="dropoffTime"
                  value={formData.dropoffTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                No. of Passenger
              </label>
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
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
              <div className="flex items-center gap-6 h-[52px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rideType"
                    value="one-way"
                    checked={rideType === 'one-way'}
                    onChange={(e) => setRideType(e.target.value)}
                    className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">One way trip</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rideType"
                    value="round-trip"
                    checked={rideType === 'round-trip'}
                    onChange={(e) => setRideType(e.target.value)}
                    className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">Round trip</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Special Request
            </label>
            <textarea
              name="specialRequest"
              value={formData.specialRequest}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}