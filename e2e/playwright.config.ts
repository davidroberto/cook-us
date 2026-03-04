import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.e2e-spec.ts',
  fullyParallel: true,
  workers: 4,
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_MOBILE_URL ?? 'http://localhost:8081',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
