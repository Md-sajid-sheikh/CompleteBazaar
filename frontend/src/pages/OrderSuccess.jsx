import { Link, useLocation } from 'react-router-dom';
import { tw } from '../tw.js';

function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <section className={tw('page-shell checkout-page checkout-success')} aria-labelledby="order-success-title">
      <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> {order ? 'ORDER CONFIRMED' : 'ORDER STATUS'}</p>
      <h1 className={tw('heading text-[clamp(38px,5vw,56px)]')} id="order-success-title">{order ? <>Thank you<span className="text-bazaar-orange">.</span></> : <>Confirmation unavailable<span className="text-bazaar-orange">.</span></>}</h1>
      {order ? (
        <>
          <p>Your order has been placed successfully.</p>
          {order._id && <p className={tw('checkout-order-id')}>Order number: <strong className="text-bazaar-ink">{order._id}</strong></p>}
            <p className={tw('checkout-order-note')}>We’ll use the delivery details provided at checkout to get your order to you.</p>
        </>
      ) : (
        <p className={tw('checkout-order-note')}>This confirmation may have expired. Check your account for the latest order status.</p>
      )}
      <div className={tw('order-success-actions')}>
        <Link className={tw('primary-button')} to="/shop">Keep exploring <span aria-hidden="true">↗</span></Link>
        <Link className={tw('text-button')} to="/profile">View your orders</Link>
      </div>
    </section>
  );
}

export default OrderSuccess;