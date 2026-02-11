import {
  ArrowLeft,
  Bus,
  Car,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { suvPrices, otherVehiclePrices, busPrices, type PriceItem } from '../data/vehicleData';

function SectionCard({
  id,
  title,
  subtitle,
  icon,
  children,
  delayMs,
}: {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delayMs: number;
}) {
  return (
    <Reveal delayMs={delayMs} className="h-full">
      <section
        id={id}
        className="h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {icon}
              </span>
              {title}
            </h2>
            {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  );
}

function PriceList({ items }: { items: PriceItem[] }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-12 bg-gray-50 px-4 py-3">
        <div className="col-span-8 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Vehicle
        </div>
        <div className="col-span-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Rate
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-blue-50/60 transition-colors"
          >
            <div className="col-span-8 text-gray-900 font-medium leading-snug">
              {item.label}
            </div>
            <div className="col-span-4 text-right font-semibold text-gray-900">
              {item.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-gray-700">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MiniCard({
  icon,
  title,
  description,
  delayMs,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delayMs: number;
}) {
  return (
    <Reveal delayMs={delayMs}>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{title}</div>
            <div className="mt-1 text-sm text-gray-600 leading-relaxed">{description}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function TermsPage() {
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
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 sm:px-4 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white/60 hover:bg-white border border-gray-200/60 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
              <Link
                to={{ pathname: '/', hash: '#booking-form' }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                Book a Ride
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl animate-float" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl animate-float" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <Reveal className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 sm:p-10 flex flex-col">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                  <Sparkles className="h-4 w-4" />
                  Transparent pricing & clear rules
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Terms & Rates
                </h1>

                <p className="mt-3 text-gray-700 leading-relaxed max-w-xl">
                  Everything you need to know about daily hire duration, pricing, rules, and add-on services presented clearly for quick decisions.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('suvs');
                      const offset = 100;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el?.getBoundingClientRect().top || 0;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors"
                  >
                    SUVs
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('others');
                      const offset = 100;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el?.getBoundingClientRect().top || 0;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors"
                  >
                    Others
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('buses');
                      const offset = 100;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el?.getBoundingClientRect().top || 0;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors"
                  >
                    Buses
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('rules');
                      const offset = 100;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el?.getBoundingClientRect().top || 0;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors"
                  >
                    Rules
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MiniCard
                    delayMs={100}
                    icon={<Clock className="h-5 w-5" />}
                    title="10–12 hours per day"
                    description="Daily hire duration depends on the selected vehicle." 
                  />
                  <MiniCard
                    delayMs={200}
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    title="Driver & fuel included"
                    description="All hires include a professional driver and fuel." 
                  />
                  <MiniCard
                    delayMs={300}
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="Security options"
                    description="MOPOL/security escorts available within and outside state." 
                  />
                  <MiniCard
                    delayMs={400}
                    icon={<FileText className="h-5 w-5" />}
                    title="Clear cancellation terms"
                    description="No-shows incur 100%—24h notice reduces charges to 50%." 
                  />
                </div>
              </div>

              <div className="relative min-h-[340px] lg:min-h-full p-6 lg:p-8 flex">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="/gallery-1.png"
                    alt="Premium vehicle"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5">
                    <div className="text-white text-sm font-semibold">Premium rides. Clear rates.</div>
                    <div className="text-white/90 text-xs mt-0.5">Everything you need before you book.</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard
                  id="suvs"
                  title="SUVs Price List"
                  subtitle="Rates as provided (₦)."
                  icon={<Car className="h-5 w-5" />}
                  delayMs={100}
                >
                  <PriceList items={suvPrices} />
                </SectionCard>

                <SectionCard
                  id="others"
                  title="Other Vehicles"
                  subtitle="Rates as provided (₦)."
                  icon={<Info className="h-5 w-5" />}
                  delayMs={200}
                >
                  <PriceList items={otherVehiclePrices} />
                </SectionCard>

                <SectionCard
                  id="buses"
                  title="Buses"
                  subtitle="Rates as provided (₦)."
                  icon={<Bus className="h-5 w-5" />}
                  delayMs={300}
                >
                  <PriceList items={busPrices} />
                </SectionCard>

                <SectionCard
                  id="important"
                  title="Important Information"
                  icon={<Clock className="h-5 w-5" />}
                  delayMs={400}
                >
                  <InfoList items={importantInfo} />
                </SectionCard>

                <SectionCard
                  id="rules"
                  title="Rules"
                  icon={<ShieldCheck className="h-5 w-5" />}
                  delayMs={500}
                >
                  <InfoList items={rules} />
                </SectionCard>

                <SectionCard
                  id="services"
                  title="Other Services"
                  icon={<Sparkles className="h-5 w-5" />}
                  delayMs={600}
                >
                  <InfoList items={otherServices} />
                </SectionCard>
              </div>

              <Reveal delayMs={700} className="mt-6">
                <section
                  id="note"
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FileText className="h-5 w-5" />
                    </span>
                    Note
                  </h2>
                  <div className="mt-4">
                    <InfoList items={notes} />
                  </div>
                </section>
              </Reveal>
            </div>

            <aside className="lg:col-span-3">
              <Reveal delayMs={250} className="sticky top-28">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="font-semibold text-gray-900">On this page</div>
                  <nav className="mt-3 space-y-2 text-sm">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('suvs');
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el?.getBoundingClientRect().top || 0;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      SUVs Price List
                    </button>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('others');
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el?.getBoundingClientRect().top || 0;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Other Vehicles
                    </button>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('buses');
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el?.getBoundingClientRect().top || 0;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Buses
                    </button>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('important');
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el?.getBoundingClientRect().top || 0;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Important Information
                    </button>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('rules');
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el?.getBoundingClientRect().top || 0;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Rules
                    </button>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('services');
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el?.getBoundingClientRect().top || 0;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Other Services
                    </button>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('note');
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el?.getBoundingClientRect().top || 0;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Note
                    </button>
                  </nav>

                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Quick actions
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      <Link
                        to={{ pathname: '/', hash: '#booking-form' }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      >
                        Book now
                      </Link>
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 text-sm font-semibold border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      >
                        <Home className="h-4 w-4" />
                        Return home
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>

          <Reveal delayMs={800} className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 text-sm font-semibold border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Link>
          </Reveal>
        </div>
      </main>
    </div>
  );
}