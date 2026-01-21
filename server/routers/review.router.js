const express = require('express');
const { getReviews, updateReview, deleteReview, getReview, createReview, getAllReviews } = require('../controllers/review.controller');
const allowedTo = require('../middlewares/roles.middleware');
const protect = require('../middlewares/auth.middleware');

const reviewRouter = express.Router();

reviewRouter.get('/', getAllReviews);
reviewRouter.route('/:watchId').get(protect, getReviews).post(protect, createReview);
reviewRouter.route('/:watchId/:reviewId').get(protect, allowedTo('admin', 'moderator'), getReview).delete(protect, allowedTo('admin', 'moderator'), deleteReview).patch(protect, allowedTo('user'), updateReview);

module.exports = reviewRouter;