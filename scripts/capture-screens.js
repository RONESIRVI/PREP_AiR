import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5173;
const URL = `http://localhost:${PORT}/?mode=gallery`;
const PREVIEWS_DIR = path.join(__dirname, '..', 'previews');

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture process...');
  
  try {
    await fs.mkdir(PREVIEWS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create previews directory:', error);
    process.exit(1);
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: {
        width: 1280,
        height: 1024,
        deviceScaleFactor: 2, // High resolution
      }
    });

    const page = await browser.newPage();
    console.log(`🌐 Navigating to ${URL}`);
    
    try {
      await page.goto(URL, { waitUntil: 'networkidle0', timeout: 15000 });
    } catch (e) {
      console.error(`\n❌ Error: Could not reach the app at ${URL}.`);
      console.error(`Make sure the Vite server is running on port ${PORT}!`);
      console.error(`Run 'npm run dev' in another terminal first.\n`);
      process.exit(1);
    }

    console.log('📸 Page loaded. Taking screenshots...');

    const sections = await page.$$('section');
    
    if (sections.length === 0) {
      console.log('⚠️ No sections found. Is the gallery mode working?');
    }

    for (const section of sections) {
      const idHandle = await section.getProperty('id');
      const id = await idHandle.jsonValue();
      
      if (!id) continue;

      const screenshotPath = path.join(PREVIEWS_DIR, `${id}.png`);
      await section.screenshot({ path: screenshotPath });
      console.log(`✅ Captured: ${id}.png`);
    }

    console.log('\n🎉 All screenshots captured successfully in /previews folder!');

  } catch (error) {
    console.error('❌ An error occurred:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

captureScreenshots();
