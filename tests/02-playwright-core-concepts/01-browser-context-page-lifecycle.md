# Browser → BrowserContext → Page: Lifecycle

## How it works

When you run `npx playwright test`:

* **Browser** → Usually launched **once per worker** and reused by its tests.
* **BrowserContext** → A **new context is created for each test** and destroyed after the test.
* **Page** → Created inside the context; Playwright's `page` fixture provides it automatically.

Worker
└── Browser (reused)
    ├── Context → Test A → destroyed
    │   └── Page
    ├── Context → Test B → destroyed
    │   └── Page
    └── ...

## Easy analogy

* 🏨 **Browser** = Hotel building
* 🚪 **BrowserContext** = Fresh hotel room for each test
* 👤 **Page** = Guest using the room
A new context prevents **cookies, localStorage, and login sessions** from leaking between tests.
## Important
Avoid manually creating extra contexts unless you need them:
```typescript
const context = await browser.newContext();
```

Normally, use Playwright's built-in `page` fixture:

```typescript
test('example', async ({ page }) => {
    // page already belongs to a fresh context
});
```

## Quick Questions

1. Why is reusing the Browser faster than launching one for every test?
2. If you call `browser.newContext()` inside a test, what happens to the number of contexts?
