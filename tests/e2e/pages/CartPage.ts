import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly emptyState: Locator;
  readonly cartList: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyState = page.getByTestId('cart-empty');
    this.cartList = page.getByTestId('cart-list');
    this.cartBadge = page.getByTestId('cart-badge');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
    await expect(this.page.getByTestId('cart-page')).toBeVisible();
  }

  async removeProduct(productId: string): Promise<void> {
    await this.page.getByTestId(`remove-from-cart-${productId}`).click();
  }

  async expectEmpty(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }
}
