const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
    name: String,
    description: String,
    discountPercentage: Number,
    startDate: Date,
    endDate: Date,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  });
  
  module.exports = mongoose.model('Promotion', promotionSchema);
  
  