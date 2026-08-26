/**
 * The catalogue. `once` is the price of a single rite; `monthly` is the
 * retainer. Both are nonsense — nothing here charges anybody anything.
 */
export const TIERS = [
  {
    id: 'glance',
    name: 'Сглаз',
    latin: 'The Glance',
    blurb: 'For the colleague who reheats fish in the shared microwave.',
    once: 13,
    monthly: 4,
    potency: 'Mild',
    duration: '7 days',
    features: [
      'One (1) misfortune of modest scale',
      'Shoelaces come undone in rain only',
      'Delivered by crow, weather permitting',
      'Self-expiring — no follow-up rite needed',
    ],
    excluded: ['Generational reach', 'Priority haunting'],
  },
  {
    id: 'porcha',
    name: 'Порча',
    latin: 'The Porcha',
    blurb: 'Our flagship. Thorough, well-documented, quietly devastating.',
    once: 66,
    monthly: 19,
    potency: 'Considerable',
    duration: '30 days, renewable',
    features: [
      'Up to five (5) concurrent misfortunes',
      'Every chair one inch too low',
      'Socks damp by 11:00, cause undetermined',
      'Wi-Fi drops at the decisive moment',
      'Monthly report on the target’s general mood',
    ],
    excluded: ['Generational reach'],
    featured: true,
  },
  {
    id: 'heirloom',
    name: 'Родовое',
    latin: 'The Heirloom',
    blurb: 'Passed down. Outlives the client, the target, and the invoice.',
    once: 999,
    monthly: 149,
    potency: 'Inadvisable',
    duration: 'Perpetual',
    features: [
      'Unlimited misfortunes, all severities',
      'Inherited by the target’s descendants',
      'Dedicated coven liaison, on call',
      'Custom sigil, engraved on request',
      'Survives relocation, rebranding and denial',
    ],
    excluded: [],
  },
]

export const BILLING = {
  once: {
    id: 'once',
    label: 'One rite',
    note: 'Paid once. Binding immediately.',
    suffix: 'one-time',
  },
  monthly: {
    id: 'monthly',
    label: 'Retainer',
    note: 'Renews monthly. Cancel whenever you dare.',
    suffix: '/ month',
  },
}
