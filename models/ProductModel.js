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
    required: false, 
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  // uniqueIdentifier: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
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
  images: [String], 
  variants: [{
    size: String,
    color: String,
    material: String
  }],
  reviews: [{
    customer: String, 
    rating: Number,
    testimonial: String,
  }],
  promotions: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }] 
});

module.exports = mongoose.model('Product', productSchema);
