import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('bodyHeight:', bodyHeight);

const shots = [
  ['hero',         0,              720],
  ['stats-strip',  720,            320],
  ['demo-banner',  1260,           280],
  ['grid-cta1',    4236,           320],
  ['grid-cta2',    8071,           320],
  ['testimonials', 12167,          900],
  ['email-cta',    bodyHeight - 380, 380],
];
for (const [name, y, h] of shots) {
  const sy = Math.max(0, Math.min(y, bodyHeight - h));
  await page.screenshot({ path: `${dir}/sec-${name}.png`, clip: { x: 0, y: sy, width: 1440, height: h } });
}

await browser.close();
console.log('Done. Body height:', bodyHeight);
