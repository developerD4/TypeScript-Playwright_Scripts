# 5. Parallelism & Workers Configuration

## 1. Parallel Execution

Normally, tests run **one after another**, which can be slow for a large test suite.

Playwright can run independent tests **at the same time using workers**, making execution faster.

```text
Without parallel:
Test 1 → Test 2 → Test 3 → Test 4

With parallel:
Worker 1 → Test 1
Worker 2 → Test 2
Worker 3 → Test 3
Worker 4 → Test 4
```

---

## 2. `workers`

`workers` defines **how many tests can run at the same time**.

```typescript
workers: 4
```

Means Playwright can use up to **4 workers**.

**Remember:** Workers = number of parallel test workers.

---

## 3. `fullyParallel`

```typescript
fullyParallel: true
```

Allows independent tests **within the same file** to run in parallel.

Tests should be independent and should not depend on another test's result or data.

---

## 4. `retries`

```typescript
retries: 2
```

Tells Playwright to **retry a failed test up to 2 times**.

```text
Test → ❌ Failed
Retry 1 → ❌ Failed
Retry 2 → ✅ Passed
```

Useful for occasional failures caused by temporary network, application, or environment issues.

**Do not use retries to hide a test that always fails.**

---

## 5. CI — Continuous Integration

**CI = Continuous Integration**

CI automatically builds and tests code when developers push code or create a pull request.

Examples: GitHub Actions, Jenkins, GitLab CI, Azure DevOps.

### CI-specific configuration

```typescript
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

**Retries:** CI → retry 2 times; Local → no retry.

**Workers:** CI → use 1 worker; Local → Playwright chooses automatically.

Fewer workers on CI can reduce resource usage and make execution more stable.

---

## 6. Simple Configuration

```typescript
export default defineConfig({
  fullyParallel: true,
  workers: 4,
  retries: 2,
});
```

---

## 7. Notes — 3 Lines

**Workers:** How many tests run at the same time.
**`fullyParallel`:** Allows independent tests in the same file to run together.
**`retries`:** Runs a failed test again.

---

## 8. Test Scenarios — 3 Lines

**Scenario 1:** Run a large regression suite faster using multiple workers.
**Scenario 2:** Run independent tests in the same file in parallel.
**Scenario 3:** Retry tests that occasionally fail because of temporary issues.

---

## 9. Use Cases — 3 Lines

**Use Case 1:** Faster execution of hundreds of regression tests.
**Use Case 2:** Run independent login, search, and product tests simultaneously.
**Use Case 3:** Keep CI test execution stable using limited workers and retries.

**Important:** Parallel tests should be **independent**.
