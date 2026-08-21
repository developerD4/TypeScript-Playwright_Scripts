# 2. Naming Conventions for Test Files, Methods, and Locator Variables

## Why this matters more than it seems

A test suite is read far more often than it's written — by you in six
months, by a teammate debugging a CI failure at 2am, by whoever inherits
the project. Consistent naming is what makes a huge test suite skimmable
instead of a pile of files you have to open one by one to understand.

## File naming

**Convention used throughout this repo:** `NN-kebab-case-topic.spec.ts`
(and `.md` for conceptual/reference files, no test code inside).

```
03-base-page-common-methods.spec.ts     ✓ number + kebab-case + .spec.ts
04-component-based-pom.spec.ts          ✓
loginTests.ts                           ✗ no .spec suffix — some runners won't find it
LoginPage.spec.ts                       ✗ PascalCase reads like a class file, not a spec
test1.spec.ts                           ✗ tells you nothing about what's inside
```

Rules worth keeping consistent across a real project:
- End test files in `.spec.ts` (or your runner's configured suffix) so
  tooling and humans can both immediately tell "this file runs tests."
- Page objects and components (not test files) drop the `.spec` suffix and
  use `PascalCase` for the file name, matching the class inside —
  `LoginPage.ts`, `HeaderComponent.ts` (see `tests/07-Page Object Model (POM)/pages/`).
- Prefix with a number only when file ORDER genuinely helps a reader learn
  a topic step by step (as in this training repo). In a real product test
  suite, prefer a name that describes the FEATURE
  (`checkout.spec.ts`, `login.spec.ts`) — execution order shouldn't matter
  once independence (see file 01) is done right, so numbering test files
  by "run order" is usually a smell that tests aren't actually independent.

## Test (and `describe`) naming

Write the test name as a **sentence describing the expected behavior**,
not a vague label:

```ts
// ✗ vague — a failure tells you almost nothing
test('login test', async ({ page }) => { ... });
test('test 2', async ({ page }) => { ... });

// ✓ specific — a failure message alone tells you what broke
test('shows an error when the password is wrong', async ({ page }) => { ... });
test('locked-out users see a "locked out" error on login', async ({ page }) => { ... });
```

A useful test: read *only* the reporter output after a run (no source
code in front of you) and you should be able to guess what broke. Compare
"❌ login test" against "❌ shows an error when the password is wrong" —
only one of those is useful at 2am.

`test.describe()` blocks group related tests and name the *feature or
scenario*, not another vague label:

```ts
test.describe('checkout — shipping info step', () => {
  test('rejects submission with an empty postal code', ...);
  test('accepts a valid postal code and advances to the review step', ...);
});
```

## Locator variable naming

Name locator variables after **what the element IS**, with a suffix that
signals its role, so a reader knows how it'll be used without reading the
line below it:

```ts
// ✓ from tests/07-Page Object Model (POM)/pages/LoginPage.ts
readonly usernameInput: Locator = this.page.locator('#user-name');
readonly loginButton: Locator = this.page.locator('#login-button');
readonly errorMessage: Locator = this.page.locator('[data-test="error"]');
```

| Suffix | Use for |
|---|---|
| `Input` / `Field` | text inputs, textareas |
| `Button` / `Link` | clickable elements |
| `Checkbox` / `Radio` | toggle inputs |
| `Dropdown` / `Select` | `<select>` elements |
| `Message` / `Banner` / `Alert` | text feedback shown to the user |
| `Modal` / `Dialog` | overlay containers |
| `List` / `Card` / `Row` | repeating container elements |

```ts
// ✗ tells you nothing about what kind of element this is, or how to use it
const el1 = page.locator('#user-name');
const thing = page.locator('.error-message-container');

// ✗ misleading — this is a <select>, "Button" implies you'd .click() it
const sortButton = page.locator('[data-test="product-sort-container"]');

// ✓ the type suffix matches the actual element and its actual usage
const usernameInput = page.locator('#user-name');
const sortDropdown = page.locator('[data-test="product-sort-container"]');
```

## Method naming on page objects

Name methods after the **user-facing action or the data being retrieved**
— not after the CSS selector or implementation detail behind them:

```ts
// ✓ from tests/07-Page Object Model (POM)/pages/InventoryPage.ts
async addProductToCart(productName: string): Promise<void> { ... }
async getProductNames(): Promise<string[]> { ... }
async sortBy(order: SortOrder): Promise<void> { ... }
```

`get...()` for something that returns data, a plain verb (`login`,
`addProductToCart`, `proceedToCheckout`) for something that performs an
action — that split alone tells a caller whether to `await` it for a
return value or just for completion.

## Discussion questions

1. Why is numbering test FILES by run order (`01-`, `02-`, ...) fine in
   this training repo but a smell in a real product's test suite?
2. Look at `getErrorText()` in `LoginPage.ts` (topic 07) — what would a
   worse name for that method look like, and why would it mislead a caller?
3. What's wrong with naming a locator `submitBtn2` after adding a second
   submit button to a page?
