const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name field is required']
    },
    category: {
        type: String,
        required: [true, 'category is required']
    },
    brand: {
        type: String,
        required: [true, 'brand is required']
    },
    price: {
        type: Number,
        required: [true, 'price field is required']
    },
    description: {
        type: String,
        required: [true, 'description field is required'],
        minLength: [20, 'description should contain minimum 20 characters'],
        maxLength: [500, 'maximum number of characters is 500']
    },
    gender: {
        type: String,
        required: [true, 'gender field is required'],
        default: 'unisex'
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ]
}, { timestamps: true });

const Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch;