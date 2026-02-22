import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard.jsx';
import { SectionReveal } from '../components/ui/SectionReveal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSeo } from '../hooks/useSeo.js';

export function LoginPage() {
  const { user, login, register, loginWithGoogle, isFirebaseEnabled, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  useSeo({
    title: 'Career Compass | Login',
    description: 'Sign in with Google or email to save your analysis history and checklist progress.'
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      window.location.hash = '/analysis';
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setSubmitting(true);

    try {
      await loginWithGoogle();
      window.location.hash = '/analysis';
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <SectionReveal>
        <GlassCard className="content-card login-card" as="section">
          <p className="eyebrow">Authentication</p>
          <h1>Login to track your career journey</h1>
          <p>
            Sign in to save your recommendation history and maintain your personal checklist for each
            career path.
          </p>

          {!isFirebaseEnabled ? (
            <p className="error-text">Firebase is not configured. Set your VITE_FIREBASE_* variables first.</p>
          ) : null}

          {user ? (
            <div className="login-status glass-soft">
              <p>
                Logged in as <strong>{user.email}</strong>
              </p>
              <a href="#/analysis" className="btn btn-solid">
                Continue to Analysis
              </a>
            </div>
          ) : (
            <>
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

              <button
                type="button"
                className="btn btn-soft google-btn"
                disabled={submitting || loading || !isFirebaseEnabled}
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </button>

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

                <button type="submit" className="btn btn-solid" disabled={submitting || loading || !isFirebaseEnabled}>
                  {submitting ? 'Please wait...' : mode === 'login' ? 'Login with Email' : 'Register with Email'}
                </button>
              </form>
            </>
          )}
        </GlassCard>
      </SectionReveal>
    </div>
  );
}
