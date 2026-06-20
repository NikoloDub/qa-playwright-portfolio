import { expect, type Locator, type Page } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly productList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('catalog-search');
    this.sortSelect = page.getByTestId('catalog-sort');
    this.productList = page.getByTestId('product-list');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByTestId('catalog-page')).toBeVisible();
    await expect(this.page.getByTestId('catalog-loading')).toBeHidden();
  }

  productCards(): Locator {
    return this.productList.locator('[data-testid^="product-card-"]');
  }

  async getProductCount(): Promise<number> {
    return this.productCards().count();
  }

  async searchByName(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async sortByPriceAscending(): Promise<void> {
    await this.sortSelect.selectOption('price-asc');
  }

  addToCartButton(productId: string): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  async addProductToCart(productId: string): Promise<void> {
    await this.addToCartButton(productId).click();
  }

  visibleProductNames(): Locator {
    return this.page.locator('[data-testid^="product-name-"]');
  }

  async getVisiblePrices(): Promise<number[]> {
    const priceLocators = this.page.locator('[data-testid^="product-price-"]');
    const count = await priceLocators.count();
    const prices: number[] = [];

    for (let index = 0; index < count; index += 1) {
      const text = await priceLocators.nth(index).textContent();
      const value = Number.parseFloat(text?.replace('$', '').trim() ?? '0');
      prices.push(value);
    }

    return prices;
  }
}
