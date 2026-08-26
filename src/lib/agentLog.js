import { AGENT } from '../data/book.js'

export const LINE_MS = 420

/** The agent's log lines. Kept out of the component so fast refresh works. */
export function consoleLines({ fileName, count }) {
  return [
    `агент ${AGENT.version} пробуждается`,
    `снимок принят: ${fileName}`,
    'черты считаны ... объект узнан',
    'свод открыт ... слово выбрано',
    `взято в работу: ${count}`,
    'имя вписано, круг замкнут',
    'начато',
  ]
}

/** How long the log takes to play out; the checkout call is stretched to match. */
export const CONSOLE_MS = consoleLines({ fileName: '', count: 0 }).length * LINE_MS
