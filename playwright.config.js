const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  workers: 1,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 15000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['html'],
    ['list']
  ],
}); 