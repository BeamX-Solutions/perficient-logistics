import { BookingProvider } from '../booking/BookingContext';
import BookingDrawer from '../components/luxe/BookingDrawer';
import Cities from '../components/luxe/Cities';
import { FinalCall, Footer } from '../components/luxe/Closing';
import DayInCity from '../components/luxe/DayInCity';
import Events from '../components/luxe/Events';
import Experience from '../components/luxe/Experience';
import Fleet from '../components/luxe/Fleet';
import Hero from '../components/luxe/Hero';
import Nav from '../components/luxe/Nav';
import Protocol from '../components/luxe/Protocol';
import Services from '../components/luxe/Services';

export function HomePage() {
  return (
    <BookingProvider>
      <Nav />
      <main>
        <Hero />
        <Cities />
        <Events />
        <Experience />
        <Services />
        <Protocol />
        <DayInCity />
        <Fleet />
        <FinalCall />
      </main>
      <Footer />
      <BookingDrawer />
    </BookingProvider>
  );
}
