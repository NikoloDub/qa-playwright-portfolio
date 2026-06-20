import { expect, test } from '../fixtures/base.fixture';

test.describe('Catalog', () => {
  test('displays at least three products', async ({
    authenticatedUser,
    catalogPage,
  }) => {
    void authenticatedUser;

    await catalogPage.expectLoaded();
    await expect(catalogPage.productCards()).toHaveCount(4);
    expect(await catalogPage.getProductCount()).toBeGreaterThanOrEqual(3);
  });

  test('filters products by name search', async ({
    authenticatedUser,
    catalogPage,
  }) => {
    void authenticatedUser;

    await catalogPage.expectLoaded();
    await catalogPage.searchByName('Mug');

    await expect(catalogPage.productCards()).toHaveCount(1);
    await expect(catalogPage.visibleProductNames()).toHaveText(['Test Mug']);
  });

  test('sorts products by price ascending', async ({
    authenticatedUser,
    catalogPage,
  }) => {
    void authenticatedUser;

    await catalogPage.expectLoaded();
    await catalogPage.sortByPriceAscending();

    const prices = await catalogPage.getVisiblePrices();
    expect(prices).toEqual([5.99, 12.5, 29.99, 49.99]);
  });
});
