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

exports.getProductFilter = async (req, res) => {
    const { minPrice, maxPrice, brand, color, rating, size, category } = req.query;
    let query = {};

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (brand) {
        query.brand = brand;
    }

    if (color) {
        query.color = color;
    }

    if (rating) {
        query.averageRating = { $gte: parseFloat(rating) };
    }

    if (size) {
        query.size = size;
    }

    if (category) {
        query.category = category; 
    }

    try {
        const products = await Product.find(query).lean();
        res.json(products);
    } catch (error) {
        console.error('Failed to fetch filtered products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error });
    }
};