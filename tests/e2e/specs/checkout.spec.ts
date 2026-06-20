import { expect, test } from '../fixtures/base.fixture';

const validCheckoutForm = {
  fullName: 'Nikolay Dubinin',
  email: 'nikolay@example.com',
  address: 'Stavropol, Test Street 1',
};

async function prepareCartWithItem(catalogPage: {
  expectLoaded: () => Promise<void>;
  addProductToCart: (id: string) => Promise<void>;
}): Promise<void> {
  await catalogPage.expectLoaded();
  await catalogPage.addProductToCart('2');
}

test.describe('Checkout', () => {
  test('places order with valid form', async ({
    authenticatedUser,
    catalogPage,
    checkoutPage,
    layoutPage,
  }) => {
    void authenticatedUser;

    await prepareCartWithItem(catalogPage);
    await checkoutPage.goto();

    await checkoutPage.placeOrder(validCheckoutForm);

    await expect(checkoutPage.successMessage).toBeVisible();
    await expect(checkoutPage.successMessage).toContainText(
      'Order placed successfully',
    );
    await expect(layoutPage.cartBadge).toHaveText('0');
  });

  test('shows validation error for empty required field', async ({
    authenticatedUser,
    catalogPage,
    checkoutPage,
  }) => {
    void authenticatedUser;

    await prepareCartWithItem(catalogPage);
    await checkoutPage.goto();

    await checkoutPage.submit();

    await expect(checkoutPage.fullNameError).toBeVisible();
    await expect(checkoutPage.fullNameError).toHaveText(
      'Full name is required',
    );
    await expect(checkoutPage.page.getByTestId('checkout-form')).toBeVisible();
  });
});
