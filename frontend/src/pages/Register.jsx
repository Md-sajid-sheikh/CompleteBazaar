import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { tw } from '../tw.js';

function Register() {
  const { register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from || '/';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(form);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={tw('page-shell auth-page')}>
      <div className={tw('auth-card')}>
        <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> JOIN THE BAZAAR</p>
        <h1 className={tw('heading text-[42px]')}>Create <em className="text-bazaar-orange">account.</em></h1>
        <p className={tw('auth-intro')}>Create an account to place orders and keep track of your finds.</p>
        <form className={tw('auth-form')} onSubmit={handleSubmit}>
          <label className={tw('auth-label')}>
            Your name
            <input className={tw('form-input')} name="name" autoComplete="name" value={form.name} onChange={updateForm} required maxLength={100} />
          </label>
          <label className={tw('auth-label')}>
            Email address
            <input className={tw('form-input')} type="email" name="email" autoComplete="email" value={form.email} onChange={updateForm} required />
          </label>
          <label className={tw('auth-label')}>
            Password
            <input className={tw('form-input')} type="password" name="password" autoComplete="new-password" value={form.password} onChange={updateForm} required minLength={6} />
          </label>
          {error && <p className={tw('checkout-error')} role="alert">{error}</p>}
          <button className={tw('primary-button auth-submit')} type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className={tw('auth-switch')}>Already have an account? <Link to="/login" state={{ from: destination }}>Sign in</Link></p>
      </div>
    </section>
  );
}

export default Register;