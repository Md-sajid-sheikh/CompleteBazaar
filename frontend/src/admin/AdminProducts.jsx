import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminMessage from './AdminMessage.jsx';
import { adminRequest, buttonClass, pageTitleClass, secondaryButtonClass } from './adminApi.js';

function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async (signal) => {
    try {
      setError('');
      const data = await adminRequest('/api/products', token, { signal });
      if (!Array.isArray(data)) throw new Error('The products response was not valid.');
      setProducts(data);
    } catch (requestError) {
      if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load products.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);

  async function deleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      setError('');
      await adminRequest(`/api/products/${encodeURIComponent(product._id)}`, token, { method: 'DELETE' });
      setProducts((current) => current.filter((entry) => entry._id !== product._id));
    } catch (requestError) {
      setError(requestError.message || 'Could not delete the product.');
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#647b67]">CATALOG</p>
          <h2 className={pageTitleClass}>Products <span className="font-sans text-lg text-[#77786e]">({products.length})</span></h2>
        </div>
        <Link className={buttonClass} to="/admin/products/new">Add product <span aria-hidden="true" className="ml-2">+</span></Link>
      </div>
      <AdminMessage loading={loading} error={error}>products</AdminMessage>
      {!loading && !error && !products.length && (
        <div className="rounded-xl border border-dashed border-[#d6d2c8] bg-white py-14 text-center">
          <p className="font-display text-2xl text-[#24271f]">Your catalog is ready.</p>
          <p className="mt-2 text-sm text-[#686b60]">Add a product to get started.</p>
        </div>
      )}
      {!loading && products.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[#e5dfd3] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[#f0f1e9] text-xs uppercase tracking-wide text-[#62665c]">
                <tr><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 font-semibold">Price</th><th className="px-4 py-3 font-semibold">Stock</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-[#eeeae2]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-[#fbfaf7]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? <img className="h-12 w-12 rounded-md object-cover" src={product.imageUrl} alt="" /> : <div className="grid h-12 w-12 place-items-center rounded-md bg-[#f0eee7] text-[#89917f]">✳</div>}
                        <span className="max-w-xs font-medium text-[#24271f]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#686b60]">{product.category}</td>
                    <td className="px-4 py-3 font-semibold text-[#405d47]">₹{Number(product.price || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${Number(product.stock) > 0 ? 'bg-[#e9eee7] text-[#405d47]' : 'bg-red-50 text-red-700'}`}>{product.stock} in stock</span></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link className={secondaryButtonClass} to={`/admin/products/${encodeURIComponent(product._id)}/edit`}>Edit</Link>
                        <button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50" type="button" onClick={() => deleteProduct(product)}>Delete</button>
                      </div>
                    </td>
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

export default AdminProducts;