import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onBookRideClick: () => void;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function Header({ onBookRideClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 transition-transform hover:scale-105 duration-300">
            <img src="/logo--2--2.png" alt="Perficient Logistics" className="h-14 w-auto" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('about')}
              className="text-gray-700 hover:text-blue-500 transition-all duration-300 relative group"
            >
              About us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-gray-700 hover:text-blue-500 transition-all duration-300 relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handleNavClick('testimonials')}
              className="text-gray-700 hover:text-blue-500 transition-all duration-300 relative group"
            >
              Testimonials
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Desktop only Book a Ride */}
            <button
              onClick={onBookRideClick}
              className="hidden md:inline-flex bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Book a Ride
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
            <button
              onClick={() => handleNavClick('about')}
              className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-500 font-medium transition-colors"
            >
              About us
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-500 font-medium transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('testimonials')}
              className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-500 font-medium transition-colors"
            >
              Testimonials
            </button>
            <button
              onClick={() => {
                onBookRideClick();
                setMobileMenuOpen(false);
              }}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Book a Ride
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
