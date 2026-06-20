import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

type SortOption = 'default' | 'price-asc' | 'price-desc';

export function CatalogPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch {
        setError('Could not load catalog');
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = products;

    if (query) {
      filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
    }

    const sorted = [...filtered];
    if (sort === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    }
    if (sort === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  }, [products, search, sort]);

  if (loading) {
    return (
      <section className="page" data-testid="catalog-page">
        <p data-testid="catalog-loading">Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page" data-testid="catalog-page">
        <p className="error" data-testid="catalog-error">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="page catalog-page" data-testid="catalog-page">
      <h1>Catalog</h1>

      <div className="catalog-controls" data-testid="catalog-controls">
        <input
          type="search"
          placeholder="Search by name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          data-testid="catalog-search"
        />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          data-testid="catalog-sort"
        >
          <option value="default">Default order</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <ul className="product-list" data-testid="product-list">
        {visibleProducts.map((product) => (
          <li
            key={product.id}
            className="product-card"
            data-testid={`product-card-${product.id}`}
          >
            <h2 data-testid={`product-name-${product.id}`}>{product.name}</h2>
            <p data-testid={`product-price-${product.id}`}>
              ${product.price.toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => addItem(product)}
              data-testid={`add-to-cart-${product.id}`}
            >
              Add to cart
            </button>
          </li>
        ))}
      </ul>

      {visibleProducts.length === 0 ? (
        <p data-testid="catalog-empty">No products found</p>
      ) : null}
    </section>
  );
}
