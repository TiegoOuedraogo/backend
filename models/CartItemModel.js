//CartItemModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
      }
});


const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;

