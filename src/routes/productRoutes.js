const express = require('express');
const Product = require('../models/Product'); // Import your Product model
const router = express.Router();

// @route   POST /api/products
// @desc    Create a new jewelry product
router.post('/', async (req, res) => {
    try {
        const { 
            name, description, category, price, materials, 
            weightInGrams, dimensions, images 
        } = req.body;

        const newProduct = new Product({
            name, description, category, price, materials, 
            weightInGrams, dimensions, images
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({ 
            message: "Jewelry piece successfully added to the catalog!", 
            product: savedProduct 
        });

    } catch (error) {
        console.error("Product Creation Error:", error.message);
        res.status(500).json({ message: "Failed to upload product to the database." });
    }
});

// @route   GET /api/products
// @desc    Fetch all jewelry products for the storefront
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ message: "Failed to fetch catalog." });
    }
});

module.exports = router;