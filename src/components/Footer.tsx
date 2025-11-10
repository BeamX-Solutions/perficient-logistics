import { Circle, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
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

          <div className="flex flex-col gap-4 text-gray-700">
            <div className="flex gap-4">
              <a href="tel:08052702261" className="hover:text-blue-500 transition-colors">
                08052702261
              </a>
              <span>,</span>
              <a href="tel:08106636311" className="hover:text-blue-500 transition-colors">
                08106636311
              </a>
            </div>
            <a
              href="mailto:perficientlogisticsltd@gmail.com"
              className="hover:text-blue-500 transition-colors"
            >
              perficientlogisticsltd@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-3 text-gray-700">
            <a href="#services" className="hover:text-blue-500 transition-colors">
              Services overview
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Terms.
            </a>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/2348052702261"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
}
