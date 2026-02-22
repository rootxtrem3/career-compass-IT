import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export function AuthDrawer({ open, onClose }) {
  const { login, register, isFirebaseEnabled } = useAuth();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-backdrop" role="dialog" aria-modal="true" aria-label="Authentication panel">
      <div className="auth-drawer glass-card">
        <div className="auth-head">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <button type="button" className="plain-close" onClick={onClose} aria-label="Close auth panel">
            x
          </button>
        </div>

        <div className="auth-mode-switch">
          <button
            type="button"
            className={mode === 'login' ? 'choice-chip active' : 'choice-chip'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'choice-chip active' : 'choice-chip'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label>
              Full name
              <input
                className="input-field"
                type="text"
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                required
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              className="input-field"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label>
            Password
            <input
              className="input-field"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="btn btn-solid" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {!isFirebaseEnabled ? (
          <p className="error-text">Firebase Auth is not configured. Set VITE_FIREBASE_* environment values.</p>
        ) : (
          <p className="muted">Authentication is powered by Firebase Email/Password Auth.</p>
        )}
      </div>
    </div>
  );
}
