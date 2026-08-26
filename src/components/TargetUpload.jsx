import { useRef } from 'react'

/**
 * Fake uploader. The file is turned into a local object URL for the preview and
 * never leaves the browser — there is no request, and no server to receive one.
 */
export default function TargetUpload({ photoUrl, fileName, onPick }) {
  const inputRef = useRef(null)

  const handle = (e) => {
    const file = e.target.files?.[0]
    if (file) onPick(file)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handle}
        className="sr-only"
        id="target-photo"
      />

      <label
        htmlFor="target-photo"
        className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-brass/30 bg-void/40 px-6 py-8 transition-colors duration-300 hover:border-ember/60 hover:bg-ember/5"
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Объект порчи"
            className="h-32 w-32 border border-brass/25 object-cover grayscale-[0.75] sepia-[0.25]"
          />
        ) : (
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-brass/60 transition-colors duration-300 group-hover:text-ember"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <circle cx="12" cy="12" r="3.4" />
            <path d="M8 5l1.4-2h5.2L16 5" />
          </svg>
        )}

        <span className="font-mono mt-4 text-[0.76rem] tracking-[0.12em] text-ash uppercase">
          {fileName ? fileName : 'Выбрать фотографию'}
        </span>
      </label>
    </div>
  )
}
