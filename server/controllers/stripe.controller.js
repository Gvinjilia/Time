const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const checkoutSession = catchAsync(async (req, res, next) => {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id }).populate("cart.product");

    if(!cart || cart.cart.length === 0){
        return next(new AppError('Cart is empty', 404));
    };

    const items = cart.cart.map(item => {
        if(!item.product){
            return next(new AppError('Product not found', 404));
        };

        return {
            product: item.product._id,
            price: item.product.price,
            quantity: item.quantity,
        };
    });

    const line_items = cart.cart.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.product.name,
                description: item.product.description,
            },
            unit_amount: item.product.price * 100
        },
        quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items,
        success_url: `http://localhost:5173/orders?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173`,
        metadata: {
            userId: req.user._id.toString(),
            shippingAddress: JSON.stringify(shippingAddress), 
            items: JSON.stringify(items)
        }
    });

    res.json({
        session_url: session.url
    });
});

const confirm = catchAsync(async (req, res, next) => {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if(session.payment_status !== 'paid'){
        return next(new AppError('Payment not completed', 400));
    };

    const existingOrder = await Order.findOne({ stripeSessionId: session.id });
    
    if(existingOrder){
        return res.status(200).json({
            message: 'Order already exists',
            order: existingOrder
        });
    };

    const userId = session.metadata.userId;
    const items = JSON.parse(session.metadata.items);
    const shippingAddress = JSON.parse(session.metadata.shippingAddress);
    const totalPrice = session.amount_total / 100;

    const newOrder = await Order.create({
        userId,
        items,
        totalPrice,
        paymentMethod: 'stripe',
        shippingAddress,
        status: 'paid'
    });

    await Cart.findOneAndUpdate({ userId }, {
        cart: [],
        total: 0
    });

    res.status(201).json({
        message: 'Well success i guess'
    });
});

module.exports = { checkoutSession, confirm };