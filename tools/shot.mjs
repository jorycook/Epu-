// Screenshot an HTML file with the pre-installed Chromium. Usage: node tools/shot.mjs page.html out.png [width] [scale]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [, , page, out, w = '1400', scale = '1'] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 900 }, deviceScaleFactor: +scale });
await p.goto('file://' + (page.startsWith('/') ? page : process.cwd() + '/' + page));
await p.waitForTimeout(400);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log('shot ' + out);
