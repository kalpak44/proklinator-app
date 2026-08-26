/**
 * Marker stroke around the selected price row. Two uneven loops, the second one
 * delayed and fainter, the way a hand goes round a second time.
 *
 * The svg sits inside a positioned span rather than being positioned itself: an
 * absolutely placed replaced element with `height: auto` takes its intrinsic
 * height and ignores `bottom`, which made the loop far taller than the row.
 *
 * `vector-effect="non-scaling-stroke"` is required too: the viewBox is stretched
 * to the width of the row, and without it the line is squashed along with it.
 */
export default function MarkerCircle({ className = '' }) {
  return (
    <span
      className={`pointer-events-none absolute -inset-x-3 inset-y-[-1.3rem] translate-y-[5px] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="h-full w-full">
        <path
          d="M14 21C14 9 56 4 101 4C151 4 191 9 191 21C191 32 147 37 98 36C51 35 13 32 13 20C13 12 32 6 55 4"
          pathLength="1"
          strokeDasharray="1"
          vectorEffect="non-scaling-stroke"
          className="marker-ink"
        />
        <path
          d="M22 27C40 34 78 37 118 36C158 35 186 30 190 22"
          pathLength="1"
          strokeDasharray="1"
          vectorEffect="non-scaling-stroke"
          className="marker-ink marker-ink--second"
        />
      </svg>
    </span>
  )
}
