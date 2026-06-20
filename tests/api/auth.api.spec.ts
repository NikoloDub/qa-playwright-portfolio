import { expect, test } from '@playwright/test';
import type { LoginErrorResponse, LoginSuccessResponse } from './types';

test.describe('POST /api/auth/login', () => {
  test('returns 401 for invalid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        username: 'demo',
        password: 'wrong-password',
      },
    });

    expect(response.status()).toBe(401);

    const body = (await response.json()) as LoginErrorResponse;
    expect(body.message).toBe('Invalid username or password');
  });

  test('returns 200 and token for valid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        username: 'demo',
        password: 'demo123',
      },
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as LoginSuccessResponse;

    expect(body.token).toBeTruthy();
    expect(body.user).toEqual({
      username: 'demo',
      displayName: 'Demo User',
    });
  });
});
