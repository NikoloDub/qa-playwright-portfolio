import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="page not-found-page" data-testid="not-found-page">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/login" data-testid="not-found-login-link">
        Go to login
      </Link>
    </section>
  );
}
