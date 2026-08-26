import { useEffect, useState } from 'react'
import { LINE_MS } from '../lib/agentLog.js'

/** The agent's run log: lines appear one at a time, terminal style. */
export default function AgentConsole({ lines }) {
  const [shown, setShown] = useState(1)

  useEffect(() => {
    if (shown >= lines.length) return
    const timer = setTimeout(() => setShown((n) => n + 1), LINE_MS)
    return () => clearTimeout(timer)
  }, [shown, lines.length])

  return (
    <div
      className="border-ink-faint/40 bg-ink/[0.04] border p-4"
      aria-live="polite"
      aria-busy={shown < lines.length}
    >
      <p className="rubric flex items-center gap-2">
        <span className="agent-dot bg-marker size-1.5 rounded-full" />
        Агент работает
      </p>

      <ul className="font-mono text-ink mt-3 space-y-1.5 text-[0.78rem] leading-snug">
        {lines.slice(0, shown).map((line, i) => (
          <li key={line} className="rise flex gap-2">
            <span className="text-marker">›</span>
            <span className="min-w-0 break-words">
              {line}
              {i === shown - 1 && shown < lines.length && (
                <span className="agent-dot bg-ink ml-1 inline-block h-3 w-[7px] align-[-2px]" />
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
