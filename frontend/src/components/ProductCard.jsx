import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice.js';
import { tw } from '../tw.js';

function ProductCard({ product }) {
  const image = product.imageUrl || product.image || '';
  const dispatch = useDispatch();
  const productId = product._id || product.id;
  const inCart = useSelector((state) => state.cart.items.some((item) => item.id === productId));
  const outOfStock = Number(product.stock) === 0;

  return (
    <article className={tw('product-card')}>
      <div className={tw('product-image-wrap')}>
        <Link to={`/products/${encodeURIComponent(productId)}`} aria-label={`View ${product.name || 'product'} details`}>
          {image ? (
            <img className={tw('product-image')} src={image} alt={product.name} loading="lazy" />
          ) : (
            <div className={tw('product-image-placeholder')} aria-label="No product image available">✳</div>
          )}
        </Link>
      </div>
      <div className={tw('product-card-details')}>
        <p className={tw('product-category')}>{product.category || 'Everyday finds'}</p>
        <h3 className={tw('product-title')}><Link to={`/products/${encodeURIComponent(productId)}`}>{product.name || 'Untitled product'}</Link></h3>
        <p className={tw('product-price')}>₹{Number(product.price || 0).toLocaleString('en-IN')}</p>
        <button className={tw('add-to-cart-button')} type="button" disabled={outOfStock} onClick={() => dispatch(addToCart(product))}>
          {outOfStock ? 'Out of stock' : inCart ? 'Add another' : 'Add to bag'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
