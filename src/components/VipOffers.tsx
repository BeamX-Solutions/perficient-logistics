import { useEffect, useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Car,
  Clock,
  ArrowUpCircle,
  RotateCcw,
  UserCheck,
  X,
  CreditCard,
} from 'lucide-react';

type PaystackCustomField = {
  display_name: string;
  variable_name: string;
  value: string;
};

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: {
    custom_fields?: PaystackCustomField[];
  };
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

type PaystackHandler = {
  openIframe: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => PaystackHandler;
    };
  }
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: 'abuja' | 'lagos' | null;
}

function PackageModal({ isOpen, onClose, packageType }: PackageModalProps) {
  const shouldRender = isOpen && packageType;

  useEffect(() => {
    if (!shouldRender) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender, onClose]);

  if (!shouldRender) return null;

  const packageDetails = {
    abuja: {
      name: 'Abuja VIP Package',
      price: 295000,
      description: '3 Premium SUV Full-Day Rides',
      location: 'Abuja',
      paystackPaymentUrl: 'https://paystack.shop/pay/rxmu89q90e',
      whatsappMessage:
        "Hi! I'm interested in the Abuja VIP Package (3 SUV rides for ₦295,000). Can we discuss the details?",
    },
    lagos: {
      name: 'Lagos VIP Package',
      price: 350000,
      description: '3 Premium SUV Full-Day Rides',
      location: 'Lagos',
      paystackPaymentUrl: 'https://paystack.shop/pay/jnw8s39pao',
      whatsappMessage:
        "Hi! I'm interested in the Lagos VIP Package (3 SUV rides for ₦350,000). Can we discuss the details?",
    },
  };

  const details = packageDetails[packageType];
  const whatsappNumber = '2348052702261';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(details.whatsappMessage)}`;

  const handlePaystackPayment = () => {
    // If this package has a hosted Paystack payment page, route directly to it.
    if ('paystackPaymentUrl' in details && details.paystackPaymentUrl) {
      window.open(details.paystackPaymentUrl, '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }

    // Fallback to Paystack inline checkout for packages without a hosted payment page.
    const handler = window.PaystackPop?.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxx',
      email: 'customer@email.com',
      amount: details.price * 100,
      currency: 'NGN',
      ref: `VIP_${packageType.toUpperCase()}_${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Package Type',
            variable_name: 'package_type',
            value: details.name,
          },
        ],
      },
      callback: (response) => {
        alert('Payment successful! Reference: ' + response.reference);
        onClose();
      },
      onClose: () => {
        alert('Payment window closed');
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      alert('Payment system not initialized. Please try again or contact support.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-gray-900/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${details.location} VIP Package`}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50 px-6 py-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              <Flame className="h-3.5 w-3.5" />
              <span>December Package</span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">{details.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{details.description}</p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-end justify-between gap-4 rounded-xl bg-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Price</p>
              <p className="mt-1 text-3xl font-semibold text-blue-600">₦{details.price.toLocaleString()}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p className="font-semibold text-gray-900">{details.location} only</p>
              <p>Limited slots available</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-900">How would you like to proceed?</p>

            <div className="mt-3 space-y-3">
              <button
                onClick={handlePaystackPayment}
                className="w-full rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pay with Paystack
                </span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg border border-[#25D366]/40 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 fill-current text-[#25D366]"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              I'll decide later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VipOffers() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    packageType: 'abuja' | 'lagos' | null;
  }>({
    isOpen: false,
    packageType: null,
  });

  const openModal = (packageType: 'abuja' | 'lagos') => {
    setModalState({ isOpen: true, packageType });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, packageType: null });
  };

  return (
    <>
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

                <button 
                  onClick={() => openModal('abuja')}
                  className="mt-1 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
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

                <button 
                  onClick={() => openModal('lagos')}
                  className="mt-1 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  Reserve Lagos VIP Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PackageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        packageType={modalState.packageType}
      />
    </>
  );
}