/**
 * The rubric and title at the head of a full-page sheet. The language screen,
 * the confirmation and the interrupted-rite page open with the same two lines
 * in the same type; only the copy differs, so only the copy is passed in.
 */
export default function SheetHeading({ rubric, title }) {
  return (
    <>
      <p className="rubric relative">{rubric}</p>
      <h1 className="font-display text-ink relative mt-2 text-[2rem] leading-[1.05] sm:text-[2.4rem]">
        {title}
      </h1>
    </>
  )
}
