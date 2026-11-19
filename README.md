# Playwright + TypeScript UI Tests

![Playwright Tests](https://github.com/raykurt/playwright-typescript-ui-tests/actions/workflows/playwright.yml/badge.svg)

UI test automation for the [SauceDemo](https://www.saucedemo.com) shop, built with **Playwright** and **TypeScript**.
It covers login, the product list, the cart and checkout, and runs on Chromium and Firefox in GitHub Actions on every push.

## Highlights

- **Page objects + custom fixtures**: tests ask for the pages they need (`async ({ inventoryPage, cartPage }) => ...`) and Playwright creates them per test
- **Log in once**: a setup project logs in through the UI and saves the session (`storageState`); other tests start already logged in
- **No fixed waits**: web-first assertions and `expect.poll` wait for the real condition
- **`data-test` selectors** via `testIdAttribute`, plus role-based locators
- **Data-driven tests**: invalid login and sorting cases come from data tables
- **Business checks, not only UI checks**: the order total is verified against item prices plus tax
- **Tags and test case IDs**: `@smoke`, `@regression`, `@negative`, `@security`, and a `TC-xxxx` annotation on every test
- **Debuggable failures**: screenshot and video on failure, trace on retry, HTML report uploaded as a CI artifact

## Project structure

```
src/
  components/   HeaderComponent (cart badge, menu, logout)
  pages/        BasePage, LoginPage, InventoryPage, ProductDetailPage, CartPage, CheckoutPage
  fixtures/     test.ts – extends Playwright's test with page object fixtures
  data/         users, products, customer builder
tests/
  auth.setup.ts       logs in once and saves the session
  login.spec.ts       TC-4001 – TC-4004
  inventory.spec.ts   TC-4101 – TC-4104
  checkout.spec.ts    TC-4201 – TC-4204
playwright.config.ts  projects (setup, chromium, firefox), retries, reporters, artifacts
```

## Test cases

| ID | Scenario | Tags |
|---|---|---|
| TC-4001 | Standard user logs in successfully | @smoke |
| TC-4002 | Login fails for locked user, wrong password, empty username, empty password | @negative |
| TC-4003 | Logged-in user logs out | @smoke |
| TC-4004 | Inner pages are not reachable after logout | @security |
| TC-4101 | Products are listed after login | @smoke |
| TC-4102 | Sort by name Z–A, price low–high, price high–low | @regression |
| TC-4103 | Adding and removing products updates the cart badge | @regression |
| TC-4104 | Product detail page shows the same name and price as the list | @regression |
| TC-4201 | Complete an order | @smoke |
| TC-4202 | Checkout requires a first name | @negative |
| TC-4203 | Order total equals item prices plus tax | @regression |
| TC-4204 | Remove a product from the cart | @regression |

## Run locally

```bash
npm install
npx playwright install chromium firefox

npm test                 # all tests, all browsers
npm run test:chromium    # Chromium only
npm run test:smoke       # only @smoke tests
npm run test:headed      # watch the browser
npm run report           # open the last HTML report
```

Use `BASE_URL` to point the tests at another environment:

```bash
BASE_URL=https://staging.example.com npm test
```

## Related projects

- [cypress-cucumber-ui-tests](https://github.com/raykurt/cypress-cucumber-ui-tests) – the same kind of UI coverage with Cypress, Cucumber and TypeScript
- [api-test-automation-framework](https://github.com/raykurt/api-test-automation-framework) – API tests with Java, REST Assured and Cucumber
