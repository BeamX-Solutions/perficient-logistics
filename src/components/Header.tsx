import { Circle } from 'lucide-react';

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
              <Circle className="w-8 h-8 text-white fill-white" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">PERFICIENT</div>
              <div className="text-xs text-gray-600 tracking-wider">LOGISTICS LIMITED</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About us
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Testimonials
            </button>
          </nav>

          <button
            onClick={() => scrollToSection('booking')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Book a Ride
          </button>
        </div>
      </div>
    </header>
  );
}
