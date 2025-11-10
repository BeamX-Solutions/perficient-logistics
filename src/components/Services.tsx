import { Plane, Car, Sparkles } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceType: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const services = [
    {
      id: 'airport',
      icon: Plane,
      title: 'Airport Shuttle Transfers',
      description: 'A simple description of this service',
    },
    {
      id: 'full-day',
      icon: Car,
      title: 'Full-Day Personal Chauffeur',
      description: 'A simple description of this service',
    },
    {
      id: 'vip',
      icon: Sparkles,
      title: 'VIP Event & Special Rides',
      description: 'A simple description of this service',
    },
  ];

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            At perficient, we strive to provide our clients with the highest level of service,
            comfort, and safety.
          </p>
        </div>

        <div id="services" className="grid md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <button
                  onClick={() => onSelectService(service.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium w-full transition-colors"
                >
                  Select This Ride
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
