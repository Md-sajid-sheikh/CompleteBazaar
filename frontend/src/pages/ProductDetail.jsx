import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice.js';
import { tw } from '../tw.js';
import { apiRequest } from '../api.js';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setProduct(null);
        setAddedToCart(false);
        setError('');
        const data = await apiRequest(`/api/products/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (!data || typeof data !== 'object' || !(data._id || data.id)) {
          throw new Error('The product details could not be loaded.');
        }
        setProduct(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Could not connect to the shop.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchProduct();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <div className={tw('page-shell product-detail-message')} role="status">Loading product…</div>;
  }

  if (error || !product) {
    return (
      <div className={tw('page-shell product-detail-message')} role="alert">
        <h1 className={tw('heading text-[clamp(32px,5vw,54px)]')}>{error || 'Product not found.'}</h1>
        <p className="mb-1 text-sm text-[#686b60]">Try browsing the rest of the bazaar.</p>
        <Link className={tw('primary-button')} to="/shop">Back to the bazaar <span aria-hidden="true">↗</span></Link>
      </div>
    );
  }

  const image = product.imageUrl || product.image || '';
  const outOfStock = Number(product.stock) === 0;

  function handleAddToCart() {
    dispatch(addToCart(product));
    setAddedToCart(true);
  }

  return (
    <div className={tw('page-shell product-detail-page')}>
      <nav className={tw('product-breadcrumb')} aria-label="Breadcrumb">
        <Link to="/">Home</Link><span aria-hidden="true">/</span>
        <Link to="/shop">Shop</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name || 'Product'}</span>
      </nav>

      <article className={tw('product-detail')}>
        <div className={tw('product-detail-image-wrap')}>
          {image ? (
            <img className={tw('product-detail-image')} src={image} alt={product.name || 'Product'} />
          ) : (
            <div className={tw('product-detail-image-placeholder')} aria-label="No product image available">✳</div>
          )}
        </div>
        <div className={tw('product-detail-copy')}>
          <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> {product.category || 'EVERYDAY FINDS'}</p>
          <h1 className={tw('heading text-[clamp(34px,4vw,50px)]')}>{product.name || 'Untitled product'}</h1>
          <p className={tw('product-detail-price')}>₹{Number(product.price || 0).toLocaleString('en-IN')}</p>
          <p className={tw(`product-stock${outOfStock ? ' is-out-of-stock' : ''}`)}>
            {outOfStock ? 'Currently out of stock' : 'In stock and ready to go'}
          </p>
          {product.description && <p className={tw('product-detail-description')}>{product.description}</p>}
          <button
            className={tw('add-to-cart-button product-detail-add')}
            type="button"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            {outOfStock ? 'Out of stock' : addedToCart ? 'Added to bag — add another' : 'Add to bag'}
          </button>
          {addedToCart && <p className={tw('product-added-message')} role="status">Added to your bag.</p>}
          <p className={tw('product-detail-note')}>A good find, delivered straight to you.</p>
        </div>
      </article>
    </div>
  );
}

export default ProductDetail;