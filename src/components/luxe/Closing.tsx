import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, SERVICES, TESTIMONIALS, img } from '../../data/site'
import Reveal from './LuxeReveal'
import HashLink from './HashLink'
import Wordmark from './Wordmark'

export function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden)

  // Never advance while someone is reading, or while the tab is in the background.
  useEffect(() => {
    const on = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  // Keyed on `i`, so choosing a quote manually restarts the full 7 seconds.
  useEffect(() => {
    if (paused || hidden) return
    const t = setTimeout(() => setI((n) => (n + 1) % TESTIMONIALS.length), 7000)
    return () => clearTimeout(t)
  }, [i, paused, hidden])
  const t = TESTIMONIALS[i]

  return (
    <section
      className="mx-auto max-w-[1100px] px-6 py-32 text-center md:px-10 md:py-40"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setPaused(false)}
    >
      <Reveal>
        <span aria-hidden className="block font-display text-[9rem] leading-[0.5] text-sky">“</span>
        <blockquote key={i} className="animate-swap [animation-duration:600ms]">
          <p className="display mt-6 text-[clamp(2rem,4.2vw,3.8rem)] italic leading-[1.15]">{t.quote}</p>
          <footer className="mt-10">
            <p className="eyebrow text-ivory">{t.who}</p>
            <p className="mt-2 font-display text-lg italic text-ivory/50">{t.role}</p>
          </footer>
        </blockquote>
        <div className="mt-12 flex justify-center gap-3">
          {TESTIMONIALS.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Show testimonial ${n + 1}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className={`relative h-px transition-[width,background-color] duration-300 ease-out before:absolute before:-inset-y-3 before:inset-x-0 ${
                n === i ? 'w-12 bg-sky' : 'w-6 bg-ivory/30 hover:bg-ivory/60'
              }`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export function FinalCall() {
  return (
    <section className="grain relative isolate overflow-hidden">
      <img src={img.lekkiBridge} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/60 to-ink" />
      <div className="mx-auto max-w-[1400px] px-6 py-40 text-center md:px-10 md:py-52">
        <Reveal>
          <p className="eyebrow text-sky">Abuja &nbsp;·&nbsp; Lagos</p>
          <h2 className="display mt-10 text-[clamp(3.4rem,10vw,10rem)]">
            Your city
            <br />
            <em className="italic text-sky">is waiting.</em>
          </h2>
          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <HashLink to="#reserve" className="btn-sky">
              Choose your date
            </HashLink>
            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" className="btn-line">
              WhatsApp the concierge
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-ivory/10">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-20 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-10">
        <div>
          <Wordmark />
          <p className="mt-8 max-w-xs font-display text-xl italic leading-snug text-ivory/60">
            The finest of Abuja and Lagos, chauffeured.
          </p>
        </div>
        <FooterCol title="Services">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <HashLink to="#services" className="link-underline transition-colors duration-200 hover:text-sky">
                {s.title}
              </HashLink>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Cities">
          <li>Abuja, FCT</li>
          <li>Lagos</li>
          <li className="text-ivory/35">Inter-state on request</li>
        </FooterCol>
        <FooterCol title="Concierge">
          <li>
            <a href={BRAND.phoneHref} className="link-underline transition-colors duration-200 hover:text-sky">
              {BRAND.phone}
            </a>
          </li>
          <li>
            <a href={BRAND.phoneAltHref} className="link-underline transition-colors duration-200 hover:text-sky">
              {BRAND.phoneAlt}
            </a>
          </li>
          <li>
            <a href={`mailto:${BRAND.email}`} className="link-underline break-all transition-colors duration-200 hover:text-sky">
              {BRAND.email}
            </a>
          </li>
          <li className="text-ivory/35">Open 24 hours, every day</li>
          <li>
            <Link to="/terms" className="link-underline transition-colors duration-200 hover:text-sky">
              Terms &amp; Rates
            </Link>
          </li>
        </FooterCol>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 px-6 py-6 text-xs text-ivory/35 md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.</p>
          <p>
            Photos:{' '}
            <a
              href="https://commons.wikimedia.org/wiki/File:Toyota_Land_Cruiser_Prado_VX_black_diplomatic.jpg"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ivory/20 underline-offset-2 hover:text-sky"
            >
              Ethan Llamas
            </a>
            ,{' '}
            <a
              href="https://commons.wikimedia.org/wiki/File:Canopy_walk_-_Lekki_conservation_center.jpg"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ivory/20 underline-offset-2 hover:text-sky"
            >
              Turizimpressions
            </a>{' '}
            (CC BY-SA 4.0)
          </p>
          <p className="eyebrow !text-[0.6rem]">Private chauffeurs · Protocol · Car hire</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-sky">{title}</p>
      <ul className="mt-6 space-y-3 text-ivory/70">{children}</ul>
    </div>
  )
}
