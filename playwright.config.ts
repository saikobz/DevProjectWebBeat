import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run dev -- --port 3000",
        url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000
      },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry"
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]]
});
