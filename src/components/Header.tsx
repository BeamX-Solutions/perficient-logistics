interface HeaderProps {
  onBookRideClick: () => void;
}

export function Header({ onBookRideClick }: HeaderProps) {
  return (
    <header className="bg-gray-50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 transition-transform hover:scale-105 duration-300">
            <img src="/logo--2--2.png" alt="Perficient Logistics" className="h-14 w-auto" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#about" 
              className="text-gray-700 hover:text-blue-500 transition-all duration-300 relative group"
            >
              About us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#services" 
              className="text-gray-700 hover:text-blue-500 transition-all duration-300 relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-700 hover:text-blue-500 transition-all duration-300 relative group"
            >
              Testimonials
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <button
            onClick={onBookRideClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Book a Ride
          </button>
        </div>
      </div>
    </header>
  );
}