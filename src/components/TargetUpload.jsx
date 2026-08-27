import { useId } from 'react'
import { useLanguage } from '../lib/i18n.js'

/**
 * The target photo. The file becomes a local object URL for the preview and goes
 * nowhere before payment: uploading it is the backend's job after confirmation.
 */
export default function TargetUpload({ photo, onPick, onClear }) {
  const { t } = useLanguage()
  const id = useId()

  const handle = (e) => {
    const file = e.target.files?.[0]
    if (file) onPick(file)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handle} className="sr-only" id={id} />

      <label
        htmlFor={id}
        className="group border-ink-faint/50 hover:border-marker hover:bg-marker/5 flex cursor-pointer items-center gap-4 border border-dashed px-4 py-3 transition-colors"
      >
        {photo ? (
          <img
            src={photo.url}
            alt={t('upload.alt')}
            className="border-ink-faint/40 size-16 shrink-0 border object-cover grayscale-[0.6] sepia-[0.3]"
          />
        ) : (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            className="text-ink-faint group-hover:text-marker shrink-0 transition-colors"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <circle cx="12" cy="12" r="3.4" />
            <path d="M8 5l1.4-2h5.2L16 5" />
          </svg>
        )}

        <span className="min-w-0">
          <span className="text-ink block text-[0.95rem]">
            {photo ? photo.name : t('upload.empty')}
          </span>
          <span className="text-ink-soft block text-[0.8rem] leading-snug">
            {photo ? t('upload.hint.filled') : t('upload.hint.empty')}
          </span>
        </span>
      </label>

      {photo && (
        <button
          type="button"
          onClick={onClear}
          className="font-mono text-ink-soft hover:text-marker mt-1.5 cursor-pointer text-[0.72rem] tracking-[0.1em] uppercase transition-colors"
        >
          {t('upload.remove')}
        </button>
      )}
    </div>
  )
}
