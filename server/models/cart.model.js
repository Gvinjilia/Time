const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Watch',
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            required: true
        }
    }],
    total: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;