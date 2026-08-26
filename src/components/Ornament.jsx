/** Printer's ornament: a lozenge between two rules fading out to either side. */
export default function Ornament({ className = '' }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-gold ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-full max-w-24 bg-gradient-to-r from-transparent to-current opacity-45" />
      <svg width="9" height="9" viewBox="0 0 10 10" className="shrink-0">
        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
      </svg>
      <span className="h-px w-full max-w-24 bg-gradient-to-l from-transparent to-current opacity-45" />
    </div>
  )
}
