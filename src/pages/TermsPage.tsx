import { Link } from 'react-router-dom';

type PriceItem = {
  label: string;
  price: string;
};

function PriceList({ items }: { items: PriceItem[] }) {
  return (
    <div className="divide-y divide-gray-200">
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-6 py-3">
          <div className="text-gray-800 font-medium leading-snug">{item.label}</div>
          <div className="shrink-0 font-semibold text-gray-900">{item.price}</div>
        </div>
      ))}
    </div>
  );
}

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-gray-700">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TermsPage() {
  const suvPrices: PriceItem[] = [
    { label: 'Toyota Landcruiser Armored / Bulletproof', price: '₦700,000' },
    { label: 'Toyota Landcruiser 2025 Model', price: '₦550,000' },
    { label: 'Toyota Landcruiser 2020 Model', price: '₦250,000' },
    { label: 'Toyota Landcruiser 2020 Upgraded', price: '₦200,000' },
    { label: 'Toyota Landcruiser 2015 Model', price: '₦150,000' },
    { label: 'Toyota Prado 2020 Model', price: '₦180,000' },
    { label: 'Toyota Prado 2020 Upgraded', price: '₦150,000' },
    { label: 'Toyota Prado 2018 Model', price: '₦130,000' },
    { label: 'Toyota Prado 2017 Model', price: '₦100,000' },
    { label: 'Lexus LX 570 2020 Model', price: '₦350,000' },
    { label: 'Lexus LX 570 2014 Model', price: '₦100,000' },
    { label: 'Lexus GX 460 2019 Model', price: '₦160,000' },
    { label: 'G-Wagon Benz 2023', price: '₦1,500,000' },
    { label: 'Range Rover 2020', price: '₦800,000' },
    { label: 'Toyota Hilux 2014 Model', price: '₦120,000' },
    { label: 'Toyota Hilux 2020 Model', price: '₦170,000' },
    { label: 'Toyota Hilux 2024 Model', price: '₦250,000' },
  ];

  const otherVehiclePrices: PriceItem[] = [
    { label: 'Range Rover', price: '₦850,000' },
    { label: 'Rolls Royce', price: '₦2,500,000' },
    { label: 'Mercedes Benz Sprinter Bus', price: '₦2,000,000' },
    { label: 'Benz S550', price: '₦580,000' },
    { label: 'Benz GL 550 2015 Model', price: '₦550,000' },
    { label: 'Toyota Camry 2016 Model', price: '₦100,000' },
    { label: 'Toyota Camry 2014 Model', price: '₦80,000' },
    { label: 'Toyota Avalon 2015 Model', price: '₦100,000' },
    { label: 'Toyota Corolla 2015', price: '₦80,000' },
  ];

  const busPrices: PriceItem[] = [
    { label: 'Toyota Hiace Bus High Roof Executive 2021', price: '₦180,000' },
    { label: 'Toyota Hiace Bus High Roof Executive', price: '₦150,000' },
    { label: 'Toyota Hiace Bus Flat Roof', price: '₦130,000' },
    { label: 'Toyota Coaster Bus (New Model)', price: '₦200,000' },
  ];

  const importantInfo: string[] = [
    'Duration of hire per day: 10/12 hours (depending on the vehicle).',
    'Extra charge for movements after 10/12 hours expires. Rate afterwards will be charged per hour and will vary based on vehicle.',
    'Night hire is available. Rate will depend on time hire ends and vehicle.',
  ];

  const rules: string[] = [
    'No smoking inside vehicles.',
    'Be polite to the driver; no abusive language, please.',
    'No self-driving.',
  ];

  const otherServices: string[] = [
    'Airport pickups or drop-offs start from ₦35,000 depending on the vehicle model and year.',
    'MOPOL/Security personnel escorts available at ₦40,000 per man within the state.',
    'MOPOL/Security personnel escorts available at ₦55,000 per man interstate.',
  ];

  const notes: string[] = [
    'Driver and fuel included in all hires.',
    'No refund after cancellation.',
    'Cancellations or no-shows will incur 100% of the total payable amount.',
    'If you cancel at least 24 hours in advance, only 50% of the total payable amount will be charged.',
    'Interstate travel costs more and is dependent on destination, vehicle model and model year.',
    'Day hire expires at 9pm; therefore, any movement after 9pm is considered as night hire.',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-gray-50/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90">
              <img src="/logo--2--2.png" alt="Perficient Logistics" className="h-12 w-auto" />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Back to Home
              </Link>
              <Link
                to={{ pathname: '/', hash: '#booking-form' }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                Book a Ride
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Terms & Rates</h1>
          <p className="mt-2 text-gray-600">
            Vehicle price list, hire information, rules, and additional services.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900">SUVs Price List</h2>
            <p className="mt-1 text-sm text-gray-600">Rates as provided (₦).</p>
            <div className="mt-4">
              <PriceList items={suvPrices} />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900">Other Vehicles</h2>
            <p className="mt-1 text-sm text-gray-600">Rates as provided (₦).</p>
            <div className="mt-4">
              <PriceList items={otherVehiclePrices} />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900">Buses</h2>
            <p className="mt-1 text-sm text-gray-600">Rates as provided (₦).</p>
            <div className="mt-4">
              <PriceList items={busPrices} />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900">Important Information</h2>
            <div className="mt-4">
              <InfoList items={importantInfo} />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900">Rules</h2>
            <div className="mt-4">
              <InfoList items={rules} />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900">Other Services</h2>
            <div className="mt-4">
              <InfoList items={otherServices} />
            </div>
          </section>
        </div>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900">Note</h2>
          <div className="mt-4">
            <InfoList items={notes} />
          </div>
        </section>

        <div className="mt-10">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            ← Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
