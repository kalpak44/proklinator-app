import ChapterFront from './ChapterFront.jsx'
import SpellEntry from './SpellEntry.jsx'

/** One unit of pagination: either a chapter frontispiece or a single curse. */
export default function PageBlock({ block, isSelected, onToggle }) {
  if (block.kind === 'front') return <ChapterFront chapter={block.chapter} />

  return (
    <SpellEntry
      chapterId={block.chapter.id}
      spell={block.spell}
      isSelected={isSelected}
      onToggle={onToggle}
    />
  )
}
