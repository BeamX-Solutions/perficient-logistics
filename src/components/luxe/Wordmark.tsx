import logo from '../../assets/img/logo.png'

export default function Wordmark({ className = '', mark = false }) {
  return (
    <span className={`flex items-center gap-3.5 ${className}`}>
      {mark && <img src={logo} alt="" width="40" height="40" className="h-10 w-10 shrink-0" />}
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.45rem] font-normal tracking-[0.34em]">PERFICIENT</span>
        <span className="eyebrow mt-1 text-[0.5rem] tracking-[0.62em] text-sky">Services</span>
      </span>
    </span>
  )
}
