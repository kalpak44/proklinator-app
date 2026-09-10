/**
 * Helpers over the backend catalog. The catalog is keyed by the same stable ids
 * as the frontend content: curse id is the spell id, option id is the price id.
 * Nothing here invents a price — a missing or non-positive amount is skipped.
 */

/**
 * The lowest positive price among backend options, or null when none carries a
 * price yet. Used both for "from" on the title page and per chapter in the
 * contents; a catalog that has not loaded yields null, which renders as an em
 * dash rather than as a real amount.
 *
 * @param {Iterable<{unitAmount?: number}>} options
 * @returns {number|null}
 */
export function minUnitAmount(options) {
  let min = null
  for (const option of options) {
    if (option?.unitAmount > 0 && (min == null || option.unitAmount < min)) {
      min = option.unitAmount
    }
  }
  return min
}
