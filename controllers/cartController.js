const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');
const Product = require('../models/ProductModel');
const mongoose = require('mongoose');

    exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity provided' });
    }

    try {
        let cart = await Cart.findOne({ user: userId }).populate('items') || new Cart({ user: userId, items: [] })
        console.log("cart line 16", cart)
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
           console.log("product at 22", product)
        // let item = await CartItem.findOne({ product: productId, cart: cart._id });
        let item = cart.items.find((item)=>{

            return item.product.toString() === productId
        })
        
        console.log("cart line 28", item)
        if (item) {
            item = await CartItem.findOne({ _id: item._id});
            item.quantity += quantity;
        } else {
            item = new CartItem({
                product: productId,
                quantity,
                price: product.price 
            });
            console.log("line 37 item" , item)
            cart.items.push(item);
        }
        await item.save();
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

exports.getUserCartItems = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ user: userId })
        .populate({
            path: 'items',
            populate: { path: 'product', model: 'Product' }
        });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const cartItems = cart.items.map(item => ({
            _id: item._id,
            images: item.product.images,
            name: item.product.name,
            description: item.product.description,
            quantity: item.quantity,
            price: item.price
        })).filter(item => item !== null);

        res.status(200).json({ cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
};



exports.updateItemQuantity = async (req, res) => {
    console.log('Request body:', req.body);
    const { productId: cartItemId, quantity } = req.body; 
    console.log(`Updating item quantity for cartItemId: ${cartItemId}, new quantity: ${quantity}`);
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.log('Cart not found for user:', userId);
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemToUpdate = await CartItem.findById(cartItemId);
        if (!itemToUpdate || !cart.items.includes(itemToUpdate._id)) {
            console.log('Cart item not found in the cart:', cartItemId);
            return res.status(404).json({ message: 'Cart item not found in the cart' });
        }

        console.log(`Found CartItem to update: ${itemToUpdate._id}, current quantity: ${itemToUpdate.quantity}`);
        
        itemToUpdate.quantity = Math.max(1, quantity);
        await itemToUpdate.save();
        console.log(`Updated quantity for CartItem: ${itemToUpdate._id}, new quantity: ${itemToUpdate.quantity}`);

        
        const updatedCart = await Cart.findOne({ user: userId }).populate({
            path: 'items',
            populate: { path: 'product', model: 'Product' }
        });

        console.log('Returning updated cart for user:', userId);
        return res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return res.status(500).json({ message: 'Error updating cart item quantity', error: error.message });
    }
};

exports.removeItem = async (req, res) => {
    const { productId } = req.params; 
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            console.log(`No cart found for user: ${userId}`);
            return res.status(404).json({ message: 'Cart not found' });
        }

        //if the item exists and belongs to the cart before attempting to remove it
        const item = await CartItem.findById(productId);
        if (!item) {
            console.log(`CartItem not found by ID: ${productId}`);
            return res.status(404).json({ message: 'CartItem not found' });
        }

        if (!cart.items.includes(item._id)) {
            console.log(`CartItem ${productId} does not belong to the user's cart`);
            return res.status(404).json({ message: 'Item not found in this cart' });
        }

        // Proceed to remove the item
        cart.items.pull(item._id);
        await cart.save();
        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = [];
        await cart.save();
        return res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing the cart:', error);
        return res.status(500).json({ message: 'Error clearing the cart', error: error.message });
    }
};

