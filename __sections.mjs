import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const dir = './temporary screenshots';
if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

const sections = [
  { name: '1-hero',         selector: '#hero-section' },
  { name: '2-stats',        selector: '#stats-section' },
  { name: '3-about',        selector: '#about' },
  { name: '4-agenda',       selector: '#agenda' },
  { name: '5-speakers',     selector: '#speakers' },
  { name: '6-testimonials', selector: '#testimonials' },
  { name: '7-register',     selector: '#register' },
];

for (const { name, selector } of sections) {
  const el = await page.$(selector);
  if (!el) { console.log('SKIP (not found):', name, selector); continue; }

  await el.screenshot({ path: `${dir}/screenshot-${name}.png` });
  console.log('Saved:', name);
}

await browser.close();
