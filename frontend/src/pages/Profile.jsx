import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { tw } from '../tw.js';
import { apiRequest } from '../api.js';

function Profile() {
  const { token, user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    async function fetchOrders() {
      try {
        const data = await apiRequest('/api/orders/myorders', {
          token,
          signal: controller.signal,
        });
        if (!Array.isArray(data)) throw new Error('The orders response was not valid.');
        setOrders(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Could not connect to your account.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchOrders();
    return () => controller.abort();
  }, [token]);

  if (!token) return <Navigate to="/login" replace state={{ from: '/profile' }} />;

  return (
    <section className={tw('page-shell profile-page')}>
      <div className={tw('profile-heading')}>
        <div>
          <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> YOUR ACCOUNT</p>
          <h1 className={tw('heading profile-title')}>Hello, <em className="text-bazaar-orange">{user?.name || 'there'}.</em></h1>
          <p>{user?.email}</p>
        </div>
        <button className={tw('text-button')} type="button" onClick={logout}>Sign out</button>
      </div>

      <section className={tw('profile-orders')} aria-labelledby="profile-orders-title">
        <h2 className={tw('heading mb-5 text-[30px]')} id="profile-orders-title">Your orders<span className="text-bazaar-orange">.</span></h2>
        {loading ? (
          <p className={tw('products-message')} role="status">Loading your orders…</p>
        ) : error ? (
          <p className={tw('checkout-error')} role="alert">{error}</p>
        ) : orders.length ? (
          <div className={tw('profile-order-list')}>
            {orders.map((order) => (
              <article className={tw('profile-order')} key={order._id}>
                <div className={tw('profile-order-heading')}>
                  <div>
                    <p className={tw('profile-order-label')}>ORDER</p>
                    <strong>{order._id}</strong>
                  </div>
                  <span className={tw('order-status')}>{order.status || 'Pending'}</span>
                </div>
                <div className={tw('profile-order-meta')}>
                  <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unavailable'}</span>
                  <strong>₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</strong>
                </div>
                <p className={tw('profile-order-count')}>{order.items?.length || 0} product{order.items?.length === 1 ? '' : 's'}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className={tw('shop-empty-state profile-empty')}>
            <p>You haven’t placed an order yet.</p>
            <Link className={tw('primary-button')} to="/shop">Find something good <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </section>
    </section>
  );
}

export default Profile;