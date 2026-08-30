# Screenshot, Video and Trace Configuration
### Screenshot
* `screenshot: 'off'` → Do not take screenshots.
* `screenshot: 'on'` → Take a screenshot for every test.
* `screenshot: 'only-on-failure'` → Take a screenshot only when a test fails.

### Video
* `video: 'off'` → Do not record videos.
* `video: 'on'` → Record video for every test.
* `video: 'on-first-retry'` → Record video when a failed test is retried for the first time.
* `video: 'retain-on-failure'` → Record video and keep it only when the test fails.

### Trace
* `trace: 'off'` → Do not record traces.
* `trace: 'on'` → Record a trace for every test.
* `trace: 'on-first-retry'` → Record a trace when a failed test is retried for the first time.
* `trace: 'retain-on-failure'` → Record a trace and keep it only when the test fails.

### Where to Configure
File: **`playwright.config.ts`**
typescript code:
use: {
  screenshot: 'only-on-failure',
  video: 'on-first-retry',
  trace: 'on-first-retry',
},

### Where Are the Files Stored?
After the test runs, screenshots, videos, and traces are stored inside the **`test-results`** folder.
test-results/
    └── test-name/
        ├── screenshot.png
        ├── video.webm
        └── trace.zip

### How to Open a Trace

Run: npx playwright show-trace path/to/trace.zip

Example:
npx playwright show-trace test-results/example-test/trace.zip

### Recommended Beginner Configuration
use: {
  screenshot: 'only-on-failure',
  video: 'on-first-retry',
  trace: 'on-first-retry',
},
**Simple idea:** Screenshot gives a **picture**, video gives a **recording**, and trace gives **detailed information for debugging**.
