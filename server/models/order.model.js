const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [{
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
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'paid', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String
    },
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;