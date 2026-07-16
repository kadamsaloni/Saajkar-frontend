const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    category: {
        type: String,
        required: true,
        enum: ['Temple Jewelry', 'Custom Rings', 'Necklaces', 'Earrings'] 
    },
    price: {
        type: Number,
        required: [true, 'Product price is required']
    },
    materials: {
        type: [String], // e.g., ["22k Gold", "Kundan", "Ruby"]
        required: true
    },
    weightInGrams: {
        type: Number,
        required: true
    },
    dimensions: {
        type: String, // e.g., "Length: 18 inches"
    },
    careInstructions: {
        type: String,
        default: 'Store in a dry, airtight box. Keep away from perfumes and moisture.'
    },
    images: {
        type: [String], // Array of URLs for high-res model photos and macro shots
        required: true
    },
    purityCertificate: {
        type: String, // URL to hallmark certification image if applicable
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Product', productSchema);