const Cart = require("../models/cart.model");
const catchAsync = require("../utils/catchAsync");
const Watch = require("../models/watch.model");
const AppError = require("../utils/appError");
const Order = require("../models/order.model");

const checkoutSession = catchAsync(async (req, res, next) => {
    const { soteria } = await import("soteria-sdk");

    soteria.configure(process.env.SOTERIA_PUBLIC_KEY, process.env.SOTERIA_SECRET_KEY);

    const cart = await Cart.findOne({ userId: req.user._id }).populate("cart.product");

    if(!cart || cart.cart.length === 0){
        return next(new AppError('Cart is empty', 404));
    };

    const soteriaCart = cart.cart.map(item => ({
        name: item.product.name,
        price: item.product.price * 100,
        quantity: item.quantity
    }));

    const { clientSecret, amount } = await soteria.createCheckout(soteriaCart, {
        success_url: `${process.env.CLIENT_URL}/orders`
    });

    const successUrl = `${process.env.CLIENT_URL}/orders?intent=${clientSecret}`;

    res.json({
        clientSecret,
        amount,
        successUrl,
        url: `https://soteria-client.onrender.com/checkout/${clientSecret}`
    });
});

const getPaymentStatus = catchAsync(async (req, res, next) => {
    const { shippingAddress } = req.body;

    const { intent } = req.params;

    const response = await fetch(`https://soteria-q27e.onrender.com/api/v1/payment-intent/${intent}`, {
        headers: { 
            'Content-Type': 'application/json' 
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        return next(new AppError(error.msg || 'Failed to fetch payment status', 400));
    };

    const data = await response.json();

    if(data.status !== 'succeeded'){
        return next(new AppError('Payment not completed', 400));
    };

    const userId = req.user._id.toString();

    const newOrder = await Order.create({
        userId,
        items: data.items,
        totalPrice: data.amount / 100,
        paymentMethod: 'soteria',
        shippingAddress,
        status: 'paid'
    });

    await Cart.findOneAndUpdate({ userId }, {
        cart: [],
        total: 0
    });

    res.status(200).json({
        message: 'Your order was added to orders section!'
    });
});

const syncAllWatchesToSoteria = catchAsync(async (req, res, next) => {
    const { soteria } = await import("soteria-sdk");
    
    soteria.configure(process.env.SOTERIA_PUBLIC_KEY, process.env.SOTERIA_SECRET_KEY);

    const allWatches = await Watch.find();

    const watches = allWatches.map((watch) => ({
        id: watch._id.toString(),
        price: watch.price * 100,
        name: watch.name
    }));

    const result = await soteria.syncCatalog(watches);

    res.status(200).json({
        success: true
    });
});

module.exports = { checkoutSession, syncAllWatchesToSoteria, getPaymentStatus };