import { AGENT } from '../data/book.js'
import { translate } from './i18n.js'

export const LINE_MS = 420

/** The agent's log lines. Kept out of the component so fast refresh works. */
export function consoleLines({ fileName, count, lang }) {
  return [
    translate('log.awake', { version: AGENT.version }, lang),
    translate('log.shot', { fileName }, lang),
    translate('log.read', null, lang),
    translate('log.codex', null, lang),
    translate('log.taken', { count }, lang),
    translate('log.name', null, lang),
    translate('log.begun', null, lang),
  ]
}

/** How long the log takes to play out; the checkout call is stretched to match. */
export const CONSOLE_MS = consoleLines({ fileName: '', count: 0 }).length * LINE_MS
