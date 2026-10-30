import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { tw } from '../tw.js';

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login({ email, password });
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={tw('page-shell auth-page')}>
      <div className={tw('auth-card')}>
        <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> WELCOME BACK</p>
        <h1 className={tw('heading text-[42px]')}>Sign <em className="text-bazaar-orange">in.</em></h1>
        <p className={tw('auth-intro')}>Sign in to continue to your CompleteBazaar account.</p>
        <form className={tw('auth-form')} onSubmit={handleSubmit}>
          <label className={tw('auth-label')}>
            Email address
            <input
              className={tw('form-input')}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className={tw('auth-label')}>
            Password
            <input
              className={tw('form-input')}
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className={tw('checkout-error')} role="alert">{error}</p>}
          <button className={tw('primary-button auth-submit')} type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className={tw('auth-switch')}>New here? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  );
}

export default Login;