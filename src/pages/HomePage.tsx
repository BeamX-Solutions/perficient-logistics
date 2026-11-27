import { useState } from 'react';
import { BookingForm } from '../components/BookingForm';
import { DecemberOffers } from '../components/DecemberOffers';
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
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [selectedOffer, setSelectedOffer] = useState('');

  const handleSelectService = (serviceType: string) => {
    setSelectedService(serviceType);
    setSelectedOffer('');
    handleBookRideClick();
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffer(offerId);
    handleBookRideClick();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBookRideClick={handleBookRideClick} />
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
    </div>
  );
}
