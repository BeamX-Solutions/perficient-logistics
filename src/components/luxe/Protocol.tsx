import { useBooking } from '../../booking/BookingContext'
import { img } from '../../data/site'
import Reveal from './LuxeReveal'

const ASSURANCES = [
  ['Advance route planning', 'Every route surveyed, every alternative mapped before you set off.'],
  ['Convoy coordination', 'Multi vehicle movements with lead and follow cars as required.'],
  ['Trained protocol officers', 'Airport, venue and hotel liaison handled with quiet authority.'],
  ['Confidential by default', 'Non disclosure is standard. Your itinerary is never shared.'],
]

export default function Protocol() {
  const { plan } = useBooking()
  return (
    <section id="protocol" className="grain relative isolate overflow-hidden border-y border-ivory/10">
      <img src={img.asoRock} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />

      <div className="mx-auto grid max-w-[1400px] gap-20 px-6 py-32 md:px-10 md:py-44 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-sky">Executive and diplomatic</p>
          <h2 className="display mt-8 text-[clamp(2.8rem,6vw,6rem)]">
            For those who
            <br />
            <em className="italic text-sky">cannot</em> be kept
            <br />
            waiting.
          </h2>
          <p className="mt-10 max-w-lg text-lg leading-[1.85] text-ivory/65">
            Senior executives, dignitaries, diplomatic missions and their guests move through Abuja and Lagos with
            Perficient. Escort and protocol services are planned with the precision your office expects and the
            discretion your position requires.
          </p>
          <button type="button" onClick={() => plan({ service: 'protocol' })} className="btn-line mt-12">
            Speak with our protocol desk
          </button>
        </Reveal>

        <dl className="self-end border-t border-ivory/15">
          {ASSURANCES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 70} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ivory/15 py-8">
              <span className="font-display text-lg italic text-sky">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <dt className="display text-3xl">{t}</dt>
                <dd className="mt-2 leading-relaxed text-ivory/55">{d}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
