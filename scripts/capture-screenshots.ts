import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Routes to capture – order defines filename prefix.
const routes: string[] = [
  '/',
  '/admin',
  '/about',
  '/map',
  '/location',
  '/google',
  '/stats',
  '/feedback',
];

// Helper: wait for URL to respond (simple poll).
async function waitForServer(url: string, timeoutMs = 15000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const resp = await fetch(url, { method: 'HEAD' });
      if (resp.ok) return;
    } catch (_) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server did not become reachable at ${url} within ${timeoutMs}ms`);
}

async function run() {
  // Ensure screenshots folder exists
  const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  // Start Vite dev server as a background process
  const dev = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  }) as ChildProcessWithoutNullStreams;

  // Wait for server to be up
  const baseUrl = 'http://localhost:3000';
  try {
    await waitForServer(baseUrl);
  } catch (e) {
    dev.kill();
    console.error(e);
    process.exit(1);
  }

  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const url = `${baseUrl}${route}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    const filename = `${String(i + 1).padStart(2, '0')}-${route.replace(/^\//, '') || 'home'}.png`;
    const outPath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved screenshot: ${outPath}`);
  }

  await browser.close();
  // Terminate dev server
  dev.kill();
}

run().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
