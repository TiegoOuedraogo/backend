const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orderedDate: { 
      type: Date, 
      default: Date.now 
    },
    shippedDate: Date,
    status: String,
    totalPrice: Number,
    orderDetails: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }]
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  

  
  