import { chromium } from 'playwright'
import { preview } from 'vite'

async function runE2E() {
  console.log('🚀 [E2E] Starting Vite production preview server on port 4173...')
  const previewServer = await preview({
    preview: { port: 4173, host: 'localhost' },
  })

  console.log('🌐 [E2E] Launching Chromium in headless mode...')
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } })

  let failedTests = 0
  let passedTests = 0

  async function test(name, fn) {
    try {
      await fn()
      console.log(`  ✓ ${name}`)
      passedTests++
    } catch (err) {
      console.error(`  ✕ ${name}`)
      console.error(`    ${err.message}`)
      failedTests++
    }
  }

  console.log('\n--- Arc Calculator 2.0 Playwright E2E Suite ---')

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForSelector('main')

  await test('Page title and header brand render correctly', async () => {
    const title = await page.title()
    if (!title.includes('Arc Calculator')) {
      throw new Error(`Unexpected title: ${title}`)
    }
    const brand = await page.textContent('header')
    if (!brand.includes('Arc Calculator')) {
      throw new Error('Brand text missing in header')
    }
  })

  await test('Arithmetic calculation via UI clicks: 7 + 8 = 15', async () => {
    const stdKeypad = 'section[aria-label="Standard keypad"]'
    const acBtn = await page.$(`${stdKeypad} button:has-text("AC")`)
    if (acBtn) await acBtn.click()

    await page.click(`${stdKeypad} button:has-text("7")`)
    await page.click(`${stdKeypad} button[title*="Add"]`)
    await page.click(`${stdKeypad} button:has-text("8")`)
    await page.click(`${stdKeypad} button[title*="Calculate"]`)

    await page.waitForTimeout(100)
    const resultEl = await page.$('div[aria-label^="Result:"]')
    const resultText = resultEl ? await resultEl.textContent() : ''
    if (!resultText.includes('15')) {
      throw new Error(`Expected result 15, got: "${resultText}"`)
    }
  })

  await test('Angle mode switch DEG <-> RAD', async () => {
    const degBtn = await page.$('button:has-text("DEG")')
    const radBtn = await page.$('button:has-text("RAD")')
    if (!degBtn || !radBtn) throw new Error('Angle mode buttons not found')

    await radBtn.click()
    const radPressed = await radBtn.getAttribute('aria-pressed')
    if (radPressed !== 'true') throw new Error('RAD mode should be pressed')

    await degBtn.click()
    const degPressed = await degBtn.getAttribute('aria-pressed')
    if (degPressed !== 'true') throw new Error('DEG mode should be pressed')
  })

  await test('Undo and Redo expression editing', async () => {
    const stdKeypad = 'section[aria-label="Standard keypad"]'
    await page.click(`${stdKeypad} button:has-text("AC")`)

    await page.click(`${stdKeypad} button:has-text("9")`)
    await page.click(`${stdKeypad} button[title*="Multiply"]`)
    await page.click(`${stdKeypad} button:has-text("9")`)

    const undoBtn = await page.$('button[title*="Undo"]')
    if (!undoBtn) throw new Error('Undo button not found')
    await undoBtn.click()

    const inputVal = await page.$eval('input[aria-label="Expression editor"]', (el) => el.value)
    if (inputVal !== '9*') {
      throw new Error(`Expected expression after undo to be "9*", got "${inputVal}"`)
    }

    const redoBtn = await page.$('button[title*="Redo"]')
    if (!redoBtn) throw new Error('Redo button not found')
    await redoBtn.click()

    const redoneVal = await page.$eval('input[aria-label="Expression editor"]', (el) => el.value)
    if (redoneVal !== '9*9') {
      throw new Error(`Expected expression after redo to be "9*9", got "${redoneVal}"`)
    }
  })

  await test('Physical Mode Selector opens, switches to Equations mode, and returns', async () => {
    const modeBtn = await page.$('button[title*="Mode Selector"]')
    if (!modeBtn) throw new Error('Mode selector button not found in header')
    await modeBtn.click()

    await page.waitForSelector('div[role="dialog"][aria-label="Calculator Mode Selector"]')
    const eqOption = await page.$('button:has-text("Equations")')
    if (!eqOption) throw new Error('Equations option not found in mode dialog')
    await eqOption.click()

    await page.waitForSelector('div[role="region"][aria-label="Equation Solver"]')

    // Verify equation solver view is active
    const eqHeader = await page.textContent('div[role="region"][aria-label="Equation Solver"]')
    if (!eqHeader.includes('Equation Solver') || !eqHeader.includes('Quadratic')) {
      throw new Error('Equation solver view contents not rendered properly')
    }

    // Return to main calculator
    const backBtn = await page.$('button[aria-label="Return to Calculate mode"]')
    if (!backBtn) throw new Error('Back to Calculator button not found')
    await backBtn.click()

    await page.waitForSelector('section[aria-label="Calculator display"]')
  })

  await test('Engineering Toolkit mode opens, calculates Ohm Law, and returns', async () => {
    const engBtn = await page.$('button[aria-label="Engineering Toolkit"]')
    if (!engBtn) throw new Error('Engineering Toolkit button not found in header')
    await engBtn.click()

    await page.waitForSelector('div[role="region"][aria-label="Engineering Toolkit"]')
    const engContent = await page.textContent('div[role="region"][aria-label="Engineering Toolkit"]')
    if (!engContent.includes("Ohm's Law") || !engContent.includes('Current & Power')) {
      throw new Error('Ohm law calculator missing from Engineering Toolkit')
    }

    const backBtn = await page.$('button[aria-label="Return to Calculate mode"]')
    if (!backBtn) throw new Error('Back to Calculator button not found')
    await backBtn.click()

    await page.waitForSelector('section[aria-label="Calculator display"]')
  })

  await test('2D Function Grapher opens, loads multi-function presets, and closes', async () => {
    const graphBtn = await page.$('button[aria-label="2D Function Grapher"]')
    if (!graphBtn) throw new Error('Graph button not found')
    await graphBtn.click()

    await page.waitForSelector('div[role="dialog"][aria-label="2D Function Grapher"]')

    const presetBtn = await page.$('button:has-text("sin & cos")')
    if (!presetBtn) throw new Error('Multi-function preset "sin & cos" not found')
    await presetBtn.click()

    const f1Val = await page.$eval('input[aria-label="Formula for f1(x)"]', (el) => el.value)
    const f2Val = await page.$eval('input[aria-label="Formula for f2(x)"]', (el) => el.value)

    if (f1Val !== 'sin(x)' || f2Val !== 'cos(x)') {
      throw new Error(`Unexpected formula inputs: f1=${f1Val}, f2=${f2Val}`)
    }

    const canvas = await page.$('canvas')
    if (!canvas) throw new Error('Canvas element missing in Grapher')

    const closeBtn = await page.$('button[aria-label="Close grapher"]')
    if (!closeBtn) throw new Error('Close button not found')
    await closeBtn.click()

    await page.waitForSelector('div[role="dialog"][aria-label="2D Function Grapher"]', { state: 'detached' })
  })

  await test('Scientific Constants modal opens and displays constants catalog', async () => {
    const constantsBtn = await page.$('button[aria-label="Scientific constants catalog"]')
    if (!constantsBtn) throw new Error('Constants button not found')
    await constantsBtn.click()

    await page.waitForSelector('div[role="dialog"][aria-label="Scientific Constants"]')
    const modalText = await page.textContent('div[role="dialog"]')
    if (!modalText.includes('Speed of Light') || !modalText.includes('Planck Constant')) {
      throw new Error('Key constants not found in modal')
    }

    const closeBtn = await page.$('button[aria-label="Close constants"]')
    if (closeBtn) await closeBtn.click()
    await page.waitForSelector('div[role="dialog"][aria-label="Scientific Constants"]', { state: 'detached' })
  })

  await test('Unit Converter modal includes pressure, energy, and force categories', async () => {
    const converterBtn = await page.$('button[aria-label="Unit converter"]')
    if (!converterBtn) throw new Error('Converter button not found')
    await converterBtn.click()

    await page.waitForSelector('div[role="dialog"][aria-label="Unit Converter"]')
    const modalText = await page.textContent('div[role="dialog"]')
    if (!modalText.includes('pressure') || !modalText.includes('energy') || !modalText.includes('force')) {
      throw new Error('Extended engineering categories missing in Unit Converter')
    }

    const closeBtn = await page.$('button[aria-label="Close converter"]')
    if (closeBtn) await closeBtn.click()
    await page.waitForSelector('div[role="dialog"][aria-label="Unit Converter"]', { state: 'detached' })
  })

  await test('Mobile viewport (375x667) has no horizontal scroll or layout break', async () => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(100)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

    if (scrollWidth > clientWidth) {
      throw new Error(`Horizontal overflow detected: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`)
    }
  })

  console.log(`\nE2E Summary: ${passedTests} passed, ${failedTests} failed`)

  await browser.close()
  await previewServer.close()

  if (failedTests > 0) {
    process.exit(1)
  }
}

runE2E().catch((err) => {
  console.error('Fatal E2E error:', err)
  process.exit(1)
})
