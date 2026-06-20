import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { items, removeItem, totalCount } = useCart();

  return (
    <section className="page cart-page" data-testid="cart-page">
      <h1>Cart</h1>

      {items.length === 0 ? (
        <div data-testid="cart-empty">
          <p>Your cart is empty</p>
          <Link to="/catalog" data-testid="cart-go-catalog">
            Back to catalog
          </Link>
        </div>
      ) : (
        <>
          <p data-testid="cart-count">Items in cart: {totalCount}</p>
          <ul className="cart-list" data-testid="cart-list">
            {items.map((item) => (
              <li
                key={item.product.id}
                data-testid={`cart-item-${item.product.id}`}
              >
                <span>{item.product.name}</span>
                <span data-testid={`cart-item-qty-${item.product.id}`}>
                  x{item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  data-testid={`remove-from-cart-${item.product.id}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <Link to="/checkout" data-testid="cart-checkout-link">
            Proceed to checkout
          </Link>
        </>
      )}
    </section>
  );
}
