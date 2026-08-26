import Ornament from './Ornament.jsx'
import PageBlock from './PageBlock.jsx'

/**
 * The blocks that ended up on one page. The first block on a page drops its
 * separating rule: it has nothing above it to be separated from.
 */
export default function PageContent({ page, isSelected, onToggle }) {
  if (!page || page.blocks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Ornament className="w-2/3 opacity-40" />
      </div>
    )
  }

  return (
    <div className="page-blocks">
      {page.blocks.map((block) => (
        <PageBlock
          key={block.id}
          block={block}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
