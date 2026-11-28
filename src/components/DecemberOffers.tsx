import { useEffect, useRef } from 'react';
import { Check, ChevronDown, Gift, X } from 'lucide-react';
import { OFFERS, OFFER_TERMS, formatNaira, offersActive, regularPrice, savings, type Offer } from '../data/offers';

interface DecemberOffersProps {
  selectedOfferId: string;
  onSelectOffer: (offerId: string) => void;
}

export function DecemberOffers({ selectedOfferId, onSelectOffer }: DecemberOffersProps) {
  if (!offersActive()) return null;

  return (
    <section id="december-offers" className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <Gift className="w-3.5 h-3.5" />
            December offers
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 mt-3">Festive packages, ₦60,000 off</h2>
          <p className="text-gray-500 text-sm mt-2">
            Available all December. Our regular rates are still available below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {OFFERS.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              selected={selectedOfferId === offer.id}
              onSelect={() => onSelectOffer(offer.id)}
            />
          ))}
        </div>

        <details className="group mt-6 rounded-2xl border border-gray-200 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
            Offer terms and conditions
            <ChevronDown className="w-5 h-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-6 pb-6">
            <OfferTerms />
          </div>
        </details>
      </div>
    </section>
  );
}

/** The December offer terms as a list; shared by the offers section, pop-up and booking review. */
export function OfferTerms({ className = '' }: { className?: string }) {
  return (
    <ul className={`space-y-1.5 text-sm text-gray-600 list-disc pl-5 ${className}`}>
      {OFFER_TERMS.map((term) => (
        <li key={term}>{term}</li>
      ))}
    </ul>
  );
}

/** Each offer card gets its own colour so the two packages are easy to tell apart. */
const CARD_THEMES: Record<string, {
  card: string;
  border: string;
  selected: string;
  accent: string;
  badge: string;
  check: string;
  button: string;
  buttonSelected: string;
}> = {
  'prado-3-day': {
    card: 'bg-gradient-to-br from-amber-50 to-white',
    border: 'border-amber-200 hover:border-amber-300',
    selected: 'border-amber-600 shadow-md',
    accent: 'text-amber-700',
    badge: 'bg-amber-700',
    check: 'text-amber-600',
    button: 'bg-amber-700 hover:bg-amber-800',
    buttonSelected: 'bg-amber-800',
  },
  'sedan-1-week': {
    card: 'bg-gradient-to-br from-emerald-50 to-white',
    border: 'border-emerald-200 hover:border-emerald-300',
    selected: 'border-emerald-600 shadow-md',
    accent: 'text-emerald-700',
    badge: 'bg-emerald-700',
    check: 'text-emerald-600',
    button: 'bg-emerald-700 hover:bg-emerald-800',
    buttonSelected: 'bg-emerald-800',
  },
};

const DEFAULT_THEME = {
  card: 'bg-white',
  border: 'border-gray-200 hover:border-gray-300',
  selected: 'border-blue-500 shadow-md',
  accent: 'text-blue-600',
  badge: 'bg-green-600',
  check: 'text-green-600',
  button: 'bg-blue-500 hover:bg-blue-600',
  buttonSelected: 'bg-blue-600',
};

export function OfferCard({ offer, selected, onSelect }: { offer: Offer; selected: boolean; onSelect: () => void }) {
  const theme = CARD_THEMES[offer.id] ?? DEFAULT_THEME;
  return (
    <article
      className={`relative flex flex-col rounded-2xl p-6 shadow-sm border-2 transition-all ${theme.card} ${
        selected ? theme.selected : theme.border
      }`}
    >
      <span className={`absolute -top-3 right-5 rounded-full px-3 py-1 text-xs font-semibold text-white ${theme.badge}`}>
        Save {formatNaira(savings(offer))}
      </span>

      <p className={`text-sm font-medium ${theme.accent}`}>{offer.tagline}</p>
      <h3 className="text-2xl font-semibold text-gray-900 mt-1">{offer.title}</h3>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">{formatNaira(offer.price)}</span>
        <span className="text-gray-400 line-through">{formatNaira(regularPrice(offer))}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Regular price {formatNaira(offer.regularDailyRate)} per day × {offer.days} days
      </p>

      <ul className="mt-4 space-y-2 text-sm text-gray-700 flex-grow">
        {offer.includes.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${theme.check}`} />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-2">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={`w-full rounded-lg px-6 py-2.5 font-medium text-white transition-colors ${
            selected ? theme.buttonSelected : theme.button
          }`}
        >
          {selected ? 'Selected, complete your booking below' : 'Select this offer'}
        </button>
      </div>
    </article>
  );
}

/** Slim strip above the header that reopens the offers pop-up. */
export function OffersBanner({ onOpen }: { onOpen: () => void }) {
  if (!offersActive()) return null;
  return (
    <div className="bg-blue-600 text-white">
      <button
        type="button"
        onClick={onOpen}
        className="w-full max-w-7xl mx-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium hover:underline"
      >
        <Gift className="w-4 h-4 shrink-0" />
        <span className="sm:hidden">December offers: save ₦60,000. Tap to see</span>
        <span className="hidden sm:inline">
          December offers: Prado 3 days for {formatNaira(OFFERS[0].price)}, Sedan 1 week for{' '}
          {formatNaira(OFFERS[1].price)}. Save ₦60,000.
        </span>
        <span className="hidden sm:inline font-semibold underline">See offers</span>
      </button>
    </div>
  );
}

/** Pop-up shown when a visitor arrives, so the offers are the first thing they see. */
export function OffersPopup({
  open,
  onClose,
  onSelectOffer,
}: {
  open: boolean;
  onClose: () => void;
  onSelectOffer: (offerId: string) => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !offersActive()) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offers-popup-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-gray-50 p-5 pt-6 sm:p-8 shadow-2xl outline-none animate-fadeUp"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close offers"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8 px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <Gift className="w-3.5 h-3.5" />
            December offers
          </span>
          <h2 id="offers-popup-title" className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-3">
            Festive packages, ₦60,000 off
          </h2>
          <p className="text-gray-500 text-sm mt-2">Available all December, while bookings last.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} selected={false} onSelect={() => onSelectOffer(offer.id)} />
          ))}
        </div>

        <details className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-3 text-left">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">Offer terms and conditions</summary>
          <OfferTerms className="mt-3" />
        </details>

        <div className="text-center mt-6">
          <button type="button" onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-gray-800">
            No thanks, see regular rates
          </button>
        </div>
      </div>
    </div>
  );
}
