import puppeteer from 'puppeteer-core';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
const positions = await page.evaluate(() => {
  const ctaBanners = document.querySelectorAll('.grid-cta-card');
  const testimonials = document.querySelector('#testimonials');
  const stickyBar = document.querySelector('#sticky-bar');
  return {
    bodyHeight: document.body.scrollHeight,
    ctaBanners: [...ctaBanners].map(el => {
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
    }),
    testimonials: testimonials ? (() => {
      const r = testimonials.getBoundingClientRect();
      return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
    })() : null,
  };
});
console.log(JSON.stringify(positions, null, 2));
await browser.close();
