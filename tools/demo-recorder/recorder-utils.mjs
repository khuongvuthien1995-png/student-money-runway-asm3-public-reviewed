/**
 * @file tools/demo-recorder/recorder-utils.mjs
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase Automated Product Demo Recorder
 * @createdAt 2026-09-17T01:34:47+10:00
 * @updatedAt 2026-09-17T01:51:25+10:00
 * @summary Shares real-UI flow helpers, assertion helpers, and isolated Vite lifecycle handling.
 * @responsibility Starts or detects the app server and drives verifiable browser interactions without application-state bypasses.
 */

/* global fetch, process, setTimeout */

import { spawn } from 'node:child_process'
import { access, mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const thisDirectory = path.dirname(fileURLToPath(import.meta.url))

export const repositoryRoot = path.resolve(thisDirectory, '..', '..')
export const evidenceRoot = process.env.DEMO_EVIDENCE_ROOT ?? 'C:/Dev/BUS4012/student-money-runway-evidence'
export const videoPaths = {
  raw: path.join(evidenceRoot, 'video', 'raw'),
  converted: path.join(evidenceRoot, 'video', 'converted'),
  final: path.join(evidenceRoot, 'video', 'final'),
  metadata: path.join(evidenceRoot, 'video', 'metadata'),
}
export const defaultBaseUrl = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:5173'

export const demoData = {
  email: 'student@example.com',
  password: 'demo1234',
  availableFunds: '950',
  planningDate: '2026-09-27',
  safetyBuffer: '100',
  fixedEssentials: '455',
  flexibleEssentials: '180',
  purchaseName: 'Monthly public transport pass',
  purchaseAmount: '160',
  exceedsAmount: '300',
}

export async function pauseForViewer(page, milliseconds) {
  await page.waitForTimeout(milliseconds)
}

export async function ensureEvidenceDirectories() {
  await Promise.all(Object.values(videoPaths).map((directory) => mkdir(directory, { recursive: true })))
}

async function isReachable(url) {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

async function waitForServer(url, timeoutMilliseconds = 30_000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMilliseconds) {
    if (await isReachable(url)) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Vite did not become ready at ${url} within ${timeoutMilliseconds}ms.`)
}

function stopWindowsProcessTree(processId) {
  return new Promise((resolve) => {
    const taskkill = spawn('taskkill', ['/pid', String(processId), '/T', '/F'], { windowsHide: true })
    taskkill.once('close', resolve)
    taskkill.once('error', resolve)
  })
}

export async function startOrReuseVite() {
  if (await isReachable(defaultBaseUrl)) {
    return { baseUrl: defaultBaseUrl, startedByRecorder: false, stop: async () => {} }
  }

  const viteProcess = process.platform === 'win32'
    ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm run dev -- --host 127.0.0.1'], {
      cwd: repositoryRoot,
      stdio: 'ignore',
      windowsHide: true,
    })
    : spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1'], {
    cwd: repositoryRoot,
    stdio: 'ignore',
    windowsHide: true,
    })

  try {
    await waitForServer(defaultBaseUrl)
  } catch (error) {
    await stopWindowsProcessTree(viteProcess.pid)
    throw error
  }

  return {
    baseUrl: defaultBaseUrl,
    startedByRecorder: true,
    stop: async () => stopWindowsProcessTree(viteProcess.pid),
  }
}

export async function assertVisible(locator, description) {
  try {
    await locator.waitFor({ state: 'visible', timeout: 10_000 })
  } catch (error) {
    throw new Error(`Expected visible evidence was not found: ${description}. ${error.message}`, { cause: error })
  }
}

export async function assertText(page, text) {
  await assertVisible(page.getByText(text, { exact: false }).first(), `text ${JSON.stringify(text)}`)
}

export async function assertNoButton(page, name) {
  const count = await page.getByRole('button', { name, exact: true }).count()
  if (count !== 0) {
    throw new Error(`Expected no ${JSON.stringify(name)} button, but found ${count}.`)
  }
}

export async function showLoginValidation(page, pause = 0) {
  await page.goto('/login', { waitUntil: 'networkidle' })
  await assertVisible(page.getByRole('heading', { name: 'Plan what is available', exact: true }), 'Login heading')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await assertText(page, 'Enter your email.')
  await assertText(page, 'Enter your password.')
  if (pause) await pauseForViewer(page, pause)

  await page.getByLabel('Email', { exact: true }).fill('abc')
  await page.getByLabel('Password', { exact: true }).fill(demoData.password)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await assertText(page, 'Enter a valid email address.')
  if (pause) await pauseForViewer(page, pause)
}

export async function login(page, pause = 0) {
  await page.getByLabel('Email', { exact: true }).fill(demoData.email)
  await page.getByLabel('Password', { exact: true }).fill(demoData.password)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.waitForURL('**/setup')
  await assertVisible(page.getByRole('heading', { name: 'Set up your runway', exact: true }), 'Runway Setup heading')
  if (pause) await pauseForViewer(page, pause)
}

export async function completeSetup(page, pause = 0) {
  await page.getByLabel('Money available for this runway', { exact: false }).fill(demoData.availableFunds)
  await page.getByLabel('Planning date', { exact: true }).fill(demoData.planningDate)
  await page.getByLabel('Emergency reserve', { exact: false }).fill(demoData.safetyBuffer)
  if (pause) await pauseForViewer(page, pause)
  await page.getByRole('button', { name: 'Continue to essentials', exact: true }).click()
  await page.waitForURL('**/essentials')
  await assertVisible(page.getByRole('heading', { name: 'Protect essentials', exact: true }), 'Protect Essentials heading')
}

export async function completeEssentials(page, pause = 0) {
  await page.getByLabel('Fixed essentials', { exact: false }).fill(demoData.fixedEssentials)
  await page.getByLabel('Flexible essentials', { exact: false }).fill(demoData.flexibleEssentials)
  await assertText(page, 'AUD 735')
  if (pause) await pauseForViewer(page, pause)
  await page.getByRole('button', { name: 'Calculate my runway', exact: true }).click()
  await page.waitForURL('**/runway')
  await assertVisible(page.getByRole('heading', { name: 'Your discretionary runway', exact: true }), 'Runway Result heading')
  await assertText(page, 'AUD 735')
  await assertText(page, 'AUD 215')
}

export async function startPurchaseCheck(page) {
  await page.getByRole('button', { name: 'Check a purchase', exact: true }).click()
  await page.waitForURL('**/purchase')
  await assertVisible(page.getByRole('heading', { name: 'Check a purchase', exact: true }), 'Purchase Check heading')
  await assertText(page, 'AUD 215')
}

export async function previewPurchase(page, amount = demoData.purchaseAmount) {
  await page.getByLabel('Purchase name', { exact: true }).fill(demoData.purchaseName)
  await page.getByLabel('Purchase amount', { exact: false }).fill(amount)
  await page.getByRole('button', { name: 'Preview impact', exact: true }).click()
  await page.waitForURL('**/result')
  await assertVisible(page.getByRole('heading', { name: 'Purchase impact preview', exact: true }), 'Purchase impact preview heading')
}

export async function returnToPurchase(page) {
  await page.getByRole('button', { name: 'Back without saving', exact: true }).click()
  await page.waitForURL('**/purchase')
  await assertText(page, 'AUD 215')
}

export async function editExceedingPurchase(page) {
  await page.getByRole('button', { name: 'Edit purchase', exact: true }).click()
  await page.waitForURL('**/purchase')
}

export async function confirmPurchase(page) {
  await page.getByRole('button', { name: 'Mark as spent', exact: true }).click()
  await assertVisible(page.getByRole('heading', { name: 'Purchase recorded', exact: true }), 'Purchase recorded heading')
  await assertText(page, 'AUD 55')
  await page.getByRole('button', { name: 'View updated runway', exact: true }).click()
  await page.waitForURL('**/runway')
  await assertText(page, 'AUD 790')
  await assertText(page, 'AUD 55')
}

export async function moveVideoTo(video, destination) {
  const recordedPath = await video.path()
  await access(recordedPath)
  await rename(recordedPath, destination)
  await access(destination)
  return destination
}

export async function writeJson(destination, data) {
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}
