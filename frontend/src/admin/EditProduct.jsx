import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminRequest, buttonClass, inputClass, labelClass, pageTitleClass, secondaryButtonClass } from './adminApi.js';

function EditProduct() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function loadProduct() {
      try {
        const data = await adminRequest(`/api/products/${encodeURIComponent(id)}`, token, { signal: controller.signal });
        setProduct({
          name: data.name || '',
          description: data.description || '',
          price: data.price ?? '',
          category: data.category || '',
          stock: data.stock ?? '',
          imageUrl: data.imageUrl || '',
        });
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load the product.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadProduct();
    return () => controller.abort();
  }, [id, token]);

  function updateProduct(event) {
    const { name, value } = event.target;
    setProduct((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = new FormData();
      ['name', 'description', 'price', 'category', 'stock'].forEach((key) => body.append(key, product[key]));
      if (image) body.append('image', image);
      await adminRequest(`/api/products/${encodeURIComponent(id)}`, token, { method: 'PUT', body });
      navigate('/admin/products', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not update the product.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="py-12 text-center text-sm text-[#686b60]" role="status">Loading product…</p>;
  if (!product) return <div className="rounded-md bg-red-50 p-4 text-sm text-red-800" role="alert">{error || 'Product not found.'}</div>;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#647b67]">CATALOG</p>
          <h2 className={pageTitleClass}>Edit product</h2>
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
          <input className={inputClass} name="category" value={product.category} onChange={updateProduct} required maxLength={80} />
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
          Replace product image (optional)
          <input className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-[#eef0e9] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#405d47]`} type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
        </label>
        {product.imageUrl && (
          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-medium text-[#50564d]">Current image</p>
            <img className="h-40 w-40 rounded-md border border-[#e5dfd3] object-cover" src={product.imageUrl} alt={product.name} />
          </div>
        )}
        <label className={`${labelClass} sm:col-span-2`}>
          Description
          <textarea className={`${inputClass} min-h-32 resize-y`} name="description" value={product.description} onChange={updateProduct} required maxLength={2000} rows="5" />
        </label>
        {error && <p className="sm:col-span-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button className={buttonClass} type="submit" disabled={saving}>{saving ? 'Saving changes…' : 'Save changes'}</button>
          <Link className={secondaryButtonClass} to="/admin/products">Cancel</Link>
        </div>
      </form>
    </section>
  );
}

export default EditProduct;