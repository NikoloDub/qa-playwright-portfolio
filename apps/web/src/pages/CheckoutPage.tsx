import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { CheckoutForm } from '../types';

const emptyForm: CheckoutForm = {
  fullName: '',
  email: '',
  address: '',
};

export function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [success, setSuccess] = useState(false);

  if (items.length === 0 && !success) {
    return <Navigate to="/cart" replace />;
  }

  function validate(values: CheckoutForm): Partial<CheckoutForm> {
    const nextErrors: Partial<CheckoutForm> = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    }
    if (!values.email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (!values.address.trim()) {
      nextErrors.address = 'Address is required';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    clearCart();
    setSuccess(true);
  }

  if (success) {
    return (
      <section className="page checkout-page" data-testid="checkout-page">
        <div className="success" data-testid="checkout-success">
          <h1>Order placed successfully</h1>
          <p>Thank you for your purchase!</p>
          <Link to="/catalog" data-testid="checkout-success-catalog">
            Back to catalog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page checkout-page" data-testid="checkout-page">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} data-testid="checkout-form" noValidate>
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={(event) =>
            setForm((current) => ({ ...current, fullName: event.target.value }))
          }
          data-testid="checkout-full-name"
        />
        {errors.fullName ? (
          <p className="error" data-testid="checkout-error-full-name">
            {errors.fullName}
          </p>
        ) : null}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          data-testid="checkout-email"
        />
        {errors.email ? (
          <p className="error" data-testid="checkout-error-email">
            {errors.email}
          </p>
        ) : null}

        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          value={form.address}
          onChange={(event) =>
            setForm((current) => ({ ...current, address: event.target.value }))
          }
          data-testid="checkout-address"
        />
        {errors.address ? (
          <p className="error" data-testid="checkout-error-address">
            {errors.address}
          </p>
        ) : null}

        <button type="submit" data-testid="checkout-submit">
          Place order
        </button>
      </form>
    </section>
  );
}
