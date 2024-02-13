// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const productSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//         maxlength: 100
//       },
//     description: String,
//     price: { type: Number, required: true },
//     category: { type: Schema.Types.ObjectId, ref: 'Category' },
//     images: [String],
//     inventoryCount: Number,
//     reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
//     promotions: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }]
//   });
  
//   module.exports = mongoose.model('Product', productSchema);
  
  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: false, // Set to true if this information is always available
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  uniqueIdentifier: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    short: { type: String, required: true },
    long: { type: String, required: true }
  },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
  },
  inventory: {
    sku: { type: String, required: true },
    count: { type: Number, required: true }
  },
  images: [String], // Assuming this can include URLs to high-quality and 360-degree view images
  variants: [{
    size: String,
    color: String,
    material: String
  }],
  reviews: [{
    customer: String, // Assuming a simple structure; consider referencing a User model in a real application
    rating: Number,
    testimonial: String,
  }],
  promotions: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }] // Assuming you want to keep promotional data linked but not detailed in this schema
});

module.exports = mongoose.model('Product', productSchema);
