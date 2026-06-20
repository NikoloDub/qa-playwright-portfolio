import { expect, test } from '../fixtures/base.fixture';

test.describe('Security & routing', () => {
  test('redirects unauthenticated user from cart to login', async ({
    page,
    loginPage,
  }) => {
    await page.goto('/cart');

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.page.getByTestId('login-page')).toBeVisible();
  });

  test('shows 404 page for unknown route', async ({ page }) => {
    await page.goto('/unknown-page');

    await expect(page.getByTestId('not-found-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });
});
