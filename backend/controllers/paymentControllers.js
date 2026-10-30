const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../model/Order');
const sendEmail = require('../util/sendEmail');
const { priceOrderItems, validateAddress } = require('../util/orderPricing');

function getRazorpay() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw Object.assign(new Error('Online payment is not configured. Add Razorpay test keys to backend/.env.'), { status: 503 });
  }
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}

const createOrder = async (req, res) => {
  let appOrder;
  try {
    const { items: requestedItems, address } = req.body || {};
    validateAddress(address);
    const { items, totalAmount } = await priceOrderItems(requestedItems);
    const razorpay = getRazorpay();

    appOrder = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Pending',
    });

    const gatewayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `cb_${appOrder._id}`,
      notes: { appOrderId: String(appOrder._id), userId: String(req.user._id) },
    });

    appOrder.razorpayOrderId = gatewayOrder.id;
    await appOrder.save();

    res.status(201).json({
      appOrderId: String(appOrder._id),
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: gatewayOrder.id,
      amount: gatewayOrder.amount,
      currency: gatewayOrder.currency,
      totalAmount,
    });
  } catch (error) {
    if (appOrder && !appOrder.razorpayOrderId) {
      await Order.findByIdAndDelete(appOrder._id).catch(() => {});
    }
    res.status(error.status || 500).json({ message: error.message || 'Could not start online payment.' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { appOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!appOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification details are incomplete.' });
    }

    const order = await Order.findOne({
      _id: appOrderId,
      userId: req.user._id,
      razorpayOrderId: razorpay_order_id,
      paymentMethod: 'Razorpay',
    });
    if (!order) return res.status(404).json({ message: 'Payment order not found.' });
    if (order.paymentStatus === 'Paid') return res.json({ order });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(503).json({ message: 'Online payment is not configured.' });
    const expected = crypto.createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest();
    const provided = Buffer.from(razorpay_signature, 'hex');
    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
      return res.status(400).json({ message: 'Payment signature could not be verified.' });
    }

    const razorpay = getRazorpay();
    const [gatewayOrder, payment] = await Promise.all([
      razorpay.orders.fetch(razorpay_order_id),
      razorpay.payments.fetch(razorpay_payment_id),
    ]);
    const expectedPaise = Math.round(order.totalAmount * 100);
    if (
      gatewayOrder.id !== order.razorpayOrderId
      || gatewayOrder.amount !== expectedPaise
      || gatewayOrder.currency !== 'INR'
      || String(gatewayOrder.notes?.appOrderId) !== String(order._id)
      || payment.order_id !== order.razorpayOrderId
      || payment.amount !== expectedPaise
      || payment.currency !== 'INR'
      || payment.status !== 'captured'
    ) {
      return res.status(400).json({ message: 'Payment is not captured for this order and amount.' });
    }

    order.paymentId = razorpay_payment_id;
    order.paymentStatus = 'Paid';
    await order.save();

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'CompleteBazaar - Payment and Order Confirmation',
        message: `<h2>Payment confirmed</h2><p>Hello ${req.user.name},</p><p>Your order <strong>${order._id}</strong> is confirmed.</p><p>Total paid: ₹${order.totalAmount.toLocaleString('en-IN')}</p>`,
      });
    } catch (emailError) {
      console.error('Order confirmation email could not be sent:', emailError.message);
    }

    return res.json({ order });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Could not verify payment.' });
  }
};

module.exports = { createOrder, verifyPayment };
