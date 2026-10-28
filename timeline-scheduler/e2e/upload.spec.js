const { test, expect } = require('@playwright/test');

test('upload file and capture screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const input = page.locator('input[type="file"]');
  await input.setInputFiles('/tmp/file_attachments/Documents/Khoi nghiep 2026 rev6.xlsx');

  await page.locator('text=Upload and Process').click();

  // Wait until the table is rendered, increasing timeout
  await page.waitForTimeout(5000);

  // Wait for network idle to ensure the data is loaded
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: 'screenshot2.png', fullPage: true });
});
