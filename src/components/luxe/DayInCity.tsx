import { DAY, img } from '../../data/site'
import Reveal from './LuxeReveal'

export default function DayInCity() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
      <div className="grid gap-20 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="eyebrow text-sky">A day with Perficient</p>
            <h2 className="display mt-8 text-[clamp(2.8rem,5.5vw,5.5rem)]">
              One day in Abuja,
              <br />
              <em className="italic text-sky">beautifully</em> kept.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <img
              src={img.millenniumPark}
              alt="Water gardens at Millennium Park, Abuja"
              loading="lazy"
              className="mt-12 aspect-[16/10] w-full object-cover"
            />
          </Reveal>
        </div>

        <ol className="relative border-l border-ivory/15">
          {DAY.map((d, i) => (
            <Reveal as="li" key={d.time} delay={i * 60} className="relative pb-16 pl-10 last:pb-0 md:pl-16">
              <span className="absolute -left-[5px] top-4 h-[9px] w-[9px] rotate-45 bg-sky" />
              <p className="font-display text-6xl font-light tabular-nums text-ivory/90 md:text-7xl">{d.time}</p>
              <h3 className="mt-3 font-display text-3xl italic text-sky">{d.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-ivory/55">{d.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
