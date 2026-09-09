import { describe, expect, it } from 'vitest'
import {
  buildBlocks,
  chapterSpreadIndex,
  naiveSpreads,
  paginate,
  toSpreads,
} from '../../src/lib/pagination.js'

const CHAPTERS = [
  {
    id: 'a',
    spells: [
      {
        id: 'a1',
        story: [
          { kind: 'prose', text: 'one' },
          { kind: 'accounts', items: [{ text: 'first' }, { text: 'second' }] },
        ],
      },
      { id: 'a2', story: [{ kind: 'prose', text: 'two' }] },
    ],
  },
  { id: 'b', spells: [{ id: 'b1', story: [{ kind: 'prose', text: 'three' }] }] },
]

const ids = (blocks) => blocks.map((block) => block.id)
const HEIGHT = 100
const heights = (blocks) => Object.fromEntries(ids(blocks).map((id) => [id, HEIGHT]))

describe('buildBlocks', () => {
  const blocks = buildBlocks(CHAPTERS)

  it('puts a frontispiece before each chapter and one block per story section', () => {
    expect(ids(blocks)).toEqual([
      'a/front',
      'a/a1/0',
      'a/a1/1/0',
      'a/a1/1/1',
      'a/a2/0',
      'b/front',
      'b/b1/0',
    ])
  })

  it('splits an accounts section one block per case', () => {
    // Otherwise several alleged cases crowd a page out between them and the
    // pagination has no smaller unit to move.
    const accounts = blocks.filter((block) => block.section?.kind === 'account')

    expect(accounts).toHaveLength(2)
    expect(accounts[0].heading).toBe(true)
    expect(accounts[1].heading).toBe(false)
  })

  it('marks the start of every curse as a page break', () => {
    const breaks = blocks.filter((block) => block.breakBefore).map((block) => block.id)

    expect(breaks).toEqual(['a/front', 'a/a1/0', 'a/a2/0', 'b/front', 'b/b1/0'])
  })

  it('carries the chapter index on every block, which is what pagination groups by', () => {
    expect(blocks.filter((block) => block.chapterIndex === 0)).toHaveLength(5)
    expect(blocks.at(-1)).toMatchObject({ chapterIndex: 1, kind: 'story' })
  })
})

describe('paginate', () => {
  const blocks = buildBlocks(CHAPTERS)
  const H = heights(blocks)

  it('opens every curse on a fresh page however much room is left', () => {
    // A whole chapter would fit on one page at this height; breakBefore is what
    // stops two curses running into each other.
    const pages = paginate(blocks, H, 10_000, 10)

    expect(pages[0].blocks.map((b) => b.id)).toEqual(['a/front'])
    expect(pages[1].blocks.map((b) => b.id)).toEqual(['a/a1/0', 'a/a1/1/0', 'a/a1/1/1'])
    expect(pages[2].blocks.map((b) => b.id)).toEqual(['a/a2/0'])
  })

  it('fills a page until the next block would not fit, gap included', () => {
    // 210 fits two 100px blocks with a 10px gap and not three.
    const pages = paginate(blocks, H, 210, 10)

    expect(pages[1].blocks.map((b) => b.id)).toEqual(['a/a1/0', 'a/a1/1/0'])
    expect(pages[2].blocks.map((b) => b.id)).toEqual(['a/a1/1/1'])
  })

  it('opens every chapter on a verso, inserting a blank leaf when it has to', () => {
    // Chapter a takes three pages, so b would start on a recto: a blank leaf is what a
    // printed book puts there, and it is what keeps a bookmark on the spread it names.
    const pages = paginate(blocks, H, 10_000, 10)
    const bStart = pages.findIndex((page) => page.chapterIndex === 1)

    expect(bStart % 2).toBe(0)
    expect(pages[bStart - 1].blocks).toEqual([])
  })

  it('always returns an even number of pages, so no spread is half a sheet', () => {
    for (const available of [100, 150, 210, 400, 10_000]) {
      expect(paginate(blocks, H, available, 10).length % 2).toBe(0)
    }
  })

  it('treats an unmeasured block as zero-height rather than dropping it', () => {
    const pages = paginate(blocks, {}, 100, 10)

    expect(pages.flatMap((page) => page.blocks)).toHaveLength(blocks.length)
  })

  it('returns an empty book for no blocks', () => {
    expect(paginate([], H, 500, 10)).toEqual([])
  })
})

describe('toSpreads', () => {
  const pages = paginate(buildBlocks(CHAPTERS), heights(buildBlocks(CHAPTERS)), 210, 10)

  it('wraps the paginated pages in the front matter and the order sheet', () => {
    const spreads = toSpreads(pages)

    expect(spreads.at(0).kind).toBe('home')
    expect(spreads.at(-1).kind).toBe('order')
    expect(spreads.slice(1, -1).every((spread) => spread.kind === 'chapter')).toBe(true)
  })

  it('pairs the pages verso then recto', () => {
    const spreads = toSpreads(pages)

    expect(spreads[1].verso).toBe(pages[0])
    expect(spreads[1].recto).toBe(pages[1])
  })
})

describe('chapterSpreadIndex', () => {
  it('gives the spread each chapter opens on', () => {
    const blocks = buildBlocks(CHAPTERS)
    const spreads = toSpreads(paginate(blocks, heights(blocks), 210, 10))
    const openings = chapterSpreadIndex(spreads, CHAPTERS.length)

    expect(spreads[openings[0]].chapterIndex).toBe(0)
    expect(spreads[openings[1]].chapterIndex).toBe(1)
  })

  it('falls back to the title page for a chapter that has no spread', () => {
    expect(chapterSpreadIndex([{ kind: 'home', chapterIndex: -1 }], 2)).toEqual([0, 0])
  })
})

describe('naiveSpreads', () => {
  it('gives one spread per chapter before anything has been measured', () => {
    const spreads = naiveSpreads(CHAPTERS)

    expect(spreads).toHaveLength(CHAPTERS.length + 2)
    expect(spreads[1].verso.blocks).toHaveLength(1)
    expect(spreads[1].recto.blocks).toHaveLength(4)
  })
})
