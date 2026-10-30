import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../api.js';
import { clearCart, removeFromCart, selectCartItems, selectCartTotal, setQuantity, syncCartPrices } from '../redux/cartSlice.js';
import { tw } from '../tw.js';

function formatPrice(value) {
  return `${String.fromCharCode(8377)}${Number(value || 0).toLocaleString('en-IN')}`;
}

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest('/api/products', { signal: controller.signal })
      .then((products) => dispatch(syncCartPrices(products)))
      .catch(() => {});
    return () => controller.abort();
  }, [dispatch]);

  if (!items.length) {
    return (
      <section className={tw('page-shell cart-page')}>
        <div className={tw('cart-empty-state')}>
          <span className={tw('cart-empty-icon')} aria-hidden="true">✳</span>
          <p className={tw('eyebrow')}>YOUR BAG</p>
          <h1 className={tw('heading text-[clamp(38px,5vw,56px)]')}>Your bag is <em className="text-bazaar-orange">waiting.</em></h1>
          <p className={tw('cart-empty-copy')}>Add something lovely and it&apos;ll show up here. Your next everyday favorite is just around the corner.</p>
          <Link className={tw('primary-button')} to="/shop">Explore finds <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </section>
    );
  }

  return (
    <section className={tw('page-shell cart-page')}>
      <div className={tw('section-heading')}>
        <div>
          <p className={tw('eyebrow')}>YOUR BAG</p>
          <h1 className={tw('heading text-[clamp(38px,5vw,56px)]')}>Good choices<span className="text-bazaar-orange">.</span></h1>
        </div>
        <button className={tw('text-button')} type="button" onClick={() => dispatch(clearCart())}>Clear bag</button>
      </div>

      <div className={tw('cart-layout')}>
        <div className={tw('cart-items')}>
          {items.map((item) => (
            <article className={tw('cart-item')} key={item.id}>
              {item.imageUrl ? <img className={tw('cart-item-image')} src={item.imageUrl} alt={item.name} /> : <div className={tw('cart-item-placeholder')} aria-hidden="true">✳</div>}
              <div className={tw('cart-item-info')}>
                <h2 className={tw('heading')}>{item.name}</h2>
                <p>{formatPrice(item.price)}</p>
                <button className={tw('text-button')} type="button" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
              </div>
              <label className={tw('quantity-control')}>
                <span>Qty</span>
                <input
                  type="number"
                  className={tw('quantity-input')}
                  min="0"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(event) => dispatch(setQuantity({ id: item.id, quantity: Number(event.target.value) }))}
                />
              </label>
              <strong className={tw('cart-line-total')}>{formatPrice(item.price * item.quantity)}</strong>
            </article>
          ))}
        </div>

        <aside className={tw('cart-summary')}>
          <strong className="col-span-2 mb-1 font-display text-xl">Order summary</strong>
          <span>Subtotal</span><strong>{formatPrice(total)}</strong>
          <p>Shipping and taxes are calculated at checkout.</p>
          <Link className={tw('primary-button')} to="/checkout">Proceed to checkout <span aria-hidden="true">&rarr;</span></Link>
          <Link className="col-span-2 text-center text-xs font-medium text-bazaar-green underline underline-offset-4 hover:text-bazaar-orange" to="/shop">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
