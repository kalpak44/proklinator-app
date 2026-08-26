/**
 * Page composition.
 *
 * A page of a real book does not scroll: it holds what fits and the rest moves
 * on to the next one. So the blocks of every chapter are measured once at the
 * current page size (see MeasureLayer) and packed greedily into pages here.
 *
 * A chapter always opens on a verso, which is what makes the bookmarks line up
 * with the spread they name. If the previous chapter ended on one, a blank leaf
 * is inserted, exactly as a printed book does.
 */

/** Ordered content blocks of the whole book: a frontispiece, then the curses. */
export function buildBlocks(chapters) {
  return chapters.flatMap((chapter, chapterIndex) => [
    { id: `${chapter.id}/front`, kind: 'front', chapterIndex, chapter },
    ...chapter.spells.map((spell) => ({
      id: `${chapter.id}/${spell.id}`,
      kind: 'spell',
      chapterIndex,
      chapter,
      spell,
    })),
  ])
}

const blankPage = (chapterIndex) => ({ chapterIndex, blocks: [], height: 0 })

/**
 * @param {Array} blocks   from buildBlocks
 * @param {Object} heights block id to measured height in px
 * @param {number} available usable height of one page in px
 * @param {number} gap     vertical space between two blocks in px
 */
export function paginate(blocks, heights, available, gap) {
  const pages = []
  let current = null

  for (const block of blocks) {
    const height = heights[block.id] ?? 0
    const sameChapter = current && current.chapterIndex === block.chapterIndex
    const fits = current && current.height + gap + height <= available

    if (sameChapter && fits) {
      current.blocks.push(block)
      current.height += gap + height
      continue
    }

    // A new chapter starts on the left-hand page of a fresh spread.
    if (!sameChapter && pages.length % 2 === 1) {
      pages.push(blankPage(current.chapterIndex))
    }

    current = { chapterIndex: block.chapterIndex, blocks: [block], height }
    pages.push(current)
  }

  if (pages.length % 2 === 1) {
    pages.push(blankPage(current ? current.chapterIndex : 0))
  }

  return pages
}

/**
 * Pairs of pages. The front matter - title page and contents - is always the
 * opening spread, and the order sheet always the closing one. Neither is
 * paginated: both hold fixed content that fits one page by construction.
 */
export function toSpreads(pages) {
  const spreads = [{ kind: 'home', chapterIndex: -1 }]
  for (let i = 0; i < pages.length; i += 2) {
    spreads.push({
      kind: 'chapter',
      chapterIndex: pages[i].chapterIndex,
      verso: pages[i],
      recto: pages[i + 1],
    })
  }
  spreads.push({ kind: 'order', chapterIndex: -1 })
  return spreads
}

/** Spread index each chapter opens on, for the bookmarks. */
export function chapterSpreadIndex(spreads, chapterCount) {
  const first = new Array(chapterCount).fill(0)
  for (let c = 0; c < chapterCount; c += 1) {
    const found = spreads.findIndex((s) => s.kind === 'chapter' && s.chapterIndex === c)
    first[c] = found === -1 ? 0 : found
  }
  return first
}

/**
 * Fallback used for the first frame, before anything has been measured: one
 * spread per chapter, frontispiece on the left and the curses on the right,
 * between the same front matter and order sheet as the paginated version.
 */
export function naiveSpreads(chapters) {
  const spreads = [{ kind: 'home', chapterIndex: -1 }]
  const chapterSpreads = chapters.map((chapter, chapterIndex) => {
    const [front, ...spells] = buildBlocks([chapter])
    return {
      kind: 'chapter',
      chapterIndex,
      verso: { chapterIndex, blocks: [{ ...front, chapterIndex }] },
      recto: { chapterIndex, blocks: spells.map((b) => ({ ...b, chapterIndex })) },
    }
  })
  spreads.push(...chapterSpreads, { kind: 'order', chapterIndex: -1 })
  return spreads
}
