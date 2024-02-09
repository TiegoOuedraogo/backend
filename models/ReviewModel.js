const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: Number,
    text: String,
    createdAt: { type: Date, default: Date.now },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  });
  
  module.exports = mongoose.model('Review', reviewSchema);
  
  