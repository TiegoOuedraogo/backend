const Order = require("../models/OrderMoldel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

// Create a new order
exports.createOrder = async (req, res) => {
  console.log("Received order data:", req.body);

  try {
    const { shippingAddress, paymentMethod } = req.body;
    const {id} = req.user;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the user's cart
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
      console.log("Invalid or missing cart items:", cartItems);
      return res.status(400).json({ message: "Invalid or missing cart items" });
    }

    const validatedCartItems = userCart.items.map(item => {
      console.log("Validated Cart Items:", validatedCartItems);
      return {
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });
    
    // Calculate the total price
    const totalPrice =  validatedCartItems.reduce(
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

// Clear the user's cart after successful order creation
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
  console.log('Checkout Request Body:', req.body);
  console.log('User from token:', req.user);

  try {
    if (!req.user || !req.user.id) {
      console.log('User not authenticated.');
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;
    console.log('User ID from token:', userId);
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      console.log('Your cart is empty');
      return res.status(404).json({ message: "Cart not found" });
    }

    // Create a new Order object from the cart data
    const order = new Order({
      user: userId, 
      product: cart.product, 
      price: cart.price,
      quantity: cart.quantity 
    });

    const savedOrder = await order.save();
    console.log('cart created successfully.');

    res.status(200).json({ message: "cart created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).json({ message: "Error processing checkout", error: error.message });
  }
};

// Retrieves all orders for the authenticated user
exports.listOrders = async (req, res) => {
  try {
    const {id} = req.user;
    const orders = await Order.find({ user: id })
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('orderDetails.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// Updates the status of a specific order
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
};



//create Order use Post localhost:3000/api/orders
// {
//   "productId": "5f63a36c7d3f5b23b6e6e21a",
//   "shippingAddress": {
//     "street": "123 Elm St",
//     "city": "Springfield",
//     "state": "IL",
//     "zip": "62704",
//     "country": "USA"
//   },
//   "paymentMethod": "Credit Card"
// }
