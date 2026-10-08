import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
    'https://etqan-eight.vercel.app'
  ]);

  // wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  try {
    const listRes = await fetch('http://localhost:9223/json/list');
    const tabs = await listRes.json();
    console.log('Tabs available:', tabs.length);
    const targetTab = tabs.find(t => t.type === 'page');
    if (!targetTab) {
      console.error('No page tab found');
      return;
    }

    const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

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

    // Set mobile device metrics
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    // Wait a bit for layout to settle
    await new Promise(r => setTimeout(r, 1500));

    // Evaluate layout and find overflowing elements
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const viewportWidth = window.innerWidth;
          const docScrollWidth = document.documentElement.scrollWidth;
          const bodyScrollWidth = document.body.scrollWidth;

          const overflowing = [];
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.width > viewportWidth + 1 || rect.right > viewportWidth + 1 || rect.left < -1) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className ? String(el.className).slice(0, 100) : '',
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
                text: el.innerText ? el.innerText.slice(0, 40).replace(/\\n/g, ' ') : ''
              });
            }
          }

          return {
            viewportWidth,
            docScrollWidth,
            bodyScrollWidth,
            hasHorizontalScroll: docScrollWidth > viewportWidth,
            overflowCount: overflowing.length,
            overflowing: overflowing.slice(0, 20)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('--- MOBILE OVERFLOW AUDIT (390px) ---');
    console.log(JSON.stringify(evalRes.result.value, null, 2));

    // Capture screenshot
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    if (screenshot && screenshot.data) {
      fs.writeFileSync('/home/rdluffy/Desktop/etqan/mobile-screen-390.png', Buffer.from(screenshot.data, 'base64'));
      console.log('Saved screenshot to mobile-screen-390.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error during audit:', err);
  } finally {
    chrome.kill();
  }
}

main();
