const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { checkoutSession } = require("./stripe.controller");

const getOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json(orders);
});

const getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user._id });

    if(orders.length === 0) {
        return next(new AppError("Orders not found!", 404));
    }

    res.status(200).json(orders);
});

const createOrder = catchAsync(async (req, res, next) => {
    const { paymentMethod, shippingAddress } = req.body;

    if(paymentMethod === 'cash'){
        const cart = await Cart.findOne({ userId: req.user._id }).populate("cart.product");

        if(!cart || cart.cart.length === 0){
            return next(new AppError('Cart not found!', 404));
        };
        
        const items = cart.cart.map((item) => {
            if(!item.product){
                return next(new AppError('Product not found', 404));
            };

            return {
                product: item.product._id,
                price: item.product.price,
                quantity: item.quantity,
            };
        });

        const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const newOrder = await Order.create({
            userId: req.user._id,
            items,
            totalPrice,
            paymentMethod,
            shippingAddress
        });

        cart.cart = [];
        cart.total = 0;
        await cart.save();

        res.status(201).json(newOrder);
    } else {
        checkoutSession(req, res, next);
    }
});

const updateOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
        return next(new AppError("Order not found", 404));
    }

    const valid = ["pending", "shipped", "paid", "delivered", "cancelled"];

    if (status && !valid.includes(status)) {
        return next(new AppError("invalid status", 400));
    }

    if (status) order.status = status;

    await order.save();

    res.status(200).json(order);
});

module.exports = { getOrders, getUserOrders, createOrder, updateOrder };