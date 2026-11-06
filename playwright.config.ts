import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',fullyParallel:false,workers:1,timeout:45000,
 expect:{timeout:10000},reporter:[['list'],['html',{open:'never',outputFolder:'outputs/playwright-report'}]],
 use:{baseURL:process.env.TEST_BASE_URL??'http://127.0.0.1:5173',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE??'C:/Program Files/Google/Chrome/Application/chrome.exe'}},
 outputDir:'outputs/test-results',
 projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',testMatch:'**/mobile.spec.ts',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}],
});
