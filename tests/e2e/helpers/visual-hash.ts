import { expect, type Page } from '@playwright/test';
import imghash from 'imghash';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

/** Perceptual hash size (bits). 16 — balance of speed and sensitivity. */
const HASH_BITS = 16;

function resolvePlatformDir(): string {
  if (process.platform === 'darwin') {
    return 'darwin';
  }
  if (process.platform === 'win32') {
    return 'win32';
  }
  return 'linux';
}

function snapshotDir(specPath: string): string {
  const specDir = path.dirname(specPath);
  const specBase = path.basename(specPath);
  return path.join(specDir, `${specBase}-snapshots`, resolvePlatformDir());
}

function hashFilePath(specPath: string, snapshotName: string): string {
  return path.join(snapshotDir(specPath), `${snapshotName}.hash`);
}

async function computeHash(screenshot: Buffer): Promise<string> {
  return imghash.hash(screenshot, HASH_BITS);
}

function hashesMatch(actual: string, expected: string): boolean {
  if (actual === expected) {
    return true;
  }
  const actualBin = imghash.hexToBinary(actual);
  const expectedBin = imghash.hexToBinary(expected);
  if (actualBin.length !== expectedBin.length) {
    return false;
  }
  for (let i = 0; i < actualBin.length; i++) {
    if (actualBin[i] !== expectedBin[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Two-phase visual check (inspired by hash-first snapshot pipelines):
 * 1. Compare perceptual hashes — fast path when UI unchanged.
 * 2. On hash mismatch — Playwright pixel diff for actionable report.
 */
export async function assertVisualSnapshot(
  page: Page,
  specPath: string,
  snapshotName: string,
  options: { fullPage?: boolean } = {},
): Promise<void> {
  const pngName = `${snapshotName}.png`;
  const hashPath = hashFilePath(specPath, snapshotName);
  const screenshot = await page.screenshot({
    fullPage: options.fullPage ?? false,
  });
  const actualHash = await computeHash(screenshot);

  if (process.env.UPDATE_VISUAL_HASHES === '1') {
    await writeFile(hashPath, actualHash, 'utf-8');
    await expect(page).toHaveScreenshot(pngName, options);
    return;
  }

  let expectedHash: string;
  try {
    expectedHash = (await readFile(hashPath, 'utf-8')).trim();
  } catch {
    await expect(page).toHaveScreenshot(pngName, options);
    return;
  }

  if (hashesMatch(actualHash, expectedHash)) {
    return;
  }

  await expect(page).toHaveScreenshot(pngName, options);
}
