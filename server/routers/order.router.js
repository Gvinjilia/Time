const express = require('express');
const { getOrders, createOrder, updateOrder, getUserOrders } = require('../controllers/order.controller');
const protect = require('../middlewares/auth.middleware');
const allowedTo = require('../middlewares/roles.middleware');

const orderRouter = express.Router();

orderRouter.route('/').get(protect, allowedTo('admin', 'moderator'), getOrders).post(protect, createOrder);
orderRouter.route('/history').get(protect, getUserOrders);
orderRouter.route('/:id').patch(protect, allowedTo('admin', 'moderator'), updateOrder);

module.exports = orderRouter;