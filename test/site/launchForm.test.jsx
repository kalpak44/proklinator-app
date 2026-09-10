import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LaunchForm from '../../src/components/organisms/LaunchForm.jsx'
import OrderSummary from '../../src/components/organisms/OrderSummary.jsx'
import { translate } from '../../src/lib/i18n.js'
import { renderWithLanguage, stubLocation } from './helpers.js'

const t = (key, vars) => translate(key, vars, 'bg')

const LINE = {
  curseId: 'veil',
  optionId: 'once',
  chapterId: 'gloom',
  chapterTitle: 'Помрачение',
  curseName: 'Серая пелена',
  optionLabel: 'Касание',
  unitAmount: 1900,
  currency: 'eur',
}

const filled = {
  lines: [LINE],
  count: 1,
  known: true,
  dueNow: 1900,
}

const empty = { lines: [], count: 0, known: true, dueNow: 0 }

beforeEach(() => {
  stubLocation()
})

describe('LaunchForm', () => {
  it('cannot be submitted with an empty cart', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderWithLanguage(<LaunchForm totals={empty} items={[]} available />)

    const pay = screen.getByRole('button', { name: t('checkout.cta.empty') })
    expect(pay.disabled).toBe(true)

    await user.click(pay)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('cannot be submitted while the catalog is unavailable', () => {
    renderWithLanguage(<LaunchForm totals={filled} items={[LINE]} available={false} />)

    expect(
      screen.getByRole('button', { name: t('checkout.cta.unavailable') }).disabled
    ).toBe(true)
  })

  it('shows the amount and redirects to Stripe', async () => {
    const user = userEvent.setup()
    const assign = stubLocation()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_b9' }),
      }))
    )

    renderWithLanguage(<LaunchForm totals={filled} items={[LINE]} available />)

    const pay = screen.getByRole('button', { name: /19/ })
    await user.click(pay)

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/pay/cs_test_b9')
    )
  })

  it('says so and stays usable when the backend refuses the cart', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 400, json: async () => ({}) }))
    )

    renderWithLanguage(<LaunchForm totals={filled} items={[LINE]} available />)

    await user.click(screen.getByRole('button', { name: /19/ }))

    // The cart is deliberately untouched, so the reader can retry without rebuilding it.
    expect(await screen.findByText(t('checkout.failed'))).toBeTruthy()
    expect(screen.getByRole('button', { name: /19/ }).disabled).toBe(false)
  })
})

describe('OrderSummary', () => {
  it('offers a way back into the book when nothing is chosen', async () => {
    const user = userEvent.setup()
    const onBrowse = vi.fn()

    renderWithLanguage(
      <OrderSummary totals={empty} onRemove={() => {}} onBrowse={onBrowse} />
    )

    expect(screen.getByText(t('order.emptySheet'))).toBeTruthy()
    await user.click(screen.getByRole('button', { name: t('order.toFirstChapter') }))

    expect(onBrowse).toHaveBeenCalled()
  })

  it('groups the lines by chapter and removes one', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()

    renderWithLanguage(
      <OrderSummary totals={filled} onRemove={onRemove} onBrowse={() => {}} />
    )

    expect(screen.getByText(LINE.chapterTitle)).toBeTruthy()

    await user.click(
      screen.getByRole('button', {
        name: t('order.removeLine', { spell: LINE.curseName, option: LINE.optionLabel }),
      })
    )

    expect(onRemove).toHaveBeenCalledWith(LINE.curseId, LINE.optionId)
  })
})
