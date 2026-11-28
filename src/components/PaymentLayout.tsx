import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '../lib/payments';

/** Simple page shell for the payment screens: logo bar and a centred card. */
export function PaymentLayout({ children, reference }: { children: React.ReactNode; reference?: string }) {
  const help = whatsappUrl(
    reference
      ? `Hi! I need help paying for my December offer booking (${reference}).`
      : 'Hi! I need help paying for my December offer booking.',
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          <Link to="/" aria-label="Perficient Logistics home">
            <img src="/logo--2--2.png" alt="Perficient Logistics" className="h-12 w-auto" />
          </Link>
        </div>
      </header>
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200">{children}</div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Need help?{' '}
          <a
            href={help}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#1da851] font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with us on WhatsApp
          </a>
        </p>
      </main>
    </div>
  );
}

export function SummaryRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-right ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}
