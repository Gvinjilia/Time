const Review = require("../models/review.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json(reviews);
});

const getReviews = catchAsync(async (req, res, next) => {
    const { watchId } = req.params;

    const reviews = await Review.find({ productId: watchId });

    res.status(200).json(reviews);
});

const getReview = catchAsync(async (req, res, next) => {
    const { watchId, reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, productId: watchId });

    if(!review){
        return next(new AppError('Review not found', 404));
    };

    res.status(200).json(review);
});

const createReview = catchAsync(async (req, res, next) => {
    const { watchId } = req.params;
    const { comment, rating } = req.body;

    const newReview = await Review.create({
        userId: req.user._id,
        productId: watchId,
        rating,
        comment
    });

    res.status(201).json(newReview);
});

const updateReview = catchAsync(async (req, res, next) => {
    const { watchId, reviewId } = req.params;
    const { comment, rating } = req.body;

    const review = await Review.findOne({ _id: reviewId, productId: watchId });

    if(!review){
        return next(new AppError('Review not found', 404));
    };

    if(review.userId.toString() !== req.user._id.toString()){
        return next(new AppError("You can't update others reviews", 400));
    };

    if(comment) review.comment = comment;
    if(rating) review.rating = rating;

    await review.save();

    res.status(200).json(review);
});

const deleteReview = catchAsync(async (req, res, next) => {
    const { watchId, reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, productId: watchId });

    if(!review){
        return next(new AppError('Review not found', 404));
    };

    await review.deleteOne();

    res.status(204).send();
});

module.exports = { getAllReviews, getReviews, getReview, createReview, updateReview, deleteReview };