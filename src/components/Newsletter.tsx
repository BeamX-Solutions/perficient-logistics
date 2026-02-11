import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);

      if (error) throw error;

      setSubmitStatus('success');
      setEmail('');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 px-6 py-12 w-full bg-[#1d233a] rounded-2xl">
          <div className="w-full text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Not ready to book yet?
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-white">
              Stay in the loop!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full flex flex-col items-center gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-12 py-4 rounded-xl font-medium transition-colors text-lg"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>

            {submitStatus === 'success' && (
              <p className="text-green-400 text-center text-sm">Successfully subscribed!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-400 text-center text-sm">Failed to subscribe. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}