// 01-click-dblclick-hover-check-actions.spec.ts
//
// TOPIC: click, dblClick, hover, check/uncheck
//
// Sites used:
//   - https://demo.playwright.dev/todomvc  (see sites.txt #1) — click & dblClick
//   - https://the-internet.herokuapp.com/hovers  (see sites.txt #2) — hover
//   - https://the-internet.herokuapp.com/checkboxes  (see sites.txt #2) — check/uncheck
//
// All Playwright actions auto-wait for the element to be visible, stable and
// enabled before acting, so you rarely need manual waits around them.

import { test, expect } from '@playwright/test';

test.describe('click and dblClick', () => {
  test('click adds a todo, dblClick opens it for editing', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const newTodoInput = page.getByPlaceholder('What needs to be done?');
    await newTodoInput.fill('Buy milk');
    await newTodoInput.press('Enter'); // submits the new todo

    const todoItem = page.getByText('Buy milk');
    await expect(todoItem).toBeVisible();

    // A single click on the round checkbox marks the todo as done.
    const checkbox = page.locator('li', { hasText: 'Buy milk' }).getByRole('checkbox');
    await checkbox.click();
    await expect(page.locator('li', { hasText: 'Buy milk' })).toHaveClass(/completed/);

    // dblClick switches the todo item into "edit" mode, revealing a text input.
    await todoItem.dblclick();
    const editInput = page.locator('li.editing .edit');
    await expect(editInput).toBeVisible();
    await expect(editInput).toHaveValue('Buy milk');
  });
});

test.describe('hover', () => {
  test('hovering over a user avatar reveals a hidden profile link', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');

    const firstFigure = page.locator('.figure').first();
    const profileLink = firstFigure.getByRole('link', { name: 'View profile' });

    // The link exists in the DOM but is only visible once you hover the
    // figure (it's revealed by CSS). Before hovering, it's hidden.
    await expect(profileLink).not.toBeVisible();

    await firstFigure.hover();
    await expect(profileLink).toBeVisible();
    await expect(firstFigure.locator('h5')).toHaveText('name: user1');
  });
});

test.describe('check / uncheck', () => {
  test('check() and uncheck() toggle checkboxes idempotently', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');

    const checkbox1 = page.locator('#checkboxes input').nth(0); // starts unchecked
    const checkbox2 = page.locator('#checkboxes input').nth(1); // starts checked

    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();

    // check()/uncheck() are safer than click() here: they check the current
    // state first and only click if a change is actually needed, so running
    // the same call twice in a row won't accidentally flip it back.
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
    await checkbox1.check(); // no-op, already checked — does not toggle it off
    await expect(checkbox1).toBeChecked();

    await checkbox2.uncheck();
    await expect(checkbox2).not.toBeChecked();
  });
});
