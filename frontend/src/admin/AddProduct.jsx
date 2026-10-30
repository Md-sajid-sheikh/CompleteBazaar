import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminRequest, buttonClass, inputClass, labelClass, pageTitleClass, secondaryButtonClass } from './adminApi.js';

const initialProduct = { name: '', description: '', price: '', category: '', stock: '' };

function AddProduct() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(initialProduct);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateProduct(event) {
    const { name, value } = event.target;
    setProduct((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!image) {
      setError('Choose a product image before saving.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const body = new FormData();
      Object.entries(product).forEach(([key, value]) => body.append(key, value));
      body.append('image', image);
      await adminRequest('/api/products', token, { method: 'POST', body });
      navigate('/admin/products', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not create the product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#647b67]">CATALOG</p>
          <h2 className={pageTitleClass}>Add a product</h2>
        </div>
        <Link className={secondaryButtonClass} to="/admin/products">Back to products</Link>
      </div>

      <form className="grid gap-5 rounded-xl border border-[#e5dfd3] bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7" onSubmit={handleSubmit}>
        <label className={`${labelClass} sm:col-span-2`}>
          Product name
          <input className={inputClass} name="name" value={product.name} onChange={updateProduct} required maxLength={150} />
        </label>
        <label className={labelClass}>
          Category
          <input className={inputClass} name="category" value={product.category} onChange={updateProduct} required maxLength={80} placeholder="e.g. Home & living" />
        </label>
        <label className={labelClass}>
          Price (₹)
          <input className={inputClass} type="number" name="price" value={product.price} onChange={updateProduct} required min="0.01" step="0.01" />
        </label>
        <label className={labelClass}>
          Stock quantity
          <input className={inputClass} type="number" name="stock" value={product.stock} onChange={updateProduct} required min="0" step="1" />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Product image
          <input className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-[#eef0e9] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#405d47]`} type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} required />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Description
          <textarea className={`${inputClass} min-h-32 resize-y`} name="description" value={product.description} onChange={updateProduct} required maxLength={2000} rows="5" />
        </label>
        {error && <p className="sm:col-span-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button className={buttonClass} type="submit" disabled={saving}>{saving ? 'Saving product…' : 'Save product'}</button>
          <Link className={secondaryButtonClass} to="/admin/products">Cancel</Link>
        </div>
      </form>
    </section>
  );
}

export default AddProduct;