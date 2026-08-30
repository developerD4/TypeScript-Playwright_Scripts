# Playwright Architecture - Playwright is a tool that allows our test code to control web browsers automatically.

                    Your Test Code
                          │
                          ▼
                   Playwright Test
                          │
                          ▼
                    Playwright API
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
          Chromium      Firefox      WebKit
              │           │           │
              └───────────┼───────────┘
                          ▼
                       Browser
                          │
                          ▼
                   BrowserContext
                          │
                          ▼
                        Page
                          │
                          ▼
                  Web Application
