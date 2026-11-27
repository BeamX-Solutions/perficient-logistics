import { useCallback, useState } from 'react';
import { BookingForm } from '../components/BookingForm';
import { DecemberOffers, OffersBanner, OffersPopup } from '../components/DecemberOffers';
import { offersActive } from '../data/offers';
import { STICKY_TOP_ID, scrollToSection } from '../lib/scroll';

// Show the offers pop-up once per visit; closing it keeps it closed until the tab is closed.
const POPUP_SEEN_KEY = 'perficient-december-offers-seen';

function popupAlreadySeen() {
  try {
    return sessionStorage.getItem(POPUP_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markPopupSeen() {
  try {
    sessionStorage.setItem(POPUP_SEEN_KEY, '1');
  } catch {
    // Private modes can block storage; the pop-up just shows again next load.
  }
}
import { Footer } from '../components/Footer';
import { Gallery } from '../components/Gallery';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Newsletter } from '../components/Newsletter';
import { Services } from '../components/Services';
import { Testimonials } from '../components/Testimonials';

export function HomePage() {
  const [selectedService, setSelectedService] = useState<string>('Airport Shuttle Transfers');

  const handleBookRideClick = () => {
    scrollToSection('booking-form');
  };

  const [selectedOffer, setSelectedOffer] = useState('');
  const [popupOpen, setPopupOpen] = useState(() => offersActive() && !popupAlreadySeen());

  const closePopup = useCallback(() => {
    setPopupOpen(false);
    markPopupSeen();
  }, []);

  const handleSelectService = (serviceType: string) => {
    setSelectedService(serviceType);
    setSelectedOffer('');
    handleBookRideClick();
  };

  const handleSelectOffer = (offerId: string) => {
    closePopup();
    setSelectedOffer(offerId);
    // Wait a frame so the pop-up has released the page scroll lock.
    requestAnimationFrame(handleBookRideClick);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner and header stay pinned to the top together while scrolling. */}
      <div id={STICKY_TOP_ID} className="sticky top-0 z-50">
        <OffersBanner onOpen={() => setPopupOpen(true)} />
        <Header onBookRideClick={handleBookRideClick} />
      </div>
      <Hero onBookRideClick={handleBookRideClick} />
      <Services onSelectService={handleSelectService} />
      <DecemberOffers selectedOfferId={selectedOffer} onSelectOffer={handleSelectOffer} />
      <div id="booking-form">
        <BookingForm
          embedded={true}
          selectedService={selectedService}
          offerId={selectedOffer}
          onOfferChange={setSelectedOffer}
        />
      </div>
      <Testimonials />
      <Newsletter />
      <Gallery />
      <Footer />
      <OffersPopup open={popupOpen} onClose={closePopup} onSelectOffer={handleSelectOffer} />
    </div>
  );
}
