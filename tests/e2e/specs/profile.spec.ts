import { test } from '../fixtures/base.fixture';

test.describe('Profile', () => {
  test('persists display name after page reload', async ({
    authenticatedUser,
    profilePage,
    page,
  }) => {
    void authenticatedUser;

    const newDisplayName = 'Nikolay QA';

    await profilePage.goto();
    await profilePage.updateDisplayName(newDisplayName);

    await page.reload();
    await profilePage.expectDisplayName(newDisplayName);
  });
});
