import { Flame } from 'lucide-react';

interface HeroProps {
  onBookRide: () => void;
  onViewPackages: () => void;
}

export default function Hero({ onBookRide, onViewPackages }: HeroProps) {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Ride in Comfort.
                <br />
                Arrive on Time
              </h1>
              <p className="text-lg text-gray-600">
                Reliable car rentals with professional drivers for every occasion.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onBookRide}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                >
                  Book a Ride Now
                </button>
                <button
                  onClick={onViewPackages}
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-medium text-lg border-2 border-gray-300 transition-colors"
                >
                  View Packages
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-4 py-3 rounded-lg inline-flex">
                <Flame className="w-5 h-5 text-red-500" />
                <span className="font-medium">Limited slots for weekend transfers!</span>
              </div>
            </div>

            <div className="relative">
              <img
                src="/rectangle-1.png"
                alt="Professional driver in luxury car"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
