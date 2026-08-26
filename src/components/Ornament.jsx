/** A brass diamond flanked by two fading rules. Used as a section divider. */
export default function Ornament({ className = '' }) {
  return (
    <div className={`rule-ornament ${className}`} aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 11 11" className="flare">
        <path d="M5.5 0 L11 5.5 L5.5 11 L0 5.5 Z" fill="currentColor" opacity="0.8" />
      </svg>
    </div>
  )
}
