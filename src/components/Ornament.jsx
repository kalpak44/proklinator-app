/** A small point-down pentagram flanked by two fading rules. Section divider. */
export default function Ornament({ className = '' }) {
  return (
    <div className={`rule-ornament ${className}`} aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 100 100" className="flare">
        <path
          d="M50 1 L79.39 91.45 L2.45 35.55 L97.55 35.55 L20.61 91.45 Z"
          transform="rotate(180 50 50)"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
