import { expect, test } from '../fixtures/base.fixture';

test.describe('Cart', () => {
  test('increments cart badge when product is added', async ({
    authenticatedUser,
    catalogPage,
    layoutPage,
  }) => {
    void authenticatedUser;

    await catalogPage.expectLoaded();
    await expect(layoutPage.cartBadge).toHaveText('0');

    await catalogPage.addProductToCart('2');

    await expect(layoutPage.cartBadge).toHaveText('1');
  });

  test('removes product and shows empty cart', async ({
    authenticatedUser,
    catalogPage,
    cartPage,
    layoutPage,
  }) => {
    void authenticatedUser;

    await catalogPage.expectLoaded();
    await catalogPage.addProductToCart('2');
    await expect(layoutPage.cartBadge).toHaveText('1');

    await cartPage.goto();
    await expect(cartPage.cartList).toBeVisible();

    await cartPage.removeProduct('2');

    await cartPage.expectEmpty();
    await expect(layoutPage.cartBadge).toHaveText('0');
  });
});
