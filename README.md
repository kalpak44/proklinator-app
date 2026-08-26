# Proklinator

**Porcha as a Service.** Pick your curse, choose how often it hits, and leave the rest to us. From minor everyday misfortune to premium-grade supernatural inconvenience.

Choose from a rich catalog of curses and hexes, available as a **one-time purchase** or an ongoing **subscription**. Three tiers. No refunds.

## Features

- Rich selection of curses for every occasion
- One-time curse delivery
- Recurring curses with a subscription
- Three pricing tiers
- Instant activation after payment
- Order and subscription history
- New curses added regularly

## Stack

- React 19
- Vite 8
- Tailwind CSS 4 — CSS-first, no config file; theme tokens live in the `@theme` block of `src/index.css`
- ESLint 10 + Prettier 3
- nginx 1.31-alpine runtime image

## Development

```bash
npm install
npm run dev
```

## CI/CD

Production builds and deployments are fully automated.

Every merge into `main` triggers:

1. Dependency installation
2. Linting and validation
3. Production build
4. Docker image creation
5. Automatic deployment

`main` is the production branch.
