import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 850 } });
const errors = [];
const siteUrl = process.env.SITE_URL ?? "http://localhost:5173/";

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    errors.push(`${message.type()}: ${message.text()}`);
  }
});

page.on("pageerror", (error) => {
  errors.push(`pageerror: ${error.message}`);
});

await page.goto(siteUrl, { waitUntil: "networkidle" });

await page.click(".mobile-toggle");
const menuVisible = await page.locator(".mobile-panel").isVisible();
await page.keyboard.press("Escape");
const menuClosed = (await page.locator(".mobile-panel").count()) === 0;

await page.locator("button", { hasText: "Dining & Cafes" }).click();
await page.waitForTimeout(450);
const diningCount = await page.locator(".business-card").count();

await page.locator("button", { hasText: "All" }).click();
await page.locator('input[placeholder="Search outlets or categories"]').fill("kaya");
await page.waitForTimeout(450);
const kayaCount = await page.locator(".business-card").count();

await page.locator(".business-card button").first().click();
const modalVisible = await page.locator(".detail-panel").isVisible();
await page.keyboard.press("Escape");
const modalClosed = (await page.locator(".detail-panel").count()) === 0;

await page.locator("text=A little time for yourself.").scrollIntoViewIfNeeded();
await page.locator("button", { hasText: "Le Salon" }).click();
const wellnessText = await page.locator(".wellness-detail h3").innerText();

await page.locator("text=Past the signs").scrollIntoViewIfNeeded();
await page.locator(".gallery-image-button").click();
const lightboxVisible = await page.locator(".lightbox-panel").isVisible();

await browser.close();

console.log(
  JSON.stringify(
    {
      menuVisible,
      menuClosed,
      diningCount,
      kayaCount,
      modalVisible,
      modalClosed,
      wellnessText,
      lightboxVisible,
      errors,
    },
    null,
    2,
  ),
);
