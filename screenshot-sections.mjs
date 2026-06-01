import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const sections = [
  { id: 'nav',   label: 'nav' },
  { id: 'hero',  label: 'hero' },
  { id: 'strip', label: 'icon-strip' },
  { id: 'blog',  label: 'blog-grid' },
  { id: 'dark',  label: 'dark-section' },
  { id: 'cta',   label: 'cta' },
  { id: 'footer', label: 'footer' },
];

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Remove sticky nav offset for clean section shots
await page.addStyleTag({ content: '#nav { position: relative !important; }' });

for (const section of sections) {
  const el = await page.$(`#${section.id}`);
  if (!el) { console.log(`Skipping #${section.id} — not found`); continue; }

  const path = `${dir}/section-${section.label}.png`;
  await el.screenshot({ path });
  console.log(`Saved: ${path}`);
}

await browser.close();
console.log('\nAll section screenshots saved.');
