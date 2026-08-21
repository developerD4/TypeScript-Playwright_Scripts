// 02-iframes.spec.ts
//
// TOPIC: Locating and interacting with elements inside iframes
//
// Sites used:
//   https://practice.expandtesting.com/iframe — has a real, simple HTML
//     form inside an <iframe> (an email subscribe box), good for a first
//     "fill something inside an iframe" exercise. (see sites.txt notes)
//   https://the-internet.herokuapp.com/nested_frames — a frame INSIDE
//     another frame, good for practicing chained frameLocator() calls.
//
// Note: this same page also embeds a TinyMCE rich-text editor in an
// iframe. That demo editor is loaded from a third-party CDN with a
// shared/free API key, so it is sometimes served in a disabled/read-only
// state outside of anyone's control — not something you can fix with a
// better locator. We skip typing into it here and stick to targets that
// are reliably interactive so this file passes consistently.

import { test, expect } from '@playwright/test';

test('filling a form inside a single iframe', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/iframe');

  // page.frameLocator(selector) returns a FrameLocator: it behaves like
  // page/locator but scopes everything to inside that one iframe.
  const emailFrame = page.frameLocator('#email-subscribe');

  await emailFrame.locator('#email').fill('learner@example.com');
  await emailFrame.locator('#btn-subscribe').click();

  await expect(emailFrame.locator('#success-message')).toHaveText('You are now subscribed!');
});

test('interacting with a frame nested inside another frame', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/nested_frames');

  // Chain frameLocator() calls for frames nested inside other frames.
  // (This page uses the older <frame>/<frameset> tags rather than
  // <iframe>, but frameLocator() works the same way for both — the
  // point is that each frame is its own nested browsing context.)
  const topFrame = page.frameLocator('frame[name="frame-top"]');
  const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
  const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');

  await expect(leftFrame.locator('body')).toHaveText('LEFT');
  await expect(middleFrame.locator('body')).toHaveText('MIDDLE');
});
