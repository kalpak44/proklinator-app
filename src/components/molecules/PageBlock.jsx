import ChapterFront from '../organisms/ChapterFront.jsx'
import StorySection from '../organisms/StorySection.jsx'

/** One unit of pagination: a chapter frontispiece or one story section. */
export default function PageBlock({ block, isSelected, onToggle, optionFor }) {
  if (block.kind === 'front') return <ChapterFront chapter={block.chapter} />

  return (
    <StorySection
      block={block}
      isSelected={isSelected}
      onToggle={onToggle}
      optionFor={optionFor}
    />
  )
}
