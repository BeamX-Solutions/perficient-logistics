import { useBooking } from '../../booking/BookingContext'
import { FLEET, VEHICLES } from '../../data/site'
import Reveal from './LuxeReveal'

export default function Fleet() {
  const { plan } = useBooking()

  return (
    <section id="fleet" className="bg-sky-mist text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow text-sky-deep">The fleet</p>
          <h2 className="display mt-8 text-[clamp(3rem,6.5vw,6.5rem)]">
            Built for these roads,
            <br />
            <em className="italic text-sky-deep">always chauffeured.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <Reveal className="overflow-hidden">
            <img
              src={FLEET.image}
              alt="A black Toyota Land Cruiser Prado on a city street"
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={80} className="flex flex-col justify-between">
            <div>
              <p className="font-display text-3xl italic leading-snug md:text-4xl">{FLEET.lede}</p>
              <ul className="mt-10 border-t border-ink/15">
                {FLEET.points.map((p) => (
                  <li key={p} className="flex items-baseline gap-4 border-b border-ink/15 py-4 text-ink/75">
                    <span className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rotate-45 bg-sky-deep" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-8 leading-loose text-ink/45">
                Choose from: {VEHICLES.join('  ·  ')}, or similar
              </p>
            </div>
            <button
              type="button"
              onClick={() => plan({ service: 'rental' })}
              className="press mt-10 inline-flex items-center justify-center gap-3 bg-ink px-8 py-5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.32em] text-ivory hover:bg-sky-deep"
            >
              Reserve a car and chauffeur →
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
