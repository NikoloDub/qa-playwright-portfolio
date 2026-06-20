import { expect, test } from '../fixtures/base.fixture';

test.describe('Authentication', () => {
  test('successful login with valid credentials', async ({
    page,
    loginPage,
    catalogPage,
  }) => {
    await loginPage.goto();
    await loginPage.login('demo', 'demo123');

    await expect(page).toHaveURL(/\/catalog$/);
    await catalogPage.expectLoaded();
    await expect(page.getByTestId('header-display-name')).toHaveText(
      'Demo User',
    );
  });

  test('shows error message on invalid password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('demo', 'wrong-password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Invalid username or password',
    );
    await expect(loginPage.page).toHaveURL(/\/login$/);
  });

  test('logout redirects to login and blocks protected routes', async ({
    page,
    authenticatedUser,
    layoutPage,
  }) => {
    void authenticatedUser;

    await expect(page).toHaveURL(/\/catalog$/);
    await layoutPage.logoutButton.click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-page')).toBeVisible();

    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-page')).toBeVisible();
  });
});
