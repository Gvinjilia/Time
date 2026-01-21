const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watch'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
        required: [true, 'rating is required']
    },
    comment: {
        type: String,
        minLength: [10, 'The minimum length of comment is 10 characters'],
        maxLength: [150, 'The maximum length of comment is 150 characters'],
        required: [true, 'comment field is required']
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;