import { useState } from 'react'
import { useBooking } from '../../booking/BookingContext'
import { categoryById, FLEET_TABS, modelsFor } from '../../data/fleet'
import { FLEET } from '../../data/site'
import Reveal from './LuxeReveal'

export default function Fleet() {
  const { plan } = useBooking()
  const [active, setActive] = useState<string>(FLEET_TABS[0])
  const models = modelsFor(active)
  const activeCategory = categoryById(active)

  return (
    <section id="fleet" className="bg-sky-mist text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-sky-deep">The fleet</p>
            <h2 className="display mt-8 text-[clamp(3rem,6.5vw,6.5rem)]">
              Built for these roads,
              <br />
              <em className="italic text-sky-deep">always chauffeured.</em>
            </h2>
          </Reveal>
          <Reveal delay={150} className="self-end">
            <p className="font-display text-3xl italic leading-snug md:text-4xl">{FLEET.lede}</p>
            <ul className="mt-10 border-t border-ink/15">
              {FLEET.points.map((p) => (
                <li key={p} className="flex items-baseline gap-4 border-b border-ink/15 py-4 text-ink/75">
                  <span className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rotate-45 bg-sky-deep" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal
          className="-mx-6 mt-24 flex gap-x-10 overflow-x-auto border-b border-ink/15 px-6 [scrollbar-width:none] md:mx-0 md:gap-x-12 md:overflow-visible md:px-0"
          role="tablist"
          aria-label="Choose a vehicle class"
        >
          {FLEET_TABS.map((id) => {
            const c = categoryById(id)
            if (!c) return null
            const on = active === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`fleet-tab-${id}`}
                aria-selected={on}
                aria-controls="fleet-panel"
                onClick={() => setActive(id)}
                className="press group relative shrink-0 whitespace-nowrap pb-5 text-left"
              >
                <span
                  className={`display block text-[1.7rem] transition-colors duration-200 md:text-4xl ${
                    on ? 'text-ink' : 'text-ink/25 group-hover:text-ink/50'
                  }`}
                >
                  {c.name}
                </span>
                <span
                  className={`mt-2 block font-display text-base italic transition-colors duration-200 ${
                    on ? 'text-sky-deep' : 'text-ink/30'
                  }`}
                >
                  {c.startingPrice}
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-px w-full origin-left bg-sky-deep transition-transform duration-300 ease-out ${
                    on ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            )
          })}
        </Reveal>

        <div
          key={active}
          id="fleet-panel"
          role="tabpanel"
          aria-labelledby={`fleet-tab-${active}`}
          className="mt-16"
        >
          {activeCategory && (
            <p className="max-w-xl animate-swap text-lg leading-[1.85] text-ink/65">{activeCategory.description}</p>
          )}

          <ol className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m, i) => (
              <li key={m.id} className="group flex animate-swap flex-col" style={{ animationDelay: `${60 + i * 50}ms` }}>
                <div className="relative overflow-hidden bg-ink/5">
                  <img
                    src={m.image}
                    alt={m.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: m.focus }}
                    className="aspect-[4/3] w-full object-cover grayscale-[35%] transition-[scale,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <span className="absolute left-4 top-4 bg-sky-mist px-3 py-1.5 font-display text-sm italic">
                    No. {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="eyebrow mt-6 text-sky-deep">{activeCategory?.name}</p>
                <h3 className="display mt-3 text-4xl">{m.name}</h3>
                {m.variantLine && <p className="mt-3 text-sm tracking-wide text-ink/55">{m.variantLine}</p>}
                <p className="mt-4 font-display text-2xl italic text-sky-deep">
                  {m.variants.length > 1 ? `From ${m.fromPrice}` : m.fromPrice}
                  <span className="ml-2 font-sans text-xs not-italic tracking-wide text-ink/40">per day</span>
                </p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 pt-6">
                  <button
                    type="button"
                    onClick={() =>
                      plan(
                        {
                          service: 'rental',
                          vehicleCategory: m.categoryId,
                          selectedVehicle: m.variants.length === 1 ? m.variants[0].label : '',
                        },
                        { open: true },
                      )
                    }
                    className="eyebrow link-underline whitespace-nowrap text-ink/80 transition-colors duration-200 hover:text-sky-deep"
                  >
                    Reserve this →
                  </button>
                  {m.credit && (
                    <a
                      href={m.credit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.65rem] leading-snug text-ink/40 transition-colors duration-200 hover:text-sky-deep sm:text-right"
                    >
                      Photo: {m.credit.author} · {m.credit.license}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-24 flex justify-center">
          <button
            type="button"
            onClick={() => plan({ service: 'rental' })}
            className="press inline-flex items-center justify-center gap-3 bg-ink px-8 py-5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.32em] text-ivory hover:bg-sky-deep"
          >
            Reserve a car and chauffeur →
          </button>
        </div>
      </div>
    </section>
  )
}
