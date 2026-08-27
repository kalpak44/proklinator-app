import { useCallback, useMemo, useRef, useState } from 'react'
import { useOrder } from './lib/useOrder.js'
import { usePageTurn } from './lib/usePageTurn.js'
import { useMedia } from './lib/useMedia.js'
import { useApiHealth } from './lib/useApiHealth.js'
import { useBookGeometry } from './lib/useBookGeometry.js'
import { formatMoney } from './lib/money.js'
import { isSoundEnabled, setSoundEnabled, primePageTurn } from './lib/pageSound.js'
import { useLanguage } from './lib/i18n.js'
import {
  buildBlocks,
  chapterSpreadIndex,
  naiveSpreads,
  paginate,
  toSpreads,
} from './lib/pagination.js'
import Book from './components/Book.jsx'
import Bookmarks from './components/Bookmarks.jsx'
import MeasureLayer from './components/MeasureLayer.jsx'
import PageContent from './components/PageContent.jsx'
import OrderSummary from './components/OrderSummary.jsx'
import LaunchForm from './components/LaunchForm.jsx'
import TitlePage from './components/TitlePage.jsx'
import Contents from './components/Contents.jsx'

/** Space between two blocks: margin + rule + padding of `.page-blocks > * + *`. */
function blockGap() {
  return 1.75 * parseFloat(getComputedStyle(document.documentElement).fontSize) + 1
}

export default function App() {
  const { lang, setLang, t, catalogue } = useLanguage()
  const { AGENT, BOOK, CHAPTERS } = catalogue
  const [index, setIndex] = useState(0)
  const [sound, setSound] = useState(isSoundEnabled)
  const [measured, setMeasured] = useState(null)
  const bookRef = useRef(null)
  const apiOk = useApiHealth()

  const spread = useMedia('(min-width: 900px)')
  const geom = useBookGeometry(bookRef, spread)
  const { keys, toggle, remove, clear, totals, isSelected } = useOrder(
    catalogue.LINE_ITEMS
  )

  // The catalogue is language-dependent, so the blocks it is composed from are
  // too; MeasureLayer re-measures them whenever the language changes.
  const blocks = useMemo(() => buildBlocks(CHAPTERS), [CHAPTERS])

  // A phone shows one long page and scrolls it; only the spread is paginated.
  const spreads = useMemo(() => {
    if (!spread || !measured) return naiveSpreads(CHAPTERS)
    return toSpreads(paginate(blocks, measured.heights, measured.available, blockGap()))
  }, [spread, measured, blocks, CHAPTERS])

  // Re-pagination can shorten the book under an index that is already past the end.
  const current = Math.min(index, spreads.length - 1)
  const { turning, goTo } = usePageTurn(spreads.length, current, setIndex)

  const toggleSound = () => {
    const next = !sound
    setSound(next)
    setSoundEnabled(next)
  }

  const onMeasured = useCallback((result) => {
    setMeasured((prev) =>
      prev &&
      prev.available === result.available &&
      sameHeights(prev.heights, result.heights)
        ? prev
        : result
    )
  }, [])

  const orderIndex = spreads.length - 1

  // Chapters behind you keep their bookmark on the left, the ones ahead on the right.
  const openings = useMemo(
    () => chapterSpreadIndex(spreads, CHAPTERS.length),
    [spreads, CHAPTERS]
  )

  const pages = useMemo(
    () =>
      spreads.map((sheet, i) => {
        if (sheet.kind === 'home') {
          return {
            id: 'home',
            verso: <TitlePage />,
            recto: <Contents openings={openings} orderIndex={orderIndex} onOpen={goTo} />,
          }
        }

        if (sheet.kind === 'order') {
          return {
            id: 'order',
            verso: (
              <OrderSummary
                totals={totals}
                onRemove={remove}
                onBrowse={() => goTo(openings[0])}
              />
            ),
            recto: <LaunchForm totals={totals} orderKeys={keys} onLaunched={clear} />,
          }
        }

        return {
          id: `spread-${i}`,
          verso: (
            <PageContent page={sheet.verso} isSelected={isSelected} onToggle={toggle} />
          ),
          recto: (
            <PageContent page={sheet.recto} isSelected={isSelected} onToggle={toggle} />
          ),
        }
      }),
    [spreads, openings, orderIndex, totals, remove, goTo, keys, clear, isSelected, toggle]
  )

  const kind = spreads[current]?.kind
  const onHome = kind === 'home'
  const onOrder = kind === 'order'

  // The front matter belongs to no chapter, so on it every bookmark is ahead.
  const openChapter = onOrder ? CHAPTERS.length : (spreads[current]?.chapterIndex ?? 0)

  const tabs = useMemo(
    () =>
      [
        ...CHAPTERS.map((chapter, i) => ({
          id: chapter.id,
          label: chapter.tab,
          spreadIndex: openings[i],
          chapterIndex: i,
        })),
        {
          id: 'order',
          label: t('order.tab'),
          spreadIndex: orderIndex,
          chapterIndex: CHAPTERS.length,
        },
      ].map((tab) => ({
        ...tab,
        side: tab.chapterIndex < openChapter ? 'left' : 'right',
      })),
    [openings, orderIndex, openChapter, CHAPTERS, t]
  )

  const activeId = onOrder ? 'order' : CHAPTERS[openChapter]?.id

  return (
    <div className="desk flex min-h-dvh flex-col" onPointerDown={primePageTurn}>
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
        {/* The title of the book closes it and puts you back on the title page. */}
        <button
          type="button"
          onClick={() => goTo(0)}
          aria-current={onHome}
          title={t('header.backToTitle')}
          className="group min-w-0 cursor-pointer text-left"
        >
          <p className="font-display text-paper group-hover:text-marker text-[1.1rem] leading-none tracking-[0.14em] uppercase transition-colors sm:text-[1.35rem]">
            {BOOK.title}
          </p>
          <p className="font-mono text-paper/45 mt-1.5 flex items-center gap-2 text-[0.6rem] tracking-[0.1em] uppercase sm:text-[0.66rem]">
            <span
              className={`agent-dot size-1.5 shrink-0 rounded-full ${
                apiOk ? 'bg-ok' : 'bg-marker'
              }`}
            />
            <span className="truncate">
              {AGENT.name} {AGENT.version} · {AGENT.state}
              <span className="max-sm:hidden"> · {AGENT.corpus}</span>
            </span>
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === 'ru' ? 'bg' : 'ru')}
            aria-label={t(lang === 'ru' ? 'lang.current.ru' : 'lang.current.bg')}
            title={t(lang === 'ru' ? 'lang.switch.bg' : 'lang.switch.ru')}
            className="font-mono border-paper/20 text-paper/80 hover:border-marker hover:text-paper cursor-pointer border px-3 py-2 text-[0.66rem] tracking-[0.12em] whitespace-nowrap uppercase transition-colors sm:text-[0.7rem]"
          >
            <span className={lang === 'bg' ? 'text-paper' : 'text-paper/40'}>BG</span>
            <span className="text-paper/40"> · </span>
            <span className={lang === 'ru' ? 'text-paper' : 'text-paper/40'}>RU</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? t('sound.off') : t('sound.on')}
            title={sound ? t('sound.title.on') : t('sound.title.off')}
            className="border-paper/20 text-paper/70 hover:border-marker hover:text-paper cursor-pointer border p-2 transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H3v6h3l5 4z" />
              {sound ? (
                <>
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </>
              ) : (
                <path d="M16 9.5l5 5M21 9.5l-5 5" />
              )}
            </svg>
          </button>

          <button
            type="button"
            onClick={() => goTo(orderIndex)}
            aria-current={onOrder}
            className="font-mono border-paper/20 text-paper/80 hover:border-marker hover:text-paper cursor-pointer border px-3 py-2 text-[0.66rem] tracking-[0.12em] whitespace-nowrap uppercase transition-colors sm:text-[0.7rem]"
          >
            <span className="max-sm:hidden">
              {t('order.tab')}
              <span className="text-paper/40"> · </span>
            </span>
            {totals.count === 0
              ? t('order.empty')
              : `${totals.count} · ${formatMoney(totals.dueNow)}`}
          </button>
        </div>
      </header>

      {/* Row from the same width the spread and its edge bookmarks appear at:
          a column there stacks the two bookmark edges above and below the book. */}
      <main className="book:flex-row book:gap-0 flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-3 sm:px-6">
        {spread ? (
          <>
            <Bookmarks tabs={tabs} side="left" activeId={activeId} onSelect={goTo} />
            <Book
              bookRef={bookRef}
              pages={pages}
              index={current}
              turning={turning}
              goTo={goTo}
            />
            <Bookmarks tabs={tabs} side="right" activeId={activeId} onSelect={goTo} />
          </>
        ) : (
          <>
            <Bookmarks tabs={tabs} side="top" activeId={activeId} onSelect={goTo} />
            <Book
              bookRef={bookRef}
              pages={pages}
              index={current}
              turning={turning}
              goTo={goTo}
            />
          </>
        )}
      </main>

      <footer className="flex shrink-0 items-center justify-center gap-4 px-4 pt-4 pb-8 sm:gap-5 sm:pt-5 sm:pb-10">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          aria-label={t('nav.prev')}
          className="font-mono text-paper/60 hover:text-paper cursor-pointer text-[0.75rem] tracking-[0.1em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-25 sm:text-[0.8rem]"
        >
          {t('nav.prevLabel')}
        </button>

        <span className="font-mono text-paper/35 text-[0.64rem] tracking-[0.16em] whitespace-nowrap uppercase sm:text-[0.68rem]">
          {onHome
            ? t('footer.home')
            : onOrder
              ? t('footer.order')
              : t('footer.chapter', { numeral: CHAPTERS[openChapter]?.numeral ?? '' })}
        </span>

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === orderIndex}
          aria-label={t('nav.next')}
          className="font-mono text-paper/60 hover:text-paper cursor-pointer text-[0.75rem] tracking-[0.1em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-25 sm:text-[0.8rem]"
        >
          {t('nav.nextLabel')}
        </button>
      </footer>

      {spread && <MeasureLayer blocks={blocks} geom={geom} onMeasured={onMeasured} />}
    </div>
  )
}

function sameHeights(a, b) {
  const keys = Object.keys(b)
  if (keys.length !== Object.keys(a).length) return false
  return keys.every((key) => Math.abs((a[key] ?? 0) - b[key]) < 0.5)
}
