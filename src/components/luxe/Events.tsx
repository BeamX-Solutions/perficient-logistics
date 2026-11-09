import { useState } from 'react'
import { useBooking } from '../../booking/BookingContext'
import { eventBadge, eventPatch, formatEventWhen, useUpcomingEvents, type SiteEvent } from '../../data/events'
import { CITIES, type CityName } from '../../data/site'
import Reveal from './LuxeReveal'

const PAGE = 6

export default function Events() {
  const { booking, plan } = useBooking()
  const { events, loading, error } = useUpcomingEvents()
  const [active, setActive] = useState<CityName>(booking.city)
  const [expanded, setExpanded] = useState(false)

  // Never show a broken or empty block: the section only appears when there is something on.
  if (error || (!loading && events.length === 0)) return null

  const list = events.filter((e) => e.city === active)

  return (
    <section id="events" className="bg-ink text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <Reveal>
            <p className="eyebrow text-sky">What&rsquo;s on</p>
            <h2 className="display mt-8 text-[clamp(3rem,7vw,7rem)]">
              Where the city
              <br />
              is <em className="italic text-sky">going</em>.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-[1.85] text-ivory/60">
              Choose an event and we&rsquo;ll have the venue, date and pickup time ready. All you add is where to
              collect you.
            </p>
          </Reveal>

          <Reveal delay={150} className="flex gap-10" role="tablist" aria-label="Choose a city for events">
            {(Object.keys(CITIES) as CityName[]).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                onClick={() => {
                  setActive(c)
                  setExpanded(false)
                }}
                className={`press display relative pb-3 text-5xl md:text-6xl ${
                  active === c ? 'text-ivory' : 'text-ivory/25 hover:text-ivory/50'
                }`}
              >
                {c}
                <span
                  className={`absolute bottom-0 left-0 h-px w-full origin-left bg-sky transition-transform duration-300 ease-out ${
                    active === c ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </Reveal>
        </div>

        <div key={active} role="tabpanel" className="mt-20">
          {loading ? (
            <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto overscroll-x-contain px-6 pb-4 [scrollbar-width:none] md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:scroll-px-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16 lg:overflow-visible lg:px-0">
              {[0, 1, 2].map((i) => (
                <li key={i} className="w-[72vw] max-w-[22rem] shrink-0 sm:w-[44vw] sm:max-w-none lg:w-auto" aria-hidden>
                  <div className="aspect-[4/5] w-full animate-pulse bg-ink-3" />
                  <div className="mt-6 h-3 w-24 animate-pulse bg-ink-3" />
                  <div className="mt-4 h-8 w-3/4 animate-pulse bg-ink-3" />
                </li>
              ))}
            </ul>
          ) : list.length === 0 ? (
            <div className="animate-swap flex flex-col items-start gap-8 border-t border-ivory/15 pt-12 md:flex-row md:items-center md:justify-between">
              <p className="font-display text-3xl italic leading-tight md:text-4xl">
                Nothing listed in {active} this week. Tell us where you&rsquo;re going.
              </p>
              <button
                type="button"
                onClick={() => plan({ city: active, service: 'chauffeur' }, { open: true })}
                className="btn-line shrink-0"
              >
                Book a chauffeur →
              </button>
            </div>
          ) : (
            <>
              <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto overscroll-x-contain px-6 pb-4 [scrollbar-width:none] md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:scroll-px-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16 lg:overflow-visible lg:px-0">
                {list.map((e, i) => (
                  <li
                    key={e.id}
                    className={`animate-swap w-[72vw] max-w-[22rem] shrink-0 snap-start sm:w-[44vw] sm:max-w-none lg:w-auto ${
                      !expanded && i >= PAGE ? 'lg:hidden' : ''
                    }`}
                    style={{ animationDelay: `${60 + Math.min(i, PAGE) * 50}ms` }}
                  >
                    <EventCard event={e} onSelect={() => plan(eventPatch(e), { open: true })} />
                  </li>
                ))}
              </ul>
              {!expanded && list.length > PAGE && (
                <div className="mt-16 hidden justify-center lg:flex">
                  <button type="button" onClick={() => setExpanded(true)} className="btn-line">
                    Show more events
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

/** One event. The whole card books a ride there; the tickets link stays separately clickable. */
export function EventCard({ event: e, onSelect }: { event: SiteEvent; onSelect?: () => void }) {
  const badge = eventBadge(e.startsAt)
  return (
    <article className="group relative">
      <div className="relative overflow-hidden bg-ink-3">
        {e.imageUrl ? (
          <img
            src={e.imageUrl}
            alt=""
            loading="lazy"
            className="aspect-[4/5] w-full object-cover grayscale-[35%] transition-[scale,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center">
            <span className="display text-6xl italic text-ivory/15">{e.city}</span>
          </div>
        )}
        <span className="absolute left-4 top-4 bg-ivory px-3 py-2 text-center text-ink">
          <span className="display block text-2xl leading-none">{badge.day}</span>
          <span className="eyebrow mt-1 block !tracking-[0.3em]">{badge.month}</span>
        </span>
      </div>
      {e.category && <p className="eyebrow mt-5 text-sky md:mt-6">{e.category}</p>}
      <h3 className="display mt-3 text-3xl md:text-4xl">
        <button
          type="button"
          onClick={onSelect}
          className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-offset-4 focus-visible:after:outline-sky"
        >
          {e.title || 'Event title'}
        </button>
      </h3>
      <p className="mt-4 leading-relaxed text-ivory/70">{e.venueName || 'Venue'}</p>
      <p className="mt-1 text-ivory/50">{formatEventWhen(e)}</p>
      <div className="mt-6 flex items-center gap-6">
        <span className="eyebrow link-underline text-ivory/80 transition-colors duration-200 group-hover:text-sky">
          Get chauffeured there →
        </span>
        {e.ticketUrl && (
          <a
            href={e.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(ev) => ev.stopPropagation()}
            className="eyebrow relative z-10 text-ivory/50 transition-colors duration-200 hover:text-ivory"
          >
            Tickets ↗
          </a>
        )}
      </div>
    </article>
  )
}
