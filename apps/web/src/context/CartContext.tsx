import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'qa-shop-cart';

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCartItems(): CartItem[] {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function persistCartItems(items: CartItem[]): void {
  if (items.length === 0) {
    localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readCartItems());

  const updateItems = useCallback(
    (updater: (current: CartItem[]) => CartItem[]) => {
      setItems((current) => {
        const next = updater(current);
        persistCartItems(next);
        return next;
      });
    },
    [],
  );

  const addItem = useCallback(
    (product: Product) => {
      updateItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...current, { product, quantity: 1 }];
      });
    },
    [updateItems],
  );

  const removeItem = useCallback(
    (productId: string) => {
      updateItems((current) =>
        current.filter((item) => item.product.id !== productId),
      );
    },
    [updateItems],
  );

  const clearCart = useCallback(() => {
    updateItems(() => []);
  }, [updateItems]);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount,
      addItem,
      removeItem,
      clearCart,
    }),
    [items, totalCount, addItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
