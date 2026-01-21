const express = require('express');
const protect = require('../middlewares/auth.middleware');
const { checkoutSession, confirm } = require('../controllers/stripe.controller');

const stripeRouter = express.Router();

stripeRouter.post('/checkout', protect, checkoutSession);
stripeRouter.post('/confirm/:sessionId', protect, confirm);

module.exports = stripeRouter;