/**
 * Point-down pentagram inscribed in a double circle - the altar watermark that sits
 * behind the masthead. Purely decorative, so it is hidden from assistive tech and
 * never intercepts a pointer.
 *
 * Geometry: five points on a circle at 72° intervals, connected every second point
 * ({5/2} star polygon). Rotated 180° so a single point faces down.
 */
export default function Sigil({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`sigil ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(180 50 50)">
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
        />
        <path
          d="M50 1 L79.39 91.45 L2.45 35.55 L97.55 35.55 L20.61 91.45 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
