import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import BookingForm from './components/BookingForm';
import Newsletter from './components/Newsletter';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
  const [selectedService, setSelectedService] = useState<string>('airport');

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero onBookRide={scrollToBooking} onViewPackages={scrollToServices} />
      <Services onSelectService={handleSelectService} />
      <Stats />
      <Testimonials />
      <BookingForm initialServiceType={selectedService} />
      <Newsletter />
      <Gallery />
      <Footer />
    </div>
  );
}

export default App;
