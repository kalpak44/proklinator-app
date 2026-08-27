import { useLanguage } from '../lib/i18n.js'

/**
 * Bookmarks along the edges of the block. A chapter you have already turned
 * past sits on the left, the ones still ahead sit on the right, so the tabs
 * always point at the side of the book their pages are on.
 *
 * The bookmark of the chapter you are reading is not shown: clicking it would
 * do nothing, and a dead tab is the one thing in the stack that has to be tried
 * before it can be understood. On the edges it leaves its slot standing, so a
 * chapter holds the same height as it moves from the right edge to the left
 * instead of jumping up the stack. Tabs belonging to the other edge are held
 * the same way, which is what keeps both columns one shared column of slots.
 *
 * On a narrow screen there are no edges to speak of: the tabs are one
 * scrollable strip above the book, positions there mean nothing, and the open
 * one is dropped from the strip outright rather than leaving a gap in it.
 */
export default function Bookmarks({ tabs, side, activeId, onSelect }) {
  const { t } = useLanguage()

  return (
    <nav
      aria-label={side === 'left' ? t('bookmarks.past') : t('bookmarks.all')}
      className={`tabs tabs--${side}`}
    >
      {tabs.map((tab) => {
        const open = tab.id === activeId
        const here = side === 'top' || tab.side === side

        if (open && side === 'top') return null

        if (open || !here) {
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
            onClick={() => onSelect(tab.spreadIndex)}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
