import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FinalCall, Footer } from '../components/luxe/Closing';
import Reveal from '../components/luxe/LuxeReveal';
import Nav from '../components/luxe/Nav';
import { img } from '../data/site';
import { busPrices, otherVehiclePrices, suvPrices, type PriceItem } from '../data/vehicleData';

const HIGHLIGHTS: [string, string][] = [
  ['10 to 12 hours a day', 'Daily hire duration depends on the selected vehicle.'],
  ['Driver and fuel included', 'Every hire comes with a professional chauffeur and a full tank.'],
  ['Security on request', 'MOPOL and security escorts available within and outside the state.'],
  ['Clear cancellation terms', 'No-shows incur 100%. Cancel 24 hours ahead and only 50% applies.'],
];

const IMPORTANT_INFO = [
  'Duration of hire per day: 10/12 hours (depending on the vehicle).',
  'Extra charge for movements after 10/12 hours expires. Rate afterwards will be charged per hour and will vary based on vehicle.',
  'Night hire is available. Rate will depend on time hire ends and vehicle.',
];

const RULES = ['No smoking inside vehicles.', 'Be polite to the driver; no abusive language, please.', 'No self-driving.'];

const OTHER_SERVICES = [
  'Airport pickups or drop-offs start from ₦35,000 depending on the vehicle model and year.',
  'MOPOL/Security personnel escorts available at ₦40,000 per man within the state.',
  'MOPOL/Security personnel escorts available at ₦55,000 per man interstate.',
];

const NOTES = [
  'Driver and fuel included in all hires.',
  'No refund after cancellation.',
  'Cancellations or no-shows will incur 100% of the total payable amount.',
  'If you cancel at least 24 hours in advance, only 50% of the total payable amount will be charged.',
  'Interstate travel costs more and is dependent on destination, vehicle model and model year.',
  'Day hire expires at 9pm; therefore, any movement after 9pm is considered as night hire.',
];

const SECTIONS = [
  { id: 'suvs', title: 'SUVs', lede: 'Daily rates, chauffeur and fuel included.', prices: suvPrices },
  { id: 'others', title: 'Other vehicles', lede: 'Saloons, luxury cars and more.', prices: otherVehiclePrices },
  { id: 'buses', title: 'Buses', lede: 'For delegations, events and group travel.', prices: busPrices },
  { id: 'important', title: 'Important information', items: IMPORTANT_INFO },
  { id: 'rules', title: 'Rules of the ride', items: RULES },
  { id: 'services', title: 'Other services', items: OTHER_SERVICES },
  { id: 'note', title: 'Please note', items: NOTES },
] as const;

export function TermsPage() {
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  return (
    <>
      <Nav />
      <main>
        {/* Header */}
        <section className="grain relative isolate overflow-hidden border-b border-ivory/10">
          <img
            src={img.fleetPrado}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full animate-settle object-cover opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />

          <div className="mx-auto grid max-w-[1400px] gap-16 px-6 pb-24 pt-44 md:px-10 md:pb-32 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow animate-rise text-sky">Terms and rates</p>
              <h1 className="display mt-8 text-[clamp(3.2rem,7vw,7rem)]">
                <span className="block animate-rise [animation-delay:80ms]">Clear rates,</span>
                <span className="block animate-rise italic text-sky [animation-delay:160ms]">no surprises.</span>
              </h1>
              <p className="mt-10 max-w-lg animate-rise text-lg leading-[1.85] text-ivory/65 [animation-delay:240ms]">
                Everything you need to know before you book: daily hire, pricing, the rules of the ride and the
                services we add on request.
              </p>
            </div>

            <dl className="animate-rise border-t border-ivory/15 [animation-delay:300ms]">
              {HIGHLIGHTS.map(([t, d], i) => (
                <div key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ivory/15 py-6">
                  <span className="font-display text-lg italic text-sky">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <dt className="display text-2xl md:text-3xl">{t}</dt>
                    <dd className="mt-2 leading-relaxed text-ivory/55">{d}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Body */}
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[16rem_1fr] lg:gap-24">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-32">
              <p className="eyebrow text-ivory/40">On this page</p>
              <ol className="mt-6 space-y-4">
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`group flex items-baseline gap-4 transition-colors duration-200 ${
                        active === s.id ? 'text-sky' : 'text-ivory/50 hover:text-ivory'
                      }`}
                    >
                      <span className="font-display text-sm italic">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-xl">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-12 flex flex-col gap-3">
                <Link to={{ pathname: '/', hash: '#reserve' }} className="btn-sky">
                  Book your ride
                </Link>
                <Link to="/" className="btn-line">
                  Return home
                </Link>
              </div>
            </nav>
          </aside>

          {/* Section links for small screens; the side navigation takes over on large ones */}
          <nav aria-label="On this page" className="-mx-6 -mb-4 overflow-x-auto px-6 lg:hidden">
            <ol className="flex gap-6 whitespace-nowrap border-b border-ivory/10 pb-4">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="eyebrow text-ivory/60 transition-colors duration-200 hover:text-sky">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-28">
            {SECTIONS.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <Reveal>
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-xl italic text-sky">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="display text-[clamp(2.4rem,4.5vw,4rem)]">{s.title}</h2>
                  </div>
                  {'lede' in s && <p className="mt-4 font-display text-xl italic text-ivory/55">{s.lede}</p>}
                </Reveal>
                <Reveal delay={80} className="mt-10">
                  {'prices' in s ? <PriceTable items={s.prices} /> : <PointList items={s.items} />}
                </Reveal>
              </section>
            ))}
          </div>
        </div>

        <FinalCall />
      </main>
      <Footer />
    </>
  );
}

function PriceTable({ items }: { items: readonly PriceItem[] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-ivory/20">
          <th scope="col" className="eyebrow pb-4 text-left font-normal text-ivory/40">
            Vehicle
          </th>
          <th scope="col" className="eyebrow pb-4 text-right font-normal text-ivory/40">
            Per day
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.label} className="group border-b border-ivory/10 transition-colors duration-200 hover:bg-ivory/[0.03]">
            <td className="py-4 pr-6 font-display text-xl text-ivory/85 transition-colors duration-200 group-hover:text-ivory md:text-2xl">
              {item.label}
            </td>
            <td className="whitespace-nowrap py-4 text-right font-display text-xl italic text-sky md:text-2xl">
              {item.price}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PointList({ items }: { items: readonly string[] }) {
  return (
    <ul className="border-t border-ivory/15">
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-5 border-b border-ivory/15 py-5 text-lg leading-relaxed text-ivory/75">
          <span className="h-1.5 w-1.5 shrink-0 translate-y-[-3px] rotate-45 bg-sky" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// Highlights the section currently in view in the side navigation.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');

  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}
