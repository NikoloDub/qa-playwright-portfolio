import { expect, test } from '@playwright/test';
import type { ApiProduct } from './types';

test.describe('GET /api/products', () => {
  test('returns 200 and products with required fields', async ({ request }) => {
    const response = await request.get('/api/products');

    expect(response.status()).toBe(200);

    const products = (await response.json()) as ApiProduct[];

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThanOrEqual(3);

    for (const product of products) {
      expect(product.id).toEqual(expect.any(String));
      expect(product.name).toEqual(expect.any(String));
      expect(product.price).toEqual(expect.any(Number));
      expect(product.category).toEqual(expect.any(String));
    }
  });
});
