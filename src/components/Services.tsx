import { Plane, Car, Sparkles } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceType: string) => void;
}

export function Services({ onSelectService }: ServicesProps) {
  const services = [
    {
      icon: Plane,
      title: 'Airport Shuttle Transfers',
      description: 'Seamless airport pickups and drop-offs with professional drivers. Enjoy punctual, comfortable rides to and from the airport, ensuring you never miss a flight.',
      type: 'Airport Shuttle Transfers',
    },
    {
      icon: Car,
      title: 'Full-Day Personal Chauffeur',
      description: 'Experience luxury and convenience with a dedicated chauffeur at your service for the entire day. Perfect for business meetings, city tours, or special occasions.',
      type: 'Full-Day Personal Chauffeur',
    },
    {
      icon: Sparkles,
      title: 'VIP Event & Special Rides',
      description: 'Make a grand entrance at weddings, corporate events, or special celebrations. Premium vehicles and professional service for your most memorable occasions.',
      type: 'VIP Event & Special Rides',
    },
  ];

  return (
    <section id="services" className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((service) => (
            <div key={service.type} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {service.description}
              </p>
              <button
                onClick={() => onSelectService(service.type)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full mt-auto"
              >
                Select This Ride
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-blue-500 mb-2">10k+</div>
            <div className="text-gray-900 font-semibold">Rides</div>
            <div className="text-gray-900 font-semibold">Completed</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-blue-500 mb-2">4.8/5</div>
            <div className="text-gray-900 font-semibold">Avg</div>
            <div className="text-gray-900 font-semibold">Rating</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-blue-500 mb-2">50+</div>
            <div className="text-gray-900 font-semibold">Professional</div>
            <div className="text-gray-900 font-semibold">Drivers</div>
          </div>
        </div>
      </div>
    </section>
  );
}