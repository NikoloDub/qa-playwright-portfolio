import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Layout() {
  const { session, logout } = useAuth();
  const { totalCount } = useCart();

  return (
    <div className="app">
      <header className="header" data-testid="app-header">
        <Link to="/catalog" className="logo" data-testid="nav-logo">
          QA Shop
        </Link>
        <nav className="nav" data-testid="main-nav">
          <NavLink to="/catalog" data-testid="nav-catalog">
            Catalog
          </NavLink>
          <NavLink to="/cart" data-testid="nav-cart">
            Cart
            <span className="badge" data-testid="cart-badge">
              {totalCount}
            </span>
          </NavLink>
          <NavLink to="/profile" data-testid="nav-profile">
            Profile
          </NavLink>
        </nav>
        <div className="header-user" data-testid="header-user">
          <span data-testid="header-display-name">
            {session?.user.displayName}
          </span>
          <button type="button" onClick={logout} data-testid="logout-button">
            Logout
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
