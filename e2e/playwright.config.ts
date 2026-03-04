import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testMatch: '**/*.e2e-spec.ts',
  fullyParallel: true,
  workers: 8,
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
