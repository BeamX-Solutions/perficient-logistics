export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-gray-50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img 
              src="/logo--2--2.png" 
              alt="Perficient Logistics Logo" 
              className="h-16 object-contain"
            />
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
