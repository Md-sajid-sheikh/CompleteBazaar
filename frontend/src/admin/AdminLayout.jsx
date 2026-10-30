import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminPageClass } from './adminApi.js';

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Customers' },
];

function AdminLayout() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className={adminPageClass()}>
      <header className="mb-7 flex flex-col gap-5 border-b border-[#e5dfd3] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#647b67]">COMPLETEBAZAAR · ADMIN</p>
          <h1 className="font-display text-3xl font-medium tracking-tight text-[#24271f] sm:text-4xl">Store management</h1>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Admin navigation">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-[#405d47] text-white' : 'bg-white text-[#50564d] hover:bg-[#eef0e9]'}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
