const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const CartItem = require('../models/CartItemModel');
const Cart = require ('../models/CartModel');
const Category = require ('../models/CategoryModel');
const Comment = require ('../models/CommentModel');
const Promotion = require ('../models/PromotionModel');
const Review = require ('../models/ReviewModel');
const UserSetting = require ('../models/UserSettingsModel');


exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log("creating a new user error",error)
        res.status(500).send({ message: 'Error creating user', error: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching users', error: error.message });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting user', error: error.message });
    }
};

exports.updateUserById = async (req, res) => {
    console.log(" line 46user req.body")

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            console.log(" line 50updating user",updatedUser)
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(updatedUser);
    } catch (error) {
        console.log("line 57 updated user",error) 
        res.status(400).send(error);
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'user not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createProduct = async (req, res) => {
    try {
        const uniqueIdentifier = req.body.uniqueIdentifier || generateUniqueIdentifier();

        const newProduct = new Product({
            name: req.body.name,
            brand: req.body.brand,
            manufacturer: req.body.manufacturer,
            category: req.body.category,
            uniqueIdentifier: uniqueIdentifier, 
            description: req.body.description,
            price: req.body.price,
            inventory: req.body.inventory,
            images: req.body.images,
        });

        console.log("Before saving the new product", newProduct);
        await newProduct.save();
        console.log("After saving the new product", newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        console.log("Saving new product error", error);
        res.status(500).send({ message: 'Error creating product', error: error.message });
    }
};

function generateUniqueIdentifier() {
    return `UID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching products', error: error.message });
    }
};

exports.updateProductById = async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateProduct) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(updateProduct);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.send({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting product', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(500).send({ message: 'Error fetching product', error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).send({ message: 'Error creating Order', error: error.message });
    }
};
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateOrderById = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.send(updatedOrder);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user');
        res.json(orders);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching orders', error: error.message });
    }
};

exports.deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.send({ message: 'Order deleted successfully', deletedOrder });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting order', error: error.message });
    }
};


exports.createUserCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id; 

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            // If the user doesn't have a cart, create one
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if the item is already in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            // If so, update the quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // If not, add a new item
            const newItem = { product: productId, quantity };
            cart.items.push(newItem);
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).send({ message: 'Error adding item to cart', error: error.message });
    }
};

exports.getUserCartItems = async (req, res) => {
    const userId = req.user._id; 

    try {
        const cart = await Cart.findOne({ user: userId }).populate({
            path: 'items.product',
            model: 'Product'
        });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        res.json(cart.items);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching cart items', error: error.message });
    }
};

exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find({}).populate('product');
        res.json(cartItems);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching cart items', error: error.message });
    }
};

exports.deleteCartItemById = async (req, res) => {
    try {
        const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);
        if (!deletedCartItem) {
            return res.status(404).send({ message: 'Cart item not found' });
        }
        res.send({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting cart item', error: error.message });
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    const { cartItemId, quantity } = req.body; 
    const userId = req.user._id; 

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);
        if (itemIndex === -1) {
            return res.status(404).send({ message: 'Cart item not found' });
        }

        // Update the quantity of the item
        cart.items[itemIndex].quantity = quantity;

        // Save the updated cart
        await cart.save();
        
        //populate product details before sending the response
        const updatedCart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            model: 'Product'
        });

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).send({ message: 'Error updating cart item quantity', error: error.message });
    }
};

exports.createCart = async (req, res) => {
    const { user, items } = req.body;
    try {
        const newCart = new Cart({ user, items });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).send({ message: 'Error creating cart', error: error.message });
    }
};

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find({}).populate('user items.product');
        res.json(carts);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching carts', error: error.message });
    }
};

exports.getCartById = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findById(id).populate('user items');
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching cart', error: error.message });
    }
};

exports.updateCartById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCart = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate('user items');
        if (!updatedCart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        res.json(updatedCart);
    } catch (error) {
        res.status(500).send({ message: 'Error updating cart', error: error.message });
    }
};

exports.deleteCartById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCart = await Cart.findByIdAndDelete(id);
        if (!deletedCart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        res.send({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting cart', error: error.message });
    }
};


exports.createCategory = async (req, res) => {
    const { name } = req.body; 

    try {
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).send({ message: 'Error creating category', error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching categories', error: error.message });
    }
};


exports.getCategoryById = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching category', error: error.message });
    }
};


exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body; 

    try {
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
        if (!updatedCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).send({ message: 'Error updating category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.send({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting category', error: error.message });
    }
};



exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate('user review');
        res.json(comments);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching comments', error: error.message });
    }
};
exports.createReview = async (req, res) => {
    const { productId, userId, rating, comment } = req.body;

    try {
        const newReview = new Review({
            product: productId,
            user: userId,
            rating,
            comment
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).send({ message: 'Error creating review', error: error.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('user product');
        res.json(reviews);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching reviews', error: error.message });
    }
};

exports.getReviewById = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId).populate('user product');
        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching review', error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
        if (!updatedReview) {
            return res.status(404).send({ message: 'Review not found' });
        }
        res.json(updatedReview);
    } catch (error) {
        res.status(500).send({ message: 'Error updating review', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).send({ message: 'Review not found' });
        }
        res.send({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting review', error: error.message });
    }
};

exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({});
        res.json(promotions);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching promotions', error: error.message });
    }
};


exports.getAllUserSettings = async (req, res) => {
    try {
        const userSettings = await UserSetting.find({});
        res.json(userSettings);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching user settings', error: error.message });
    }
};

