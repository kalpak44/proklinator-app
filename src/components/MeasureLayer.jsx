import { useLayoutEffect, useRef } from 'react'
import PageBlock from './PageBlock.jsx'

const noop = () => {}

/**
 * An off-screen page, the same size and typography as a real one, holding every
 * block in the book. Pagination reads its block heights.
 *
 * Kept in the React tree rather than built by hand in the DOM, so a block can
 * never be measured with styles that differ from the ones it renders with.
 */
export default function MeasureLayer({ blocks, geom, onMeasured }) {
  const bodyRef = useRef(null)

  useLayoutEffect(() => {
    if (!geom) return
    let live = true

    const measure = () => {
      const body = bodyRef.current
      if (!live || !body) return
      const style = getComputedStyle(body)
      const available =
        body.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      const heights = {}
      for (const el of body.querySelectorAll('[data-block]')) {
        heights[el.dataset.block] = el.getBoundingClientRect().height
      }
      onMeasured({ heights, available })
    }

    // Synchronously, before the browser paints: measuring is the whole point of
    // a layout effect, and going through a frame would show the reader an
    // unpaginated spread first. Measured again once the book faces have loaded,
    // since every height changes when the fallback serif is replaced.
    measure()
    document.fonts?.ready.then(measure)

    return () => {
      live = false
    }
  }, [geom, blocks, onMeasured])

  if (!geom) return null

  return (
    <div
      className="measure-layer paper"
      style={{ width: geom.pageW, height: geom.pageH }}
      aria-hidden="true"
    >
      <div ref={bodyRef} className="page-body px-[8%] pt-[6%] pb-[10.5%]">
        <div className="page-blocks">
          {blocks.map((block) => (
            <div key={block.id} data-block={block.id}>
              <PageBlock block={block} isSelected={() => false} onToggle={noop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
