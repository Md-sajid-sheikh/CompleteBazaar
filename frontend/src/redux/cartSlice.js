import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'completebazaar.cart';

function loadItems() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadItems() },
  reducers: {
    addToCart(state, { payload: product }) {
      const id = product?._id || product?.id;
      if (!id || Number(product.stock) === 0) return;

      const existing = state.items.find((item) => item.id === id);
      const max = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 99;
      if (existing) existing.quantity = Math.min(existing.quantity + 1, max);
      else state.items.push({
        id,
        name: product.name || 'Product',
        price: Number(product.price) || 0,
        imageUrl: product.imageUrl || product.image || '',
        stock: max,
        quantity: 1,
      });
    },
    setQuantity(state, { payload: { id, quantity } }) {
      const item = state.items.find((entry) => entry.id === id);
      if (!item) return;
      if (quantity <= 0) state.items = state.items.filter((entry) => entry.id !== id);
      else item.quantity = Math.min(Math.floor(quantity), item.stock || 99);
    },
    syncCartPrices(state, { payload: products }) {
      if (!Array.isArray(products)) return;
      const latest = new Map(products.map((product) => [product._id || product.id, product]));
      state.items.forEach((item) => {
        const product = latest.get(item.id);
        if (product) item.price = Number(product.price) || 0;
      });
    },
    removeFromCart(state, { payload: id }) {
      state.items = state.items.filter((item) => item.id !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, setQuantity, syncCartPrices, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export default cartSlice.reducer;
