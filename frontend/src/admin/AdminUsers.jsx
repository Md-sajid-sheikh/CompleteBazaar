import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminMessage from './AdminMessage.jsx';
import { adminRequest, pageTitleClass } from './adminApi.js';

function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function loadUsers() {
      try {
        const data = await adminRequest('/api/auth/users', token, { signal: controller.signal });
        if (!Array.isArray(data)) throw new Error('The customer response was not valid.');
        setUsers(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load customers.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadUsers();
    return () => controller.abort();
  }, [token]);

  return (
    <section>
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#647b67]">COMMUNITY</p>
        <h2 className={pageTitleClass}>Customers <span className="font-sans text-lg text-[#77786e]">({users.length})</span></h2>
      </div>
      <AdminMessage loading={loading} error={error}>customers</AdminMessage>
      {!loading && !error && users.length === 0 && <p className="rounded-xl border border-dashed border-[#d6d2c8] bg-white p-10 text-center text-sm text-[#686b60]">No customer accounts found.</p>}
      {!loading && users.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[#e5dfd3] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead className="bg-[#f0f1e9] text-xs uppercase tracking-wide text-[#62665c]">
                <tr><th className="px-4 py-3 font-semibold">Name</th><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Role</th></tr>
              </thead>
              <tbody className="divide-y divide-[#eeeae2]">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#fbfaf7]">
                    <td className="px-4 py-4 font-medium text-[#24271f]">{user.name}</td>
                    <td className="px-4 py-4 text-[#686b60]">{user.email}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.role === 'admin' ? 'bg-[#f3e8dc] text-[#87553b]' : 'bg-[#e9eee7] text-[#405d47]'}`}>{user.role || 'user'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminUsers;