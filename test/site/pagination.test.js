import { describe, expect, it } from 'vitest'
import {
  buildBlocks,
  chapterSpreadIndex,
  naiveSpreads,
  paginate,
  toSpreads,
} from '../../src/lib/pagination.js'

const CHAPTERS = [
  { id: 'a', spells: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }] },
  { id: 'b', spells: [{ id: 'b1' }] },
]

const HEIGHTS = {
  'a/front': 100,
  'a/a1': 100,
  'a/a2': 100,
  'a/a3': 100,
  'b/front': 100,
  'b/b1': 100,
}

describe('buildBlocks', () => {
  it('puts a frontispiece before each chapter and keeps the source order', () => {
    expect(buildBlocks(CHAPTERS).map((block) => block.id)).toEqual([
      'a/front',
      'a/a1',
      'a/a2',
      'a/a3',
      'b/front',
      'b/b1',
    ])
  })

  it('carries the chapter index on every block, which is what pagination groups by', () => {
    const blocks = buildBlocks(CHAPTERS)

    expect(blocks.filter((block) => block.chapterIndex === 0)).toHaveLength(4)
    expect(blocks.at(-1)).toMatchObject({ chapterIndex: 1, kind: 'spell' })
  })
})

describe('paginate', () => {
  const blocks = buildBlocks(CHAPTERS)

  it('fills a page until the next block would not fit, gap included', () => {
    // 210 fits two 100px blocks with a 10px gap and not three.
    const pages = paginate(blocks, HEIGHTS, 210, 10)

    expect(pages[0].blocks.map((block) => block.id)).toEqual(['a/front', 'a/a1'])
    expect(pages[1].blocks.map((block) => block.id)).toEqual(['a/a2', 'a/a3'])
  })

  it('opens every chapter on a verso, inserting a blank leaf when it has to', () => {
    // Chapter a fits on one page, so b would start on a recto: a blank leaf is what a
    // printed book puts there, and it is what keeps a bookmark on the spread it names.
    const pages = paginate(blocks, HEIGHTS, 500, 10)
    const bStart = pages.findIndex((page) => page.chapterIndex === 1)

    expect(bStart % 2).toBe(0)
    expect(pages[bStart - 1].blocks).toEqual([])
  })

  it('always returns an even number of pages, so no spread is half a sheet', () => {
    for (const available of [100, 150, 210, 400, 1000]) {
      expect(paginate(blocks, HEIGHTS, available, 10).length % 2).toBe(0)
    }
  })

  it('treats an unmeasured block as zero-height rather than dropping it', () => {
    const pages = paginate(blocks, {}, 100, 10)

    expect(pages.flatMap((page) => page.blocks)).toHaveLength(blocks.length)
  })

  it('returns an empty book for no blocks', () => {
    expect(paginate([], HEIGHTS, 500, 10)).toEqual([])
  })
})

describe('toSpreads', () => {
  it('wraps the paginated pages in the front matter and the order sheet', () => {
    const spreads = toSpreads(paginate(buildBlocks(CHAPTERS), HEIGHTS, 210, 10))

    expect(spreads.at(0).kind).toBe('home')
    expect(spreads.at(-1).kind).toBe('order')
    expect(spreads.slice(1, -1).every((spread) => spread.kind === 'chapter')).toBe(true)
  })

  it('pairs the pages verso then recto', () => {
    const pages = paginate(buildBlocks(CHAPTERS), HEIGHTS, 210, 10)
    const spreads = toSpreads(pages)

    expect(spreads[1].verso).toBe(pages[0])
    expect(spreads[1].recto).toBe(pages[1])
  })
})

describe('chapterSpreadIndex', () => {
  it('gives the spread each chapter opens on', () => {
    const spreads = toSpreads(paginate(buildBlocks(CHAPTERS), HEIGHTS, 210, 10))
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
    expect(spreads[1].recto.blocks).toHaveLength(3)
  })
})
