import { useState } from 'react'
import { useBooking } from '../../booking/BookingContext'
import { SERVICES } from '../../data/site'
import Reveal from './LuxeReveal'

export default function Services() {
  const { plan } = useBooking()
  const [hover, setHover] = useState(0)

  return (
    <section id="services" className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <p className="eyebrow text-sky">Services</p>
          <h2 className="display mt-8 text-[clamp(3rem,6.5vw,6.5rem)]">
            Six ways to
            <br />
            <em className="italic text-sky">move through</em>
            <br />
            the city.
          </h2>
        </Reveal>
        <Reveal delay={150} className="self-end">
          <p className="max-w-md text-lg leading-[1.85] text-ivory/60 lg:ml-auto">
            Every service shares the same standard: immaculate vehicles, vetted chauffeurs, total discretion and a
            concierge on call around the clock. Choose the shape of your journey; we will handle the rest.
          </p>
        </Reveal>
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-[1.4fr_1fr]">
        <ul className="border-t border-ivory/10">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="border-b border-ivory/10">
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onClick={() => plan({ service: s.id })}
                className="group grid w-full grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 py-8 text-left md:grid-cols-[5rem_1fr_auto]"
              >
                <span className={`font-display text-xl italic transition-colors duration-200 ${hover === i ? 'text-sky' : 'text-ivory/35'}`}>
                  {s.numeral}.
                </span>
                <span>
                  <span
                    className={`display block text-4xl transition-[translate,color] duration-300 ease-out md:text-5xl ${
                      hover === i ? 'translate-x-2 text-ivory' : 'text-ivory/70'
                    }`}
                  >
                    {s.title}
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows,margin,opacity] duration-400 ease-in-out ${
                      hover === i ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block font-display text-xl italic text-sky">{s.line}</span>
                      <span className="mt-3 block max-w-lg leading-relaxed text-ivory/55">{s.body}</span>
                    </span>
                  </span>
                </span>
                <span className="eyebrow whitespace-nowrap text-ivory/40 transition-colors duration-200 group-hover:text-sky">
                  Book →
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="relative hidden lg:block">
          <div className="sticky top-32 aspect-[4/5] overflow-hidden">
            {SERVICES.map((s, i) => (
              <img
                key={s.id}
                src={s.image}
                style={{ objectPosition: s.focus }}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ease-out ${
                  hover === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <p
              key={hover}
              className="absolute bottom-6 left-6 animate-swap font-display text-[7rem] italic leading-none text-ivory/90"
            >
              {SERVICES[hover].numeral}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
