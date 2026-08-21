# 1. Designing a Scalable Automation Framework Folder/Module Structure

## What's going on

Every other topic folder in this repo (`tests/01-...` through `tests/05-...`)
puts Playwright API examples directly inside spec files, because the point
there is the API itself. This folder is different: it's about how to
structure the *reusable* pieces of a framework — utilities, config, logging,
retries, test data, fixtures — so a growing test suite doesn't turn into
hundreds of copy-pasted `page.goto()` blocks with no shared code.

This repo now has a `framework/` directory at the **project root**, as a
sibling of `tests/`, not nested inside it:

```
Training-TestAutomation/
├── framework/                    ← reusable framework code, imported BY tests
│   ├── config/
│   │   └── env.ts                ← loads .env.<TEST_ENV>, exports typed `config`
│   ├── core/
│   │   └── safeActions.ts        ← retry/error-handling wrapper around Playwright actions
│   ├── factories/
│   │   └── userFactory.ts        ← test data builder/factory pattern
│   ├── fixtures/
│   │   └── base-fixtures.ts      ← test.extend() — shared fixtures for all specs
│   ├── logger/
│   │   └── logger.ts             ← custom leveled/timestamped logger
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── randomDataGenerator.ts
│   │   └── stringHelpers.ts
│   ├── global-setup.ts           ← wired into playwright.config.ts
│   └── global-teardown.ts        ← wired into playwright.config.ts
├── tests/                        ← spec files ONLY import from framework/, never the reverse
│   └── 06-Framework Development & Reusable Utilities/
│       └── ...this folder's demo specs...
├── .env.dev / .env.qa / .env.staging
├── playwright.config.ts
└── tsconfig.json
```

## Why this shape

- **`framework/` is a one-way dependency of `tests/`.** Spec files import
  from `framework/`; nothing in `framework/` imports from `tests/`. This
  keeps reusable code reusable — it never accidentally depends on
  something specific to one test.
- **Grouped by responsibility, not by feature.** `utils/`, `config/`,
  `logger/`, `core/`, `factories/`, `fixtures/` each hold one *kind* of
  thing. When the framework grows, you know exactly where a new date helper
  or a new fixture belongs.
- **`fixtures/base-fixtures.ts` is the single integration point.** Rather
  than every spec file importing `Logger`, `SafeActions`, `config`, etc.
  separately, most specs only need to import `test`/`expect` from
  `base-fixtures.ts` and destructure what they need — see file 09 in this
  folder.
- **Flat is fine until it isn't.** For a small suite, a single `utils.ts`
  file is perfectly reasonable. This structure is what you grow *into* once
  you have enough helpers that "everything in one file" becomes hard to
  navigate — don't build it out further than your suite currently needs.

## How the other files in this folder map to the structure above

| File in this folder | Framework code it demonstrates |
|---|---|
| `02-date-utils.spec.ts` | `framework/utils/dateUtils.ts` |
| `03-random-data-and-string-helpers.spec.ts` | `framework/utils/randomDataGenerator.ts`, `stringHelpers.ts` |
| `04-env-config-management.spec.ts` | `framework/config/env.ts`, `.env.dev` / `.env.qa` / `.env.staging` |
| `05-custom-logger.spec.ts` | `framework/logger/logger.ts` |
| `06-wrapper-safe-actions.spec.ts` | `framework/core/safeActions.ts` |
| `07-test-data-factory.spec.ts` | `framework/factories/userFactory.ts` |
| `08-global-setup-teardown.spec.ts` | `framework/global-setup.ts`, `framework/global-teardown.ts` |
| `09-extending-base-test-fixtures.spec.ts` | `framework/fixtures/base-fixtures.ts` (ties everything together) |

## Discussion questions

1. Why does `framework/` live at the project root instead of inside `tests/`?
2. What would go wrong if `framework/core/safeActions.ts` imported something
   from a specific spec file in `tests/`?
3. At what point would you split `framework/utils/` into more files, and at
   what point is that split premature?
