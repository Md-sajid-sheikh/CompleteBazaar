import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext.jsx';
import { clearCart, selectCartItems, selectCartTotal } from '../redux/cartSlice.js';
import { tw } from '../tw.js';
import { apiRequest } from '../api.js';

const initialAddress = {
  fullName: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
};

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckOut() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [address, setAddress] = useState(() => ({
    ...initialAddress,
    fullName: user?.name || '',
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  function updateAddress(event) {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  }

  async function placeOrder(event) {
    event.preventDefault();
    if (!token || !items.length || submitting) return;

    setSubmitting(true);
    setError('');
    let gatewayOpened = false;

    try {
      const orderItems = items.map((item) => ({ productId: item.id, qty: item.quantity }));

      if (paymentMethod === 'COD') {
        const order = await apiRequest('/api/orders', {
          method: 'POST',
          token,
          body: JSON.stringify({ items: orderItems, address }),
        });
        dispatch(clearCart());
        navigate('/order-success', { replace: true, state: { order } });
        return;
      }

      if (!await loadRazorpayScript()) throw new Error('Could not load Razorpay Checkout. Please try again.');
      const paymentOrder = await apiRequest('/api/payments/order', {
        method: 'POST',
        token,
        body: JSON.stringify({ items: orderItems, address }),
      });

      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'CompleteBazaar',
        description: 'Your CompleteBazaar order',
        order_id: paymentOrder.razorpayOrderId,
        prefill: { name: user?.name || address.fullName, email: user?.email || '' },
        theme: { color: '#315c50' },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError('Payment was cancelled. You can choose another payment method.');
          },
        },
        handler: async (paymentResponse) => {
          try {
            const result = await apiRequest('/api/payments/verify', {
              method: 'POST',
              token,
              body: JSON.stringify({ appOrderId: paymentOrder.appOrderId, ...paymentResponse }),
            });
            dispatch(clearCart());
            navigate('/order-success', { replace: true, state: { order: result.order } });
          } catch (verificationError) {
            setError(verificationError.message || 'Payment confirmation failed. Contact support before trying again.');
          } finally {
            setSubmitting(false);
          }
        },
      });

      checkout.on('payment.failed', (paymentFailure) => {
        setError(paymentFailure.error?.description || 'Payment did not complete. You can retry or choose cash on delivery.');
        setSubmitting(false);
      });
      checkout.open();
      gatewayOpened = true;
    } catch (requestError) {
      setError(requestError.message || 'Could not connect to the shop. Please try again.');
    } finally {
      if (!gatewayOpened) setSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <section className={tw('page-shell checkout-page')}>
        <p className={tw('eyebrow')}>CHECKOUT</p>
        <h1 className={tw('heading text-[clamp(38px,5vw,56px)]')}>Your bag is <em className="text-bazaar-orange">empty.</em></h1>
        <p className={tw('products-message')}>Add something lovely before checking out.</p>
        <Link className={tw('primary-button')} to="/shop">Explore the bazaar <span aria-hidden="true">↗</span></Link>
      </section>
    );
  }

  if (!token) {
    return (
      <section className={tw('page-shell checkout-page')}>
        <p className={tw('eyebrow')}>ALMOST THERE</p>
        <h1 className={tw('heading text-[clamp(38px,5vw,56px)]')}>Sign in to <em className="text-bazaar-orange">check out.</em></h1>
        <p className={tw('products-message')}>Please sign in before placing your order. Your bag will be here when you return.</p>
        <Link className={tw('primary-button')} to="/login" state={{ from: '/checkout' }}>
          Sign in to continue <span aria-hidden="true">↗</span>
        </Link>
      </section>
    );
  }

  return (
    <section className={tw('page-shell checkout-page')}>
      <div className={tw('checkout-heading')}>
        <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> ALMOST YOURS</p>
        <h1 className={tw('heading text-[clamp(38px,5vw,56px)]')}>Checkout<span className="text-bazaar-orange">.</span></h1>
        <p className="mt-3 text-sm text-[#686b60]">Where should we send your good finds?</p>
      </div>

      <div className={tw('checkout-layout')}>
        <form className={tw('checkout-form')} onSubmit={placeOrder}>
          <h2 className={tw('heading text-[21px]')}>Delivery details</h2>
          <label className={tw('auth-label')}>
            Full name
            <input className={tw('form-input')} name="fullName" autoComplete="name" value={address.fullName} onChange={updateAddress} required maxLength={100} />
          </label>
          <label className={tw('auth-label')}>
            Street address
            <input className={tw('form-input')} name="street" autoComplete="street-address" value={address.street} onChange={updateAddress} required maxLength={200} />
          </label>
          <div className={tw('checkout-field-row')}>
            <label className={tw('auth-label')}>
              City
              <input className={tw('form-input')} name="city" autoComplete="address-level2" value={address.city} onChange={updateAddress} required maxLength={100} />
            </label>
            <label className={tw('auth-label')}>
              Postal code
              <input className={tw('form-input')} name="postalCode" autoComplete="postal-code" value={address.postalCode} onChange={updateAddress} required maxLength={20} />
            </label>
          </div>
          <label className={tw('auth-label')}>
            Country
            <input className={tw('form-input')} name="country" autoComplete="country-name" value={address.country} onChange={updateAddress} required maxLength={100} />
          </label>
          <fieldset className={tw('payment-methods')}>
            <legend>Payment method</legend>
            <label className={tw(`payment-option${paymentMethod === 'COD' ? ' payment-option-selected' : ''}`)}>
              <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
              <span><strong>Cash on delivery</strong><small>Pay when your order arrives.</small></span>
            </label>
            <label className={tw(`payment-option${paymentMethod === 'Razorpay' ? ' payment-option-selected' : ''}`)}>
              <input type="radio" name="paymentMethod" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={() => setPaymentMethod('Razorpay')} />
              <span><strong>Pay online</strong><small>UPI, cards, netbanking, or wallet via Razorpay.</small></span>
            </label>
          </fieldset>
          {error && <p className={tw('checkout-error')} role="alert">{error}</p>}
          <button className={tw('primary-button checkout-submit')} type="submit" disabled={submitting}>
            {submitting ? (paymentMethod === 'COD' ? 'Placing your order...' : 'Opening secure checkout...') : `${paymentMethod === 'COD' ? 'Place COD order' : 'Pay online'} - INR ${total.toLocaleString('en-IN')}`}
          </button>
        </form>

        <aside className={tw('checkout-summary')} aria-label="Order summary">
          <h2 className={tw('heading text-[21px]')}>Your bag <span className="font-sans text-xs font-normal tracking-normal text-[#77786e]">({items.reduce((count, item) => count + item.quantity, 0)})</span></h2>
          <div className={tw('checkout-summary-items')}>
            {items.map((item) => (
              <div className={tw('checkout-summary-item')} key={item.id}>
                <span>{item.name} <small className="text-[#929187]">× {item.quantity}</small></span>
                <strong className="whitespace-nowrap text-bazaar-ink">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>
          <div className={tw('checkout-total')}><span>Total</span><strong className="whitespace-nowrap">₹{total.toLocaleString('en-IN')}</strong></div>
          <Link className={tw('text-button')} to="/cart">Return to bag</Link>
        </aside>
      </div>
    </section>
  );
}

export default CheckOut;
