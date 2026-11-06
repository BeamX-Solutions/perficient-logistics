import { useMemo, useState, type ReactNode } from 'react'
import { experiencePatch, useBooking, timeSlots, todayISO, validateTrip, type Booking, type BookingErrors } from '../../booking/BookingContext'
import { SERVICES, type CityName, type ServiceId } from '../../data/site'

export default function BookingBar() {
  const { booking: b, update, setOpen } = useBooking()
  const [errors, setErrors] = useState<BookingErrors>({})
  const slots = useMemo(() => (b.date ? timeSlots(b.date) : []), [b.date])

  function onDate(date: string) {
    // Drop a time that is no longer valid for the new date.
    const patch: Partial<Booking> = { date }
    if (b.time && !timeSlots(date).includes(b.time)) patch.time = ''
    update(patch)
    setErrors((e) => ({ ...e, date: undefined }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateTrip(b)
    setErrors(errs)
    if (Object.keys(errs).length === 0) setOpen(true)
  }

  return (
    <form
      id="reserve"
      onSubmit={onSubmit}
      noValidate
      className="relative border border-ivory/20 bg-ink/55 backdrop-blur-xl"
      aria-label="Reserve your ride"
    >
      <div className="flex items-center justify-between gap-4 border-b border-ivory/10 py-3 pl-6 pr-3 md:px-8 md:py-4">
        <p className="eyebrow text-ivory/60">
          <span className="text-sky">Reserve</span>
          <span className="hidden sm:inline">
            <span className="mx-3 text-ivory/25">/</span>
            Choose a date, choose a time
          </span>
        </p>
        <div role="radiogroup" aria-label="City" className="flex gap-1">
          {(['Abuja', 'Lagos'] as CityName[]).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={b.city === c}
              onClick={() => update(experiencePatch(b, '', c))}
              className={`press eyebrow px-3 py-2 sm:px-4 ${
                b.city === c ? 'bg-sky text-ink' : 'text-ivory/60 hover:text-ivory'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_0.8fr_auto]">
        <Cell label="Service" htmlFor="bb-service">
          <select
            id="bb-service"
            className="field cursor-pointer"
            value={b.service}
            onChange={(e) => update({ service: e.target.value as ServiceId })}
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </Cell>

        <Cell label="Date" htmlFor="bb-date" error={errors.date}>
          <input
            id="bb-date"
            type="date"
            className="field cursor-pointer"
            min={todayISO()}
            value={b.date}
            onChange={(e) => onDate(e.target.value)}
            aria-invalid={!!errors.date}
          />
        </Cell>

        <Cell label="Time" htmlFor="bb-time" error={errors.time}>
          <select
            id="bb-time"
            className="field cursor-pointer disabled:cursor-not-allowed disabled:text-ivory/30"
            value={b.time}
            disabled={!b.date}
            onChange={(e) => {
              update({ time: e.target.value })
              setErrors((x) => ({ ...x, time: undefined }))
            }}
            aria-invalid={!!errors.time}
          >
            <option value="">{b.date ? 'Select' : 'Date first'}</option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Cell>

        <button type="submit" className="btn-sky group h-full min-h-20 !px-10">
          Book your ride
          <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      {b.service === 'tours' && b.experience && (
        <div className="flex items-center justify-between gap-4 border-t border-ivory/10 px-6 py-3 transition-[opacity,translate] duration-300 ease-out starting:-translate-y-1 starting:opacity-0 md:px-8">
          <p className="font-display text-lg italic text-ivory/80">
            <span className="eyebrow mr-4 not-italic text-sky">Experience</span>
            {b.experience}, {b.city}
          </p>
          <button
            type="button"
            onClick={() => update(experiencePatch(b, ''))}
            className="press eyebrow text-ivory/40 hover:text-sky"
          >
            Clear
          </button>
        </div>
      )}
    </form>
  )
}

function Cell({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div className="relative border-b border-ivory/10 px-6 py-5 md:border-b-0 md:border-r md:px-8">
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="absolute bottom-1 left-6 text-[0.7rem] tracking-wide text-sky transition-[opacity,translate] duration-200 ease-out starting:-translate-y-1 starting:opacity-0 md:left-8">
          {error}
        </p>
      )}
    </div>
  )
}
