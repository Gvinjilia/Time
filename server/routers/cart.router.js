const express = require('express');
const { getUserCart, addItemToCart, deleteItemFromCart, clearCart } = require('../controllers/cart.controller');
const protect = require('../middlewares/auth.middleware');

const cartRouter = express.Router();

cartRouter.route('/').get(protect, getUserCart).post(protect, addItemToCart).delete(protect, deleteItemFromCart);
cartRouter.route('/clear').delete(protect, clearCart);

module.exports = cartRouter;