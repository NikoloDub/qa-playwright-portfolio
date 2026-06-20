import { fileURLToPath } from 'url';
import { test } from '../fixtures/base.fixture';
import { assertVisualSnapshot } from '../helpers/visual-hash';

const specPath = fileURLToPath(import.meta.url);

test.describe('Visual regression', () => {
  test('login page matches snapshot', async ({ page, loginPage }) => {
    await loginPage.goto();
    await assertVisualSnapshot(page, specPath, 'login-page', {
      fullPage: true,
    });
  });

  test('catalog page matches snapshot', async ({
    page,
    authenticatedUser,
    catalogPage,
  }) => {
    void authenticatedUser;

    await catalogPage.expectLoaded();
    await assertVisualSnapshot(page, specPath, 'catalog-page', {
      fullPage: true,
    });
  });
});
