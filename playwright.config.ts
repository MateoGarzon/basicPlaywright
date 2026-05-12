import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';


 import dotenv from 'dotenv';
 import path from 'path';
 dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig<TestOptions>({
  timeout: 40000,
  globalTimeout: 60000,

  expect: {
    timeout: 2000
  },
  retries: 1,
  reporter: 'html',

  use: {

     baseURL: 'http://localhost:4200',
     globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',

    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 25000,
    extraHTTPHeaders: {
        'authorization': `Token ${process.env.ACCESS_TOKEN}`
    },
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },
  //globalSetup: require.resolve('./global-setup.ts'),
  //globalTeardown: require.resolve('./global-teardown.ts'),

  projects: [
    {name: 'setup',testMatch: 'auth.setup.ts'},
    {
      name: 'dev',
      use: {
         ...devices['Desktop Chrome'],
         storageState: '.auth/user.json',
         baseURL: 'http://localhost:4201', 
      },
      dependencies: ['setup'],
    },
        {
      name: 'stg',
      use: {
         ...devices['Desktop Chrome'], 
         storageState: '.auth/user.json',
         baseURL: 'http://localhost:4202', 
      },
      dependencies: ['setup']
    },
    {
      name: 'articleSetup',
      testMatch: 'newArticle.setup.ts',
      dependencies: ['setup'],
      teardown: 'articleCleanUp'
    },
    {
      name: 'articleCleanUp',
      testMatch:'articleCleanUp.setup.ts'
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['setup']
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: '.auth/user.json' },
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: '.auth/user.json' },
      dependencies: ['setup']
    },

    {
      name: 'regression',
      testIgnore: 'likesCounter.spec.ts',
      use: {...devices['Desktop Chrome'],storageState: '.auth/user.json'},
      dependencies: ['setup']
    },

    {
      name: 'likeCounter',
      testMatch: 'likesCounter.spec.ts',
      use: {...devices['Desktop Chrome'],storageState: '.auth/user.json'},
      dependencies: ['articleSetup']
    },
    
    {
      name: 'likeCounterGlobal',
      testMatch: 'likesCounterGlobal.spec.ts',
      use: {...devices['Desktop Chrome'],storageState: '.auth/user.json'},
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use:{
        ...devices['Galaxy S24']
      }
    }
  ],

});
