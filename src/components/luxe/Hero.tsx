import { img } from '../../data/site'
import BookingBar from './BookingBar'

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* The bridge sits on the right; its night sky melts into pure black on the left */}
      <div className="absolute inset-0 -z-20 bg-black" />
      <div className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[55%]">
        <img
          src={img.lekkiNight}
          alt="The Lekki Ikoyi Link Bridge lit up at night in Lagos"
          className="h-full w-full animate-settle object-cover object-[50%_35%] opacity-50 lg:opacity-100"
        />
        {/* Neutral black seam, no tint: blends the photo's own sky into the page */}
        <div className="absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-black to-transparent lg:block" />
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pt-32 [text-shadow:0_1px_24px_rgb(0_0_0/0.45)] md:px-10 lg:pt-32">
        <div className="max-w-3xl">
          <h1 className="display text-[clamp(3.4rem,7.6vw,7.25rem)] leading-[0.95]">
            <span className="block animate-rise [animation-delay:80ms]">Live the city,</span>
            <span className="block animate-rise italic text-sky [animation-delay:160ms]">not just the ride.</span>
          </h1>

          <p className="mt-8 max-w-lg animate-rise text-lg leading-relaxed text-ivory/75 [animation-delay:240ms]">
            Private chauffeurs, protocol and chauffeured car hire for those who want to savour Abuja and Lagos: their
            people, their places and their evenings.
          </p>

          <div className="mt-9 flex animate-rise flex-wrap items-center gap-6 [animation-delay:300ms]">
            <a
              href="#cities"
              className="press inline-flex items-center bg-ivory px-7 py-3.5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.3em] text-ink hover:bg-sky"
            >
              Explore the cities
            </a>
            <a href="#services" className="eyebrow link-underline text-ivory/70 transition-colors duration-200 hover:text-ivory">
              Our services
            </a>
          </div>
        </div>

        {/* Caption for the photograph */}
        <div className="mt-auto flex animate-rise items-end justify-end pb-6 pt-10 [animation-delay:360ms]">
          <p className="hidden items-center gap-4 lg:flex">
            <span className="h-px w-10 bg-ivory/30" />
            <span className="eyebrow text-ivory/50">Lekki, Lagos</span>
            <span className="font-display text-lg italic text-ivory/50">after dark</span>
          </p>
        </div>
      </div>

      {/* Booking stays front and center */}
      <div className="mx-auto w-full max-w-[1400px] animate-rise px-6 pb-10 [animation-delay:360ms] md:px-10">
        <BookingBar />
      </div>
    </section>
  )
}
