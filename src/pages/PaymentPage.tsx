import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { PaymentLayout, SummaryRow } from '../components/PaymentLayout';
import { formatNaira, offerById, offerEndDate } from '../data/offers';
import { initializePayment, loadPaymentSummary } from '../lib/payments';

export function PaymentPage() {
  const { reference = '' } = useParams();
  const navigate = useNavigate();
  const summary = loadPaymentSummary(reference);
  const offer = summary ? offerById(summary.offerId) : undefined;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await initializePayment(reference);
      if (result.status === 'paid') {
        navigate(`/payment/complete?reference=${encodeURIComponent(reference)}`);
        return;
      }
      if (!result.authorization_url) throw new Error('No checkout link');
      window.location.assign(result.authorization_url);
    } catch (err) {
      console.error('Payment start failed:', err);
      setError("We couldn't open Paystack checkout. Please try again, or message us on WhatsApp and we'll help you pay.");
      setLoading(false);
    }
  };

  return (
    <PaymentLayout reference={reference}>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Complete your payment</h1>
        <p className="text-gray-600 text-sm">
          {summary
            ? `Thanks, ${summary.fullName}. Your booking is saved. Pay now to secure your December package.`
            : `Complete payment for booking ${reference}.`}
        </p>
      </div>

      {summary && offer && (
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm">Booking Summary</h2>
          <div className="space-y-2 text-sm">
            <SummaryRow label="Package" value={offer.title} />
            <SummaryRow label="Vehicle" value={summary.vehicle} />
            <SummaryRow label="Pickup" value={`${summary.pickupDate} at ${summary.pickupTime}`} />
            <SummaryRow label="Last day" value={offerEndDate(offer, summary.pickupDate)} />
            <div className="border-t border-gray-200 pt-2 mt-2">
              <SummaryRow label="Total" value={formatNaira(offer.price)} highlight />
            </div>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm mb-4">{error}</div>}

      <button
        onClick={pay}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-colors"
      >
        <Lock className="w-4 h-4" />
        {loading ? 'Opening Paystack...' : offer ? `Pay ${formatNaira(offer.price)} with Paystack` : 'Pay with Paystack'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        You'll be taken to Paystack's secure checkout. Payment is subject to our{' '}
        <Link to="/terms" target="_blank" className="text-blue-500 hover:text-blue-700 underline">
          Terms & Rates
        </Link>
        .
      </p>
    </PaymentLayout>
  );
}
