import { test, expect } from '@playwright/test';


test('Fill a form inside an iframe', async ({ page }) => {

  // Open the page
  await page.goto('https://practice.expandtesting.com/iframe');

  // Locate the iframe
  const iframe = page.frameLocator('#email-subscribe');

  // Fill email inside the iframe
  await iframe.locator('#email').fill('learner@example.com');

  // Click Subscribe
  await iframe.locator('#btn-subscribe').click();

  // Verify success message
  await expect(
    iframe.locator('#success-message')
  ).toHaveText('You are now subscribed!');
});


test('Handle nested iframes', async ({ page }) => {

  // Open the page
  await page.goto('https://the-internet.herokuapp.com/nested_frames');

  // Find the outer frame
  const topFrame = page.frameLocator('frame[name="frame-top"]');

  // Find frames inside the outer frame
  const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
  const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');

  // Verify content inside the nested frames
  await expect(
    leftFrame.locator('body')
  ).toHaveText('LEFT');

  await expect(
    middleFrame.locator('body')
  ).toHaveText('MIDDLE');
});