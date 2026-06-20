import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoginResponse } from '../types';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/catalog" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? 'Login failed');
      return;
    }

    const data = (await response.json()) as LoginResponse;
    login(data);
    navigate('/catalog');
  }

  return (
    <section className="page login-page" data-testid="login-page">
      <h1>Sign in to QA Shop</h1>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          data-testid="login-username"
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          data-testid="login-password"
          autoComplete="current-password"
        />

        {error ? (
          <p className="error" role="alert" data-testid="login-error">
            {error}
          </p>
        ) : null}

        <button type="submit" data-testid="login-submit">
          Sign in
        </button>
      </form>
      <p className="hint">Demo: demo / demo123</p>
    </section>
  );
}
