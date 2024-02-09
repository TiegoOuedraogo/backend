const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      },
    description: String,
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    images: [String],
    inventoryCount: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    promotions: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }]
  });
  
  module.exports = mongoose.model('Product', productSchema);
  
  