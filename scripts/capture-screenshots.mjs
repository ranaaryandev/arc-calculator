import { chromium } from 'playwright'
import { preview } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

async function run() {
  console.log('Starting preview server...')
  const previewServer = await preview({
    preview: { port: 4173, host: 'localhost' },
  })

  const outDir = path.resolve(process.cwd(), 'docs', 'screenshots')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: true })

  // Desktop capture
  console.log('Capturing desktop screenshot...')
  const desktopPage = await browser.newPage({
    viewport: { width: 1280, height: 860 },
  })
  await desktopPage.goto('http://localhost:4173')
  await desktopPage.waitForSelector('main')
  // Perform a sample calculation so screenshot shows actual live calculation
  await desktopPage.click('button[title*="Sine"]')
  await desktopPage.click('button:has-text("3")')
  await desktopPage.click('button:has-text("0")')
  await desktopPage.click('button:has-text(")")')
  await desktopPage.click('button[title*="Add"]')
  await desktopPage.click('button:has-text("2")')
  await desktopPage.click('button[title*="Power"]')
  await desktopPage.click('button:has-text("3")')
  await desktopPage.waitForTimeout(500)
  await desktopPage.screenshot({ path: path.join(outDir, 'desktop.png') })

  // Mobile capture
  console.log('Capturing mobile screenshot (375px)...')
  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 740 },
    isMobile: true,
  })
  await mobilePage.goto('http://localhost:4173')
  await mobilePage.waitForSelector('main')
  await mobilePage.click('button:has-text("1")')
  await mobilePage.click('button:has-text("2")')
  await mobilePage.click('button[title*="Multiply"]')
  await mobilePage.click('button:has-text("5")')
  await mobilePage.waitForTimeout(500)
  await mobilePage.screenshot({ path: path.join(outDir, 'mobile.png') })

  await browser.close()
  await previewServer.close()
  console.log('Screenshots captured successfully!')
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err)
  process.exit(1)
})
