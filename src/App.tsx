import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { BookingForm } from './components/BookingForm';
import { Newsletter } from './components/Newsletter';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';

function App() {
  const handleViewPackages = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookRideClick = () => {
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBookRideClick={handleBookRideClick} />
      <Hero onBookRideClick={handleBookRideClick} onViewPackagesClick={handleViewPackages} />
      <Services onSelectService={() => handleBookRideClick()} />
      <Testimonials />
      <div id="booking-form">
        <BookingForm embedded={true} />
      </div>
      <Newsletter />
      <Gallery />
      <Footer />
    </div>
  );
}

export default App;
