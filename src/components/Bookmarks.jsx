/**
 * Bookmarks along the edges of the block. A chapter you have already turned
 * past sits on the left, the ones still ahead sit on the right, so the tabs
 * always point at the side of the book their pages are on.
 *
 * Both columns render every tab and hide the ones belonging to the other side.
 * That keeps one shared column of slots, so a chapter holds the same height as
 * it moves from the right edge to the left instead of jumping up the stack.
 *
 * On a narrow screen there are no edges to speak of: every tab is shown, in one
 * scrollable strip above the book.
 */
export default function Bookmarks({ tabs, side, activeId, onSelect }) {
  return (
    <nav
      aria-label={side === 'left' ? 'Пройденные главы' : 'Главы книги'}
      className={`tabs tabs--${side}`}
    >
      {tabs.map((tab) => {
        const here = side === 'top' || tab.side === side

        if (!here) {
          return (
            <span key={tab.id} className="tab tab--ghost" aria-hidden="true">
              {tab.label}
            </span>
          )
        }

        return (
          <button
            key={tab.id}
            type="button"
            className="tab shrink-0 snap-start"
            aria-current={tab.id === activeId}
            onClick={() => onSelect(tab.spreadIndex)}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
