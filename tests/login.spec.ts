import { test } from '../src/fixtures/test';
import { users } from '../src/data/users';

// Login tests must start logged out, so they skip the saved session
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user logs in successfully', {
    tag: ['@smoke', '@regression'],
    annotation: { type: 'TC', description: 'TC-4001' },
  }, async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectDisplayed();
  });

  const invalidLogins = [
    { case: 'locked out user', username: users.locked.username, password: users.locked.password,
      error: 'Sorry, this user has been locked out' },
    { case: 'wrong password', username: users.standard.username, password: 'wrong_password',
      error: 'Username and password do not match' },
    { case: 'empty username', username: '', password: users.standard.password,
      error: 'Username is required' },
    { case: 'empty password', username: users.standard.username, password: '',
      error: 'Password is required' },
  ];

  for (const data of invalidLogins) {
    test(`login fails with ${data.case}`, {
      tag: ['@negative', '@regression'],
      annotation: { type: 'TC', description: 'TC-4002' },
    }, async ({ loginPage, page }) => {
      await loginPage.login(data.username, data.password);
      await loginPage.expectError(data.error);
      await test.expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('logged-in user logs out', {
    tag: ['@smoke', '@regression'],
    annotation: { type: 'TC', description: 'TC-4003' },
  }, async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.header.logout();
    await loginPage.expectDisplayed();
  });

  test('inner pages are not reachable after logout', {
    tag: ['@security', '@regression'],
    annotation: { type: 'TC', description: 'TC-4004' },
  }, async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.header.logout();
    await inventoryPage.open();
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in");
  });
});
