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
  page.on('response', response => {
    const status = response.status();
    if (status >= 400 && response.url().includes('cartocdn') || response.url().includes('arcgisonline') || response.url().includes('maplibre')) {
      console.log(`FAILED NETWORK REQUEST: ${status} ${response.url()}`);
    }
  });

  console.log('Navigating to http://localhost:5173/login ...');
  await page.goto('http://localhost:5173/login');
  
  console.log('Logging in...');
  await page.type('input[type="text"]', 'admin');
  await page.type('input[type="password"]', 'admin');
  
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);
  
  console.log('Waiting 3 seconds for map to render...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'map_debug2.png' });
  
  console.log('Evaluating map DOM...');
  const mapData = await page.evaluate(() => {
    // Look for map container inside AcrylicCard
    const acrylicCard = document.querySelector('.glass-panel');
    const mapContainer = document.querySelector('.maplibregl-map') || (acrylicCard ? acrylicCard.firstElementChild : null);
    const canvas = document.querySelector('.maplibregl-canvas');
    return {
      acrylicCardExists: !!acrylicCard,
      acrylicCardSize: acrylicCard ? { w: acrylicCard.clientWidth, h: acrylicCard.clientHeight } : null,
      containerExists: !!mapContainer,
      containerSize: mapContainer ? { w: mapContainer.clientWidth, h: mapContainer.clientHeight } : null,
      canvasExists: !!canvas,
      canvasSize: canvas ? { w: canvas.clientWidth, h: canvas.clientHeight } : null,
      canvasOpacity: canvas ? window.getComputedStyle(canvas).opacity : null,
      canvasVisibility: canvas ? window.getComputedStyle(canvas).visibility : null,
      canvasDisplay: canvas ? window.getComputedStyle(canvas).display : null,
      errorBox: !!document.querySelector('.text-red-600'),
      errorMessage: document.querySelector('.text-red-600') ? document.querySelector('.text-red-600').innerText : null,
      mapHtml: mapContainer ? mapContainer.outerHTML : null,
      mapParentHtml: mapContainer && mapContainer.parentElement ? mapContainer.parentElement.outerHTML : null
    };
  });
  
  console.log('Map DOM Data:', JSON.stringify(mapData, null, 2));
  
  await browser.close();
  console.log('Done.');
})();
