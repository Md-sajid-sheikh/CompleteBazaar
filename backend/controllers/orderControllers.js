const Order = require('../model/Order');
const sendEmail = require('../util/sendEmail');
const { priceOrderItems, validateAddress } = require('../util/orderPricing');

const addOrderItems = async (req, res) => {
  try {
    const { items: requestedItems, address } = req.body || {};
    validateAddress(address);
    const { items, totalAmount } = await priceOrderItems(requestedItems);
    const createdOrder = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod: 'COD',
      paymentStatus: 'COD',
    });

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'CompleteBazaar - Order Confirmation',
        message: `<h2>Order Confirmation</h2><p>Hello ${req.user.name},</p><p>Your cash-on-delivery order <strong>${createdOrder._id}</strong> is confirmed.</p><p>Total: ₹${totalAmount.toLocaleString('en-IN')}</p><p>Delivering to: ${address.street}, ${address.city}</p>`,
      });
    } catch (emailError) {
      console.error('Order confirmation email could not be sent:', emailError.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'id name')
      .populate('items.productId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
