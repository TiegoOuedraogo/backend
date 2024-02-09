//CartModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true },
    items: [{ 
        type: Schema.Types.ObjectId,
        ref: 'CartItem' 
    }],
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;


// At CartController Requested product ID: 65c30f3689b4bb97bdd07366
// Line 97 At CartController Available product IDs in cart: [ undefined, undefined ]
// Could not find item with product ID: 65c30f3689b4bb97bdd07366 in cart with ID: new ObjectId('65c30f3689b4bb97bdd07364')