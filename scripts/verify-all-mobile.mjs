import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  console.log('1. Starting Next.js production server on port 3001...');
  const nextServer = spawn('npx', ['next', 'start', '-p', '3001'], {
    stdio: 'ignore',
    detached: false
  });

  // Wait 3 seconds for server to start
  await new Promise(r => setTimeout(r, 3000));

  console.log('2. Starting Chrome headless...');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
    'http://localhost:3001'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  try {
    const listRes = await fetch('http://localhost:9225/json/list');
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((res) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            res(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const testViewports = [
      { name: 'Android-360', width: 360, height: 740 },
      { name: 'iPhone-390', width: 390, height: 844 },
    ];

    for (const vp of testViewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: true,
      });

      await new Promise(r => setTimeout(r, 1000));

      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const vw = window.innerWidth;
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;

            // Check if any visible element exceeds viewport bounds
            const badElements = [];
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              // Check elements overflowing right or left
              if (r.right > vw + 2 || r.left < -2) {
                badElements.push({
                  tag: el.tagName,
                  cls: (el.className || '').toString().slice(0, 50),
                  left: Math.round(r.left),
                  right: Math.round(r.right),
                  width: Math.round(r.width),
                  text: (el.innerText || '').slice(0, 25)
                });
              }
            });

            // Check header specifically
            const header = document.querySelector('header');
            const hRect = header ? header.getBoundingClientRect() : null;

            // Check bottom nav specifically
            const bottomNav = document.querySelector('nav[aria-label="شريط التنقل السريع للهواتف"]');
            const bRect = bottomNav ? bottomNav.getBoundingClientRect() : null;

            return {
              viewportWidth: vw,
              docWidth,
              bodyWidth,
              hasHorizontalOverflow: docWidth > vw || bodyWidth > vw,
              badCount: badElements.length,
              badElements: badElements.slice(0, 5),
              headerBounds: hRect ? { left: Math.round(hRect.left), right: Math.round(hRect.right), width: Math.round(hRect.width) } : null,
              bottomNavBounds: bRect ? { left: Math.round(bRect.left), right: Math.round(bRect.right), width: Math.round(bRect.width) } : null
            };
          })()
        `,
        returnByValue: true
      });

      console.log(`=== VIEWPORT AUDIT: ${vp.name} (${vp.width}px) ===`);
      console.log(JSON.stringify(evalRes.result.value, null, 2));

      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`/home/rdluffy/Desktop/etqan/screenshot-${vp.name}.png`, Buffer.from(screenshot.data, 'base64'));
      console.log(`Saved screenshot to screenshot-${vp.name}.png`);
    }

    ws.close();
  } catch(e) {
    console.error('Error during test:', e);
  } finally {
    chrome.kill();
    nextServer.kill();
  }
}

main();
