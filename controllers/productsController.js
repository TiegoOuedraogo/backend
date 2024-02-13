const Product = require('../models/ProductModel');

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'product not found' }).populate('product');
        }
        res.json({
            product:product,
            price:product.price,
            description: product.description,
            images: product.images,
            reviews: product.reviews,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateProductById = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.send(updatedProduct);
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
        res.status(500).send(error); 
    }
};


//to create a product localhost:3000/api/products
//Post {
//     "name": "Sample Product",
//     "description": "This is a sample product description.",
//     "price": 19.99,
//     "inventoryCount": 100,
//     "reviews": ["5f50c31b8e7b5a3fdeabacf6", "5f50c31b8e7b5a3fdeabacf7"],
//     "category": "5f50c31b8e7b5a3fdeabacf8",
//     "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
//     "promotions": ["5f50c31b8e7b5a3fdeabacf9", "5f50c31b8e7b5a3fdeabacfa"]
// }
