import { defineConfig } from 'vitest/config'

/**
 * The API suite. Separate from the site's because the two halves are separate Sonar
 * projects with their own coverage report, and because they need different
 * environments — this one runs express on node, the other one renders React in jsdom.
 *
 * The thresholds live here rather than in a CI step, so `npm run test:api` alone
 * enforces them and a step deleted from a workflow cannot silently disable them.
 */
export default defineConfig({
  test: {
    name: 'api',
    environment: 'node',
    include: ['test/api/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/api',
      reporter: ['text-summary', 'lcovonly'],
      include: ['backend/src/**/*.js'],
      thresholds: {
        // Everything that decides what a buyer is charged. 100 because none of it is
        // hard to reach now that the app is separable from the process running it.
        'backend/src/app.js': {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
        // server.js binds a port at module scope, so v8 sees nothing — it is exercised
        // as a real process by test/api/server.test.js instead. Left in the report at 0
        // rather than excluded, because an exclusion is the same move as lowering a
        // threshold: this floor is what a new untested file trips.
        statements: 70,
        branches: 55,
        functions: 70,
        lines: 70,
      },
    },
  },
})
