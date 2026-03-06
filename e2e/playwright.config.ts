import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

const mobileUrl = process.env.E2E_MOBILE_URL ?? "http://localhost:8082";

export default defineConfig({
  testMatch: "**/*.e2e-spec.ts",
  fullyParallel: true,
  workers: 4,
  timeout: 30_000,
  webServer: {
    command: `cd ../mobile && npx expo start --port 8082`,
        url: mobileUrl,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      EXPO_PUBLIC_SKIP_SPLASH: "true",
    },
  },
  use: {
    baseURL: mobileUrl,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
