import { useState } from 'react'
import { experienceLabel, experiencePatch, useBooking } from '../../booking/BookingContext'
import { CITIES, type CityName } from '../../data/site'
import Reveal from './LuxeReveal'

export default function Cities() {
  const { booking, plan } = useBooking()
  const [active, setActive] = useState(booking.city)
  const city = CITIES[active]

  return (
    <section id="cities" className="bg-ivory text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <Reveal>
            <p className="eyebrow text-sky-deep">The cities</p>
            <h2 className="display mt-8 text-[clamp(3rem,7vw,7rem)]">
              Two cities.
              <br />
              <em className="italic text-sky-deep">Endless</em> evenings.
            </h2>
          </Reveal>

          <Reveal delay={150} className="flex gap-10" role="tablist" aria-label="Choose a city">
            {(Object.keys(CITIES) as CityName[]).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={`press display relative pb-3 text-5xl md:text-6xl ${
                  active === c ? 'text-ink' : 'text-ink/25 hover:text-ink/50'
                }`}
              >
                {c}
                <span
                  className={`absolute bottom-0 left-0 h-px w-full origin-left bg-sky-deep transition-transform duration-300 ease-out ${
                    active === c ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </Reveal>
        </div>

        <div key={active} role="tabpanel" className="mt-20 grid gap-16 lg:grid-cols-[0.9fr_1.6fr]">
          <div className="animate-swap lg:sticky lg:top-32 lg:self-start">
            <p className="font-display text-4xl italic leading-tight md:text-5xl">{city.tagline}</p>
            <p className="mt-8 text-lg leading-[1.85] text-ink/65">{city.intro}</p>
            <button
              type="button"
              onClick={() => plan({ ...experiencePatch(booking, '', active), service: 'tours' })}
              className="press group mt-10 inline-flex items-center gap-4 border-b border-ink pb-2 font-sans text-[0.72rem] font-medium uppercase tracking-[0.32em] hover:border-sky-deep hover:text-sky-deep"
            >
              Plan a day in {active}
              <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          <ol className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
            {city.places.map((p, i) => (
              <li
                key={p.name}
                className={`group animate-swap ${i % 2 ? 'sm:mt-24' : ''}`}
                style={{ animationDelay: `${60 + i * 50}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover grayscale-[35%] transition-[scale,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <span className="absolute left-4 top-4 bg-ivory px-3 py-1.5 font-display text-sm italic">
                    No. {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="eyebrow mt-6 text-sky-deep">{p.kind}</p>
                <h3 className="display mt-3 text-4xl">{p.name}</h3>
                <p className="mt-4 leading-relaxed text-ink/60">{p.note}</p>
                <button
                  type="button"
                  onClick={() =>
                    plan({ ...experiencePatch(booking, experienceLabel(p), active), service: 'tours' }, { open: true })
                  }
                  className="eyebrow link-underline mt-6 text-ink/80 transition-colors duration-200 hover:text-sky-deep"
                >
                  {p.kind === 'Dining' ? 'Plan this evening →' : 'Plan this day →'}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
