const mongoose = require('mongoose');
const Product = require('../model/Product');

async function priceOrderItems(requestItems) {
  if (!Array.isArray(requestItems) || requestItems.length === 0) {
    throw Object.assign(new Error('Your cart is empty.'), { status: 400 });
  }

  const quantities = new Map();
  for (const item of requestItems) {
    const productId = String(item?.productId || '');
    const quantity = Number(item?.qty);
    if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw Object.assign(new Error('The cart contains an invalid item or quantity.'), { status: 400 });
    }
    quantities.set(productId, (quantities.get(productId) || 0) + quantity);
  }

  const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
  if (products.length !== quantities.size) {
    throw Object.assign(new Error('One or more products are no longer available.'), { status: 400 });
  }

  const items = products.map((product) => {
    const qty = quantities.get(String(product._id));
    if (qty > product.stock) {
      throw Object.assign(new Error(`${product.name} does not have enough stock.`), { status: 400 });
    }
    return { productId: product._id, qty, price: Number(product.price) };
  });

  const totalAmount = Math.round(items.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100;
  return { items, totalAmount };
}

function validateAddress(address) {
  const required = ['fullName', 'street', 'city', 'postalCode', 'country'];
  if (!address || required.some((field) => !String(address[field] || '').trim())) {
    throw Object.assign(new Error('Please enter all delivery details.'), { status: 400 });
  }
}

module.exports = { priceOrderItems, validateAddress };
