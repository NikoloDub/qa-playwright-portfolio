import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  snapshotPathTemplate:
    '{testDir}/{testFilePath}-snapshots/{platform}/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.04,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests/e2e/specs',
      testIgnore: 'visual.spec.ts',
      use: {
        baseURL: 'http://127.0.0.1:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off',
        viewport: { width: 1280, height: 720 },
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'visual',
      testDir: './tests/e2e/specs',
      testMatch: 'visual.spec.ts',
      use: {
        baseURL: 'http://127.0.0.1:5173',
        viewport: { width: 1280, height: 720 },
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'http://127.0.0.1:3001',
      },
    },
  ],
});
