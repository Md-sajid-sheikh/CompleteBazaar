import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminMessage from './AdminMessage.jsx';
import { adminRequest, cardClass, pageTitleClass } from './adminApi.js';

function AdminDashboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState({ products: [], orders: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function loadDashboard() {
      try {
        const [products, orders, users] = await Promise.all([
          adminRequest('/api/products', token, { signal: controller.signal }),
          adminRequest('/api/orders', token, { signal: controller.signal }),
          adminRequest('/api/auth/users', token, { signal: controller.signal }),
        ]);
        if (![products, orders, users].every(Array.isArray)) throw new Error('The dashboard data was not valid.');
        setData({ products, orders, users });
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load dashboard data.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadDashboard();
    return () => controller.abort();
  }, [token]);

  const revenue = data.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const metrics = [
    { label: 'Products', value: data.products.length, note: 'Items in your catalog', color: 'bg-[#eef0e9] text-[#405d47]' },
    { label: 'Orders', value: data.orders.length, note: 'All-time orders', color: 'bg-[#f3e8dc] text-[#87553b]' },
    { label: 'Customers', value: data.users.length, note: 'Registered accounts', color: 'bg-[#e9edf4] text-[#485f83]' },
    { label: 'Order value', value: `₹${revenue.toLocaleString('en-IN')}`, note: 'Total order value', color: 'bg-[#f3e8ec] text-[#855367]' },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#647b67]">STORE OVERVIEW</p>
          <h2 className={pageTitleClass}>Welcome, {user?.name || 'admin'}.</h2>
          <p className="mt-2 text-sm text-[#686b60]">Here’s how your bazaar is doing.</p>
        </div>
        <Link className="inline-flex min-h-10 items-center rounded-md bg-[#405d47] px-4 text-sm font-semibold text-white transition hover:bg-[#2f4936]" to="/admin/products/new">Add a product <span className="ml-2">+</span></Link>
      </div>

      <AdminMessage loading={loading} error={error}>store data</AdminMessage>
      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article className={cardClass} key={metric.label}>
                <div className={`mb-4 grid h-10 w-10 place-items-center rounded-lg text-sm font-bold ${metric.color}`} aria-hidden="true">{metric.label.slice(0, 1)}</div>
                <p className="text-sm font-medium text-[#686b60]">{metric.label}</p>
                <p className="mt-1 break-words text-2xl font-bold text-[#24271f]">{metric.value}</p>
                <p className="mt-1 text-xs text-[#85867c]">{metric.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <section className={cardClass}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl text-[#24271f]">Recent orders</h3>
                <Link className="text-sm font-semibold text-[#405d47] hover:underline" to="/admin/orders">View all</Link>
              </div>
              {data.orders.length ? (
                <div className="divide-y divide-[#eeeae2]">
                  {[...data.orders].slice(-5).reverse().map((order) => (
                    <div className="flex items-center justify-between gap-3 py-3" key={order._id}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#24271f]">{order.userId?.name || 'Customer'}</p>
                        <p className="mt-1 truncate text-xs text-[#85867c]">#{order._id}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-[#405d47]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                        <p className="mt-1 text-xs text-[#85867c]">{order.status || 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="py-6 text-sm text-[#686b60]">Orders will appear here when customers check out.</p>}
            </section>
            <section className={cardClass}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl text-[#24271f]">Catalog health</h3>
                <Link className="text-sm font-semibold text-[#405d47] hover:underline" to="/admin/products">Manage products</Link>
              </div>
              <p className="text-sm text-[#686b60]">{data.products.filter((product) => Number(product.stock) === 0).length} products are out of stock.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.products.slice(0, 5).map((product) => (
                  <span className="rounded-full bg-[#f0f1e9] px-3 py-1.5 text-xs text-[#50564d]" key={product._id}>{product.name}</span>
                ))}
                {!data.products.length && <span className="text-sm text-[#85867c]">Your product catalog is empty.</span>}
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboard;