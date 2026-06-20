import { type Locator, type Page } from '@playwright/test';

export class LayoutPage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly cartBadge: Locator;
  readonly navCatalog: Locator;
  readonly navCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByTestId('logout-button');
    this.cartBadge = page.getByTestId('cart-badge');
    this.navCatalog = page.getByTestId('nav-catalog');
    this.navCart = page.getByTestId('nav-cart');
  }
}
