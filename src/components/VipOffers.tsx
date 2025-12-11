import { Flame, ShieldCheck, Car, Clock, ArrowUpCircle, RotateCcw, UserCheck } from 'lucide-react';

export function VipOffers() {
  return (
    <section id="vip-offers" className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-blue-500" />
          <p className="text-xs tracking-[0.25em] uppercase text-blue-500 font-semibold">
            December VIP City Offers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Abuja Offer */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-40">
              <img
                src="/gallery-1.png"
                alt="Premium SUV in Abuja"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="inline-flex items-center gap-2 bg-white/90 text-xs font-semibold text-gray-900 rounded-full px-3 py-1">
                    <Flame className="w-3 h-3 text-blue-500" />
                    <span>December Package</span>
                  </div>
                  <div className="inline-flex items-center bg-blue-500/90 text-[11px] font-semibold text-white rounded-full px-3 py-1">
                    <span>Limited slots available</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-200 font-medium mb-1">Special Offer · Abuja Only</p>
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    Get 3 SUV full-day rides for the price of 2
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.18em] mb-1">
                  Abuja VIP Package
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Get <span className="font-semibold">3 premium SUV full-day rides</span> for the price of 2 at
                  <span className="font-semibold"> ₦295,000</span>.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-blue-700 font-medium uppercase tracking-[0.16em] mb-1">
                    Package value
                  </p>
                  <p className="text-sm font-semibold text-blue-900">₦450,000 ride value</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-blue-700 font-medium uppercase tracking-[0.16em] mb-1">
                    Bonus value
                  </p>
                  <p className="text-sm font-semibold text-blue-900">₦255,000+</p>
                </div>
              </div>

              <button className="mt-1 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Reserve Abuja VIP Package
              </button>
            </div>
          </div>

          {/* What They Get */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="border-b border-gray-100 px-6 pt-6 pb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.18em] mb-1">
                Abuja VIP Package
              </p>
              <h3 className="text-lg font-semibold text-gray-900">What you get</h3>
            </div>

            <div className="p-6 flex flex-col gap-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">3 Premium SUV Rides (Prado)</p>
                  <p className="text-xs text-gray-500">Worth ₦450,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">VIP Welcome Card</p>
                  <p className="text-xs text-gray-500">Worth ₦5,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Guaranteed Availability</p>
                  <p className="text-xs text-gray-500">Worth ₦20,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <ArrowUpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Free Vehicle Upgrade</p>
                  <p className="text-xs text-gray-500">Prado → Land Cruiser (where available) · Worth ₦50,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Emergency Backup Vehicle</p>
                  <p className="text-xs text-gray-500">On-site within 15 minutes · Worth ₦50,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">100% Money-Back Guarantee</p>
                  <p className="text-xs text-gray-500">Zero risk if we don&apos;t deliver as promised</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Professional + Verified Driver</p>
                  <p className="text-xs text-gray-500">Screened, trained and experienced chauffeurs</p>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <span>Total bonus value</span>
                <span className="font-semibold text-gray-900">₦255,000+</span>
              </div>
            </div>
          </div>

          {/* Lagos Offer */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-40">
              <img
                src="/gallery-2.png"
                alt="Premium SUV in Lagos"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="inline-flex items-center gap-2 bg-white/90 text-xs font-semibold text-gray-900 rounded-full px-3 py-1">
                    <Flame className="w-3 h-3 text-blue-500" />
                    <span>December Package</span>
                  </div>
                  <div className="inline-flex items-center bg-blue-500/90 text-[11px] font-semibold text-white rounded-full px-3 py-1">
                    <span>Limited slots available</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-200 font-medium mb-1">Special Offer · Lagos Only</p>
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    Get 3 premium SUV full-day rides
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.18em] mb-1">
                  Lagos VIP Package
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Get <span className="font-semibold">3 premium SUV full-day rides</span> for
                  <span className="font-semibold"> ₦350,000</span> with
                  <span className="font-semibold"> executive service</span> and a professional, verified driver.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-600">
                <p className="font-semibold text-gray-900 mb-1">Ideal for:</p>
                <p>Executive airport runs · High-level meetings · Weekend city movement</p>
              </div>

              <button className="mt-1 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Reserve Lagos VIP Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
