# 6. Page Factory-Style Patterns vs Plain POM in a Playwright Context

## Where "Page Factory" comes from

"Page Factory" is a pattern from the **Selenium** world (`PageFactory.initElements()`
in Java, `@FindBy` annotations). It exists to solve a specific Selenium
problem: a Selenium `WebElement` is resolved **immediately and once** —
the moment you call `driver.findElement(...)`, Selenium grabs a live
reference to whatever matches right then. If the page later re-renders
that element (a very common thing in modern JS apps), your `WebElement`
reference goes **stale**, and using it throws
`StaleElementReferenceException`. Page Factory's `@FindBy` fields delay
that lookup slightly and offer `initElements()` to (re)bind everything at
a convenient point — a workaround for eager resolution, not a fix for it.

```java
// Selenium + Page Factory (Java) — for comparison only, not used in this repo
public class LoginPage {
    @FindBy(id = "user-name")
    WebElement usernameInput;   // NOT resolved yet — just a "promise" of a lookup

    public LoginPage(WebDriver driver) {
        PageFactory.initElements(driver, this); // wires up all @FindBy fields
    }
}
```

## Why Playwright doesn't need it

A Playwright `Locator` (what every page object in this folder uses) is
**lazy and re-resolving by design** — it's a small, cheap query
description, not a captured reference to a specific DOM node:

```ts
readonly usernameInput: Locator = this.page.locator('#user-name');
```

Creating that `Locator` performs **no DOM lookup at all**. The actual
lookup happens fresh, every single time, right when you call
`.click()`, `.fill()`, or an `expect(...)` on it — and Playwright's
auto-waiting (see `tests/05-Assertions & Validations/03-auto-retrying-assertions.spec.ts`)
retries that lookup until the element is ready. There's no
"stale element" failure mode to work around, so there's nothing for a
Page Factory-equivalent to fix.

This is exactly why every page object in this folder (`LoginPage`,
`InventoryPage`, ...) can safely declare its locators as plain `readonly`
class fields, assigned directly in the field initializer:

```ts
export class LoginPage extends BasePage {
  readonly usernameInput: Locator = this.page.locator('#user-name');
  readonly passwordInput: Locator = this.page.locator('#password');
  // no factory call, no re-initialization step needed
}
```

## Side-by-side

| | Selenium + Page Factory | Plain POM in Playwright |
|---|---|---|
| When is the element looked up? | Once, eagerly, at `initElements()` (or first use, depending on proxy setup) | Every action/assertion, automatically |
| Stale element risk | Yes — a real, common failure mode | No — a `Locator` re-queries every time |
| Extra wiring needed | `PageFactory.initElements(driver, this)` in every constructor | None — just assign `page.locator(...)` to a field |
| Retries on "not ready yet" | Not built in | Built in (auto-waiting) |

## The practical takeaway

**Plain POM — a class with typed `Locator` fields and methods, exactly
like every page object in this folder — is the idiomatic, complete answer
in Playwright.** You may see "Page Factory" mentioned in older
Selenium-to-Playwright migration guides; treat it as a pattern you're
migrating *away from*, not one to reintroduce. If you're coming from
Selenium, the mental adjustment is: stop thinking of a locator as "a
handle to an element I found," and start thinking of it as "a saved
search I can re-run any time."

## Discussion questions

1. What specific Selenium failure mode does Page Factory exist to reduce?
2. Why doesn't that failure mode apply to a Playwright `Locator`?
3. Look at `pages/InventoryPage.ts` in this folder — which line proves its
   locators aren't eagerly resolved at construction time?
