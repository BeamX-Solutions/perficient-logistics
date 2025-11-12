import { Flame } from 'lucide-react';

interface HeroProps {
  onBookRideClick: () => void;
  onViewPackagesClick: () => void;
}

export function Hero({ onBookRideClick, onViewPackagesClick }: HeroProps) {
  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-12 lg:p-16">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Ride in Comfort.
                <br />
                Arrive on Time
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Reliable car rentals with professional drivers for every occasion.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={onBookRideClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-colors"
                >
                  Book a Ride Now
                </button>
                <button
                  onClick={onViewPackagesClick}
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3.5 rounded-lg font-medium text-lg border-2 border-gray-300 transition-colors"
                >
                  View Packages
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl px-5 py-3.5 inline-flex items-center gap-2">
                <Flame className="w-5 h-5 text-gray-900" />
                <span className="text-sm font-medium text-gray-900">
                  Limited slots <span className="font-normal">for weekend transfers!</span>
                </span>
              </div>
            </div>

            <div className="h-full min-h-[500px] relative">
              <img
                src="/rectangle-1.png"
                alt="Professional driver in luxury car"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-16 max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed">
            At perficient, we strive to provide our clients with the highest level of service, comfort, and safety.
          </p>
        </div>
      </div>
    </section>
  );
}
