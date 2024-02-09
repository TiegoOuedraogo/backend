
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
        }

        let itemIndex = cart.items.findIndex(item => item.product && item.product._id.toString() === productId);

        if (itemIndex > -1) {
            // Retrieve, update quantity, and save the CartItem
            let item = await CartItem.findById(cart.items[itemIndex]._id);
            item.quantity += quantity;
            await item.save();
        } else {
            // Create new CartItem, save it, and add to cart
            const newItem = new CartItem({ product: productId, quantity, price: product.price });
            await newItem.save();
            cart.items.push(newItem);
        }

        await cart.save();

        cart = await Cart.findById(cart._id).populate({
            path: 'items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        });

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

// exports.getUserCartItems = async (req, res) => {
//     const userId = req.user.id;
//     console.log("Fetching cart for user:", userId);

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // let cart = await Cart.findOne({ user: userId }).populate({
//         //     path: 'items',
//         //     populate: {
//         //       path: 'product',
//         //       model: 'Product'
//         //     }
//         // });
//         let cart = await Cart.findOne({ user: userId })
//     .populate({
//         path: 'items',
//         populate: {
//             path: 'product',
//             model: 'Product'
//         }
//     })
//     .then(cart => console.log(cart))
//     .catch(err => console.error(err))
//     .exec((err, cart) => {
//         if (err) console.error(err);
//         console.log(cart);
//     });


//         const cartItems = cart.items.map(item => ({
//             _id: item._id,
//             image: item.product.image,
//             name: item.product.name,
//             description: item.product.description,
//             quantity: item.quantity,
//             price: item.price
//         }));

//         res.status(200).json({ cartItems });
//     } catch (error) {
//         console.error('Error fetching cart items:', error);
//         res.status(500).json({ message: 'Error fetching cart items', error: error.message });
//     }
// };

exports.getUserCartItems = async (req, res) => {
    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items',
                populate: { path: 'product', model: 'Product' }
            });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItems = cart.items.reduce((acc, item) => {
            // Check if the product exists before pushing to the accumulator
            if (item.product) {
                acc.push({
                    _id: item._id,
                    image: item.product.image,
                    name: item.product.name,
                    description: item.product.description,
                    quantity: item.quantity,
                    price: item.price
                });
            }
            return acc;
        }, []);

        res.status(200).json({ cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
};



exports.updateItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    console.log("At CartController Requested product ID:", productId);

    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        const itemIndex = cart.items.findIndex(item => item.product && item.product._id.toString() === productId);
        console.log("Line 97 At CartController Available product IDs in cart:", cart.items.map(item => item.product && item.product._id.toString()));
if (itemIndex === -1) {
    console.log("Could not find item with product ID:", productId, "in cart with ID:", cart._id);
    return res.status(404).json({ message: 'Item not found in cart' });
}

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save(); 
            res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error updating item quantity:', error);
        res.status(500).json({ message: 'Error updating item quantity', error: error.message });
    }
};

exports.removeItem = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user.id;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is undefined' });
    }

    try {
        let cart = await Cart.findOne({ user: userId }).populate('items');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing the cart:', error);
        res.status(500).json({ message: 'Error clearing the cart', error: error.message });
    }
};



exports.updateItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Convert the productId string to an ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId);
        
        // Check if the cart contains the product
        const item = cart.items.find(item => item.equals(productObjectId));
        
        if (!item) {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }

        // Assuming each item is a subdocument with a quantity property
        item.quantity = quantity;
        
        await cart.save();
        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating item quantity:', error);
        return res.status(500).json({ message: 'Error updating item quantity', error: error.message });
    }
};




exports.updateItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    console.log(`Updating item quantity for user: ${userId}, product: ${productId}, new quantity: ${quantity}`);

    try {
        // Find the user's cart
        let cart = await Cart.findOne({ user: userId }).populate('items');
        if (!cart) {
            console.log('Cart not found for user:', userId);
            return res.status(404).json({ message: 'Cart not found' });
        }

        console.log(`Found cart with ${cart.items.length} items for user: ${userId}`);

        // Find the cart item to update
        let itemToUpdate = cart.items.find(item => item.product.toString() === productId);

        if (!itemToUpdate) {
            console.log('Product not found in the cart:', productId);
            return res.status(404).json({ message: 'Product not found in the cart' });
        }

        console.log(`Found item to update: ${itemToUpdate._id}, current quantity: ${itemToUpdate.quantity}`);

        // Update the quantity
        itemToUpdate.quantity = Math.max(2, quantity); // Ensure minimum quantity of 2
        console.log(`Updated quantity for item: ${itemToUpdate._id}, new quantity: ${itemToUpdate.quantity}`);

        // Optionally, recalculate the price if necessary
        // console.log(`Old price: ${itemToUpdate.price}`);
        // itemToUpdate.price = itemToUpdate.quantity * <pricePerUnit from Product model>;
        // console.log(`New price: ${itemToUpdate.price}`);

        await itemToUpdate.save();
        console.log(`Saved item with updated quantity: ${itemToUpdate._id}`);

        // Re-fetch the cart to return the updated cart information to the client
        cart = await Cart.findOne({ user: userId }).populate({
            path: 'items',
            populate: { path: 'product', model: 'Product' }
        });

        console.log(`Returning updated cart for user: ${userId}`);
        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating item quantity:', error);
        return res.status(500).json({ message: 'Error updating item quantity', error: error.message });
    }
};
