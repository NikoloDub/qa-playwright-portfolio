import { expect, type Locator, type Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly displayNameInput: Locator;
  readonly saveButton: Locator;
  readonly savedMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.displayNameInput = page.getByTestId('profile-display-name');
    this.saveButton = page.getByTestId('profile-save');
    this.savedMessage = page.getByTestId('profile-saved');
  }

  async goto(): Promise<void> {
    await this.page.goto('/profile');
    await expect(this.page.getByTestId('profile-page')).toBeVisible();
  }

  async updateDisplayName(displayName: string): Promise<void> {
    await this.displayNameInput.fill(displayName);
    await this.saveButton.click();
    await expect(this.savedMessage).toBeVisible();
  }

  async expectDisplayName(displayName: string): Promise<void> {
    await expect(this.displayNameInput).toHaveValue(displayName);
    await expect(this.page.getByTestId('header-display-name')).toHaveText(
      displayName,
    );
  }
}
