import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new'
  });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', error => console.log('BROWSER PAGE ERROR:', error.message));

  console.log('Navigating to http://localhost:5173/login ...');
  await page.goto('http://localhost:5173/login');
  
  console.log('Logging in...');
  await page.type('input[type="text"]', 'admin');
  await page.type('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for dashboard...');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  // Wait a few seconds for map to completely load and render
  console.log('Waiting 3 seconds for map to render...');
  await new Promise(r => setTimeout(r, 3000));
  
  // Take a screenshot
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'map_debug.png' });
  
  console.log('Evaluating map DOM...');
  const mapData = await page.evaluate(() => {
    const mapContainer = document.querySelector('.maplibregl-map');
    const canvas = document.querySelector('.maplibregl-canvas');
    return {
      containerExists: !!mapContainer,
      containerSize: mapContainer ? { w: mapContainer.clientWidth, h: mapContainer.clientHeight } : null,
      canvasExists: !!canvas,
      canvasSize: canvas ? { w: canvas.clientWidth, h: canvas.clientHeight } : null,
      canvasOpacity: canvas ? window.getComputedStyle(canvas).opacity : null,
      canvasVisibility: canvas ? window.getComputedStyle(canvas).visibility : null,
      canvasDisplay: canvas ? window.getComputedStyle(canvas).display : null,
      parentHasFlex: mapContainer?.parentElement ? window.getComputedStyle(mapContainer.parentElement).flex : null,
      parentHeight: mapContainer?.parentElement ? mapContainer.parentElement.clientHeight : null,
    };
  });
  
  console.log('Map DOM Data:', JSON.stringify(mapData, null, 2));
  
  await browser.close();
  console.log('Done.');
})();
