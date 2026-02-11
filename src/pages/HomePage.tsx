import { useState } from 'react';
import { BookingForm } from '../components/BookingForm';
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

  const handleSelectService = (serviceType: string) => {
    setSelectedService(serviceType);
    handleBookRideClick();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBookRideClick={handleBookRideClick} />
      <Hero onBookRideClick={handleBookRideClick} />
      <Services onSelectService={handleSelectService} />
      <div id="booking-form">
        <BookingForm embedded={true} selectedService={selectedService} />
      </div>
      <Testimonials />
      <Newsletter />
      <Gallery />
      <Footer />
    </div>
  );
}
