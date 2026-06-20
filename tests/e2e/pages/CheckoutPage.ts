import { expect, type Locator, type Page } from '@playwright/test';

export interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
}

export class CheckoutPage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly fullNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.getByTestId('checkout-full-name');
    this.emailInput = page.getByTestId('checkout-email');
    this.addressInput = page.getByTestId('checkout-address');
    this.submitButton = page.getByTestId('checkout-submit');
    this.successMessage = page.getByTestId('checkout-success');
    this.fullNameError = page.getByTestId('checkout-error-full-name');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await expect(this.page.getByTestId('checkout-page')).toBeVisible();
  }

  async fillForm(form: CheckoutFormData): Promise<void> {
    await this.fullNameInput.fill(form.fullName);
    await this.emailInput.fill(form.email);
    await this.addressInput.fill(form.address);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async placeOrder(form: CheckoutFormData): Promise<void> {
    await this.fillForm(form);
    await this.submit();
  }
}
