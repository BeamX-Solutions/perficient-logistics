import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 bg-gray-50">
      <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
          Not ready to book yet?
        </h2>
        <p className="text-xl md:text-2xl text-white mb-8">Stay in the loop!</p>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Send request
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}