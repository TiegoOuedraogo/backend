const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const userCart = await Cart.findOne({ user: id }).populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    const cartItems = userCart.items;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Invalid or missing cart items" });
    }

    const validatedCartItems = userCart.items.map(item => {
      console.log("Validated Cart Items:", validatedCartItems);
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    // Calculate the total price
    const totalPrice = validatedCartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    // Create a new order
    const order = new Order({
      user: id,
      orderDetails: validatedCartItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });


    await order.save();
    await Cart.findOneAndUpdate({ user: id }, { $set: { items: [] } });
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};


exports.checkout = async (req, res) => {
  const userId = req.user?.id;
  try {
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items',
      populate: { path: 'product', model: 'Product' }
    });
    if (!cart || cart.items.length === 0) return res.status(404).json({ message: "Cart is empty or not found" });
    let totalPrice = 0;
    cart.items.forEach(item => {
      if (item.product && item.quantity && !isNaN(item.quantity) && item.product.price && !isNaN(item.product.price.amount)) {
        totalPrice += item.quantity * item.product.price.amount;
      }
    });
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total price calculated" });
    }

    const order = new Order({
      user: userId,
      orderDetails: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price.amount
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: totalPrice,
    });

    await order.save();
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    res.status(200).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).json({ message: "Error processing checkout", error: error.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate('orderDetails.product')
      .sort({ orderedDate: -1 });
    if (!orders) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("order at 159", orderId)
    const order = await Order.findById(orderId).populate('orderDetails.product');
    console.log("order at 151", order)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { id: orderId, user: req.user.id },
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({
          message:
            "Order not found or user not authorized to update this order",
        });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
}
  exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user.id; 
  
      const order = await Order.findOneAndUpdate(
        { _id: orderId, user: userId },
        { status: 'canceled' },
        { new: true }
      ).populate('orderDetails.product');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found or user not authorized to cancel this order' });
      }
  
      res.status(200).json({ message: 'Order canceled successfully', order });
    } catch (error) {
      console.error('Error canceling order:', error);
      res.status(500).json({ message: 'Error canceling order', error: error.message });
    }
  };
  


