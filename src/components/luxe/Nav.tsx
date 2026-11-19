import { useEffect, useState } from 'react'
import { BRAND } from '../../data/site'
import HashLink from './HashLink'
import Wordmark from './Wordmark'

const LINKS: [string, `#${string}`][] = [
  ['Cities', '#cities'],
  ['Events', '#events'],
  ['Services', '#services'],
  ['Protocol', '#protocol'],
  ['Fleet', '#fleet'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out ${
        scrolled || menu ? 'border-b border-ivory/10 bg-ink/85 backdrop-blur-md' : 'border-b border-ivory/15 bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <HashLink to="#top" aria-label={`${BRAND.fullName}, home`}>
          <Wordmark mark />
        </HashLink>

        <ul className="hidden items-center gap-10 lg:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <HashLink to={href} className="eyebrow link-underline text-ivory/70 transition-colors hover:text-ivory">
                {label}
              </HashLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-8 lg:flex">
          <a href={BRAND.phoneHref} className="font-sans text-[0.95rem] font-normal not-italic tracking-wider tabular-nums text-ivory/90 transition-colors duration-200 hover:text-sky">
            {BRAND.phone}
          </a>
          <HashLink to="#reserve" className="btn-sky !px-6 !py-3">
            Reserve
          </HashLink>
        </div>

        <button
          type="button"
          className="press flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          aria-expanded={menu}
          onClick={() => setMenu((m) => !m)}
        >
          <span className={`h-px w-6 bg-ivory transition-transform duration-200 ease-out ${menu ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-ivory transition-transform duration-200 ease-out ${menu ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {menu && (
        <div className="border-t border-ivory/10 px-6 pb-10 pt-6 transition-[opacity,translate] duration-250 ease-out starting:-translate-y-2 starting:opacity-0 lg:hidden">
          <ul className="space-y-5">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <HashLink to={href} onClick={() => setMenu(false)} className="display text-4xl">
                  {label}
                </HashLink>
              </li>
            ))}
          </ul>
          <HashLink to="#reserve" onClick={() => setMenu(false)} className="btn-sky mt-8 w-full">
            Reserve your ride
          </HashLink>
        </div>
      )}
    </header>
  )
}
