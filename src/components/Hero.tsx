import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

interface HeroProps {
  onBookRideClick: () => void;
}

export function Hero({ onBookRideClick }: HeroProps) {
  return (
    <>
      <section className="relative overflow-hidden min-h-[560px] md:min-h-[640px] flex items-start">
        {/* Fleet photo across the full width; only the text side is softened */}
        <img
          src="/hero-fleet.jpg"
          alt="A line of black and white SUVs from the Perficient fleet"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/80 via-white/50 via-30% to-transparent to-55%" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 leading-tight">
              Ride in Comfort.
              <br />
              Arrive on Time
            </h2>
            <p className="text-base lg:text-lg text-gray-800 mb-6">
              Reliable car rentals with professional drivers for every occasion.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={onBookRideClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Book a Ride Now
              </button>
              <Link
                to="/terms"
                className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 transition-all duration-300 hover:border-gray-400 hover:shadow-md hover:scale-105"
              >
                View Our Fleet
              </Link>
            </div>

            <div className="bg-white/90 rounded-lg px-4 py-2.5 inline-flex items-center gap-2 transition-all duration-300 hover:bg-white">
              <Car className="w-4 h-4 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">
                Professional drivers available 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="about" className="text-center max-w-3xl mx-auto">
            <p className="text-base text-gray-700 leading-relaxed">
              At Perficient, we strive to provide our clients with the highest level of service, comfort, and safety.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
