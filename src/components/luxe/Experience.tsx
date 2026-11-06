import { EXPERIENCE } from '../../data/site'
import Reveal from './LuxeReveal'

// The guest's point of view: the door held, the back seat, the bags taken care of.
export default function Experience() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <Reveal>
          <p className="eyebrow text-sky">The experience</p>
          <h2 className="display mt-8 text-[clamp(3rem,6.5vw,6.5rem)]">
            Experience
            <br />
            <em className="italic text-sky">the back seat.</em>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="max-w-md text-lg leading-[1.85] text-ivory/60 lg:ml-auto">
            From the moment the door opens to the moment you arrive, every small thing is already taken care of. All
            that is left for you is the city.
          </p>
        </Reveal>
      </div>

      <ol className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-3">
        {EXPERIENCE.map((e, i) => (
          <Reveal as="li" key={e.title} delay={i * 80} className={i === 1 ? 'md:mt-24' : ''}>
            <div className="overflow-hidden">
              <img
                src={e.image}
                alt={e.alt}
                loading="lazy"
                style={{ objectPosition: e.focus }}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <span className="mt-6 block font-display text-sm italic text-sky">0{i + 1}</span>
            <h3 className="display mt-2 text-3xl md:text-4xl">{e.title}</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-ivory/55">{e.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
