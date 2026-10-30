import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminMessage from './AdminMessage.jsx';
import { adminRequest, pageTitleClass } from './adminApi.js';

function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function loadOrders() {
      try {
        const data = await adminRequest('/api/orders', token, { signal: controller.signal });
        if (!Array.isArray(data)) throw new Error('The orders response was not valid.');
        setOrders(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load orders.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadOrders();
    return () => controller.abort();
  }, [token]);

  async function changeStatus(orderId, status) {
    setUpdating(orderId);
    setError('');
    try {
      const updated = await adminRequest(`/api/orders/${encodeURIComponent(orderId)}/status`, token, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status: updated.status } : order));
    } catch (requestError) {
      setError(requestError.message || 'Could not update order status.');
    } finally {
      setUpdating('');
    }
  }

  return (
    <section>
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#647b67]">FULFILLMENT</p>
        <h2 className={pageTitleClass}>Orders <span className="font-sans text-lg text-[#77786e]">({orders.length})</span></h2>
      </div>
      <AdminMessage loading={loading} error={error}>orders</AdminMessage>
      {!loading && !error && orders.length === 0 && <p className="rounded-xl border border-dashed border-[#d6d2c8] bg-white p-10 text-center text-sm text-[#686b60]">No orders have been placed yet.</p>}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-xl border border-[#e5dfd3] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eeeae2] pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#85867c]">Order</p>
                  <p className="mt-1 break-all text-sm font-semibold text-[#24271f]">{order._id}</p>
                  <p className="mt-1 text-xs text-[#686b60]">
                    {order.userId?.name || 'Customer'} · {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date unavailable'}
                  </p>
                </div>
                <label className="text-xs font-medium text-[#50564d]">
                  Status
                  <select
                    className="ml-2 rounded-md border border-[#ded9cd] bg-white px-3 py-2 text-sm"
                    value={order.status || 'Pending'}
                    disabled={updating === order._id}
                    onChange={(event) => changeStatus(order._id, event.target.value)}
                  >
                    <option>Pending</option><option>Shipped</option><option>Delivered</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 pt-4 sm:grid-cols-[1fr_auto]">
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <p className="flex justify-between gap-4 text-sm text-[#62665c]" key={`${item.productId?._id || item.productId}-${index}`}>
                      <span className="break-all">{item.productId?.name || item.productId || 'Product'} <span className="text-[#85867c]">× {item.qty}</span></span>
                      <span className="whitespace-nowrap">₹{(Number(item.price || 0) * Number(item.qty || 0)).toLocaleString('en-IN')}</span>
                    </p>
                  ))}
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-[#85867c]">Order total</p>
                  <p className="mt-1 text-lg font-bold text-[#405d47]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
              {order.address && (
                <p className="mt-4 border-t border-[#eeeae2] pt-4 text-xs leading-5 text-[#686b60]">
                  Deliver to: {order.address.fullName}, {order.address.street}, {order.address.city}, {order.address.postalCode}, {order.address.country}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminOrders;