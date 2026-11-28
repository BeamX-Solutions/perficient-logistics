import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { PaymentLayout, SummaryRow } from '../components/PaymentLayout';
import { formatNaira } from '../data/offers';
import { clearPaymentSummary, verifyPayment, type VerifyResult } from '../lib/payments';

export function PaymentCompletePage() {
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref') || '';
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!reference) {
      setError(true);
      return;
    }
    let stale = false;
    verifyPayment(reference)
      .then((r) => {
        if (stale) return;
        setResult(r);
        if (r.status === 'paid') clearPaymentSummary(reference);
      })
      .catch((err) => {
        console.error('Payment check failed:', err);
        if (!stale) setError(true);
      });
    return () => {
      stale = true;
    };
  }, [reference]);

  const retry = reference && (
    <Link
      to={`/pay/${reference}`}
      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
    >
      Try payment again
    </Link>
  );

  let body: React.ReactNode;
  if (error) {
    body = (
      <Status icon={<XCircle className="w-9 h-9 text-red-600" />} tone="bg-red-100" title="We couldn't check your payment">
        <p className="text-gray-600 mb-6">
          If you were charged, don't worry: your payment will still be matched to your booking. Message us on WhatsApp
          {reference ? ` with reference ${reference}` : ''} and we'll confirm.
        </p>
        {retry}
      </Status>
    );
  } else if (!result) {
    body = <p className="text-center text-gray-600 py-8">Checking your payment...</p>;
  } else if (result.status === 'paid') {
    body = (
      <Status icon={<CheckCircle2 className="w-9 h-9 text-green-600" />} tone="bg-green-100" title="Payment received, booking confirmed">
        <p className="text-gray-600 mb-6">
          Thank you{result.fullName ? `, ${result.fullName}` : ''}. Your December package is confirmed and we'll be in touch before your start date.
        </p>
        <div className="bg-gray-50 rounded-xl p-5 text-left mb-6 space-y-2 text-sm">
          {result.offerTitle && <SummaryRow label="Package" value={result.offerTitle} />}
          {result.pickupDate && <SummaryRow label="Start date" value={result.pickupDate} />}
          {result.amount != null && <SummaryRow label="Paid" value={formatNaira(result.amount)} highlight />}
          <SummaryRow label="Reference" value={<span className="text-xs break-all">{reference}</span>} />
        </div>
        {result.email && (
          <p className="text-sm text-gray-500 mb-6">
            A receipt has been sent to <span className="font-medium text-gray-700">{result.email}</span>
          </p>
        )}
        <Link to="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          Back to home
        </Link>
      </Status>
    );
  } else if (result.status === 'pending') {
    body = (
      <Status icon={<Clock className="w-9 h-9 text-amber-600" />} tone="bg-amber-100" title="Payment not completed yet">
        <p className="text-gray-600 mb-6">
          Your booking is saved, but we haven't received payment. If you've just paid, it can take a moment to confirm. Refresh this page, or try again.
        </p>
        {retry}
      </Status>
    );
  } else {
    body = (
      <Status icon={<XCircle className="w-9 h-9 text-red-600" />} tone="bg-red-100" title="Payment didn't go through">
        <p className="text-gray-600 mb-6">Your booking is saved but unpaid. You can try paying again.</p>
        {retry}
      </Status>
    );
  }

  return <PaymentLayout reference={reference}>{body}</PaymentLayout>;
}

function Status({ icon, tone, title, children }: { icon: React.ReactNode; tone: string; title: string; children: React.ReactNode }) {
  return (
    <div className="text-center py-4">
      <div className={`w-16 h-16 ${tone} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
      {children}
    </div>
  );
}
