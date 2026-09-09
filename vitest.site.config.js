import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * The site suite. jsdom, and the same react plugin the app builds with so JSX and Fast
 * Refresh-free component code compile identically here and in `vite build`.
 *
 * Thresholds are in this file for the same reason as the API's: `npm run test:site`
 * enforces them on its own.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'site',
    environment: 'jsdom',
    globals: false,
    setupFiles: ['test/site/setup.js'],
    include: ['test/site/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/site',
      reporter: ['text-summary', 'lcovonly'],
      include: ['src/**/*.{js,jsx}'],
      // Presentation data, not behaviour: two 700-line message and catalogue tables
      // whose only logic is the object literal itself. Covering them measures nothing
      // and their size alone would set the global number.
      exclude: ['src/data/**'],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 90,
      },
    },
  },
})
