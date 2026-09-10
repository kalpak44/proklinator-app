/**
 * A line's name and chosen option, as the order sheet and the confirmation
 * spell it: the curse in ink, the option in the softer voice after a middot.
 * The caller owns the rest of the row — the remove control, the price, the
 * seal — so the two pages cannot drift apart.
 */
export default function LineName({ curseName, optionLabel }) {
  return (
    <>
      <span className="text-ink text-[0.98rem]">{curseName}</span>
      <span className="text-ink-soft text-[0.85rem]"> · {optionLabel}</span>
    </>
  )
}
