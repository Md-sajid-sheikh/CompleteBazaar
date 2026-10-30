import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice.js';

const STORAGE_KEY = 'completebazaar.cart';

export const store = configureStore({
  reducer: { cart: cartReducer },
});

store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().cart.items));
  } catch {
    // The cart remains usable for the current session if storage is unavailable.
  }
});

export default store;
