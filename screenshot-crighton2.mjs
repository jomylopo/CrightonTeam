import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const url = 'http://localhost:3000/CrightonTeam_2.html';
const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: null,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Wait for fonts and images
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await sleep(2000);

// Sections by their IDs plus navbar and footer
const sections = [
  'navbar',
  'hero',
  'properties',
  'spotlight',
  'markets',
  'about',
  'press',
  'testimonials',
  'lifestyle',
  'instagram',
  'contact',
  'footer',
];

for (const id of sections) {
  // Get element bounds
  const bounds = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId) ||
               document.querySelector(`[data-section="${sectionId}"]`) ||
               (sectionId === 'navbar' ? document.querySelector('nav, header') : null) ||
               (sectionId === 'footer' ? document.querySelector('footer') : null);
    if (!el) return null;
    el.scrollIntoView({ block: 'start' });
    const rect = el.getBoundingClientRect();
    return {
      x: 0,
      y: window.scrollY + rect.top,
      width: 1440,
      height: Math.ceil(rect.height),
    };
  }, id);

  if (!bounds || bounds.height < 10) {
    console.log(`Skipping "${id}" — not found or zero height`);
    continue;
  }

  // Scroll to section
  await page.evaluate((y) => window.scrollTo(0, y), bounds.y);
  await sleep(400);

  // Clip screenshot
  const clip = {
    x: 0,
    y: bounds.y,
    width: 1440,
    height: Math.min(bounds.height, 4000), // cap very tall sections
  };

  const path = `${dir}/section-${id}.png`;
  await page.screenshot({ path, clip, fullPage: false });
  console.log(`Saved: ${path} (height: ${bounds.height}px)`);
}

await browser.close();
console.log('All sections captured.');
