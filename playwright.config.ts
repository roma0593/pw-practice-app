import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './testOptions';

require('dotenv').config();

export default defineConfig<TestOptions>({
  retries: 1,
  reporter: [['json', {outputFile: 'test-results/jsonReport.json'}],
  // ['allure-playwright']],
  ['html']],
  use: {
    baseURL: process.env.DEV === '1' ? 'http://localhost:4200'
      : process.env.STAGING === '1' ? 'http://localhost:4202'
        : 'http://localhost:4200',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },

  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200'
      },
    },

    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        video: {
          mode: 'on',
          size: { width: 1920, height: 1080 }
        }
      },
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObj.spec.ts',
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 12']
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    timeout: 300000
  }
});
