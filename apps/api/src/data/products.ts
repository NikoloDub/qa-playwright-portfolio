export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const products: Product[] = [
  { id: '1', name: 'QA Handbook', price: 29.99, category: 'books' },
  { id: '2', name: 'Test Mug', price: 12.5, category: 'merch' },
  { id: '3', name: 'Bug Hunter Hoodie', price: 49.99, category: 'merch' },
  { id: '4', name: 'Automation Stickers Pack', price: 5.99, category: 'merch' },
];
