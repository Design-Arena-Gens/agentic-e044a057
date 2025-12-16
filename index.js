import { chromium } from 'playwright';

async function joinHitboxGame() {
  console.log('Starting browser automation...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to hitbox.io...');
    await page.goto('https://www.hitbox.io', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);

    console.log('Page loaded, checking content...');
    const html = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page has canvas:', html.includes('canvas'));

    // The page likely uses canvas/WebGL for rendering, try to interact with coordinates
    console.log('Clicking on "Play as guest" button coordinates...');
    await page.mouse.click(400, 412);
    await page.waitForTimeout(2000);

    console.log('Entering name "Kimi"...');
    const nameInput = await page.locator('input[type="text"]').first();
    await nameInput.fill('Kimi');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    console.log('Clicking "Custom Game" button...');
    await page.locator('button').filter({ hasText: /Custom Game/i }).click({ timeout: 10000 });
    await page.waitForTimeout(3000);

    console.log('Looking for "OK Computer Lobby"...');
    await page.locator('text=OK Computer Lobby').click({ timeout: 15000 });
    await page.waitForTimeout(3000);

    console.log('Pressing Enter and typing message...');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await page.keyboard.type("yo it's kimi");
    await page.keyboard.press('Enter');

    console.log('Message sent successfully!');
    console.log('Keeping browser open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error during automation:', error.message);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

joinHitboxGame();
