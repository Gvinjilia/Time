const Cart = require("../models/cart.model");
const Watch = require("../models/watch.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const getUserCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('cart.product');

    if(!cart){
        return next(new AppError('Cart not found', 404));
    };

    res.status(200).json(cart);
});

const addItemToCart = catchAsync(async (req, res, next) => {
    const { watchId } = req.body;

    const product = await Watch.findById(watchId);

    if(!product){
        return next(new AppError('Product not found', 404));
    };
    
    const item = {
        product: product._id,
        price: parseInt(product.price),
        quantity: 1
    };

    let userCart = await Cart.findOne({ userId: req.user._id });

    if(userCart){
        const exists = userCart.cart.find((p) => p.product.toString() === item.product.toString());

        if(exists){
            exists.quantity++;
        } else {
            userCart.cart.push(item);
        }

        userCart.total = userCart.cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

        await userCart.save();

        userCart = await Cart.findById(userCart._id).populate('cart.product');
        res.status(200).json(userCart);
    } else {
        const total = item.price * item.quantity;

        const newCart = await Cart.create({
            userId: req.user._id,
            cart: [item],
            total
        });

        const populated = await Cart.findById(newCart._id).populate('cart.product');

        res.status(201).json(populated);
    }
});

const deleteItemFromCart = catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    if(!cart){
        return next(new AppError('Cart not found', 404));
    };

    const exists = cart.cart.find((p) => p.product._id.toString() === id);

    if(exists){
        if(exists.quantity > 1){
            exists.quantity--;
        } else {
            cart.cart = cart.cart.filter((item) => item.product._id.toString() !== id);
        }
    };

    cart.total = cart.cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

    await cart.save();

    const populated = await Cart.findById(cart._id).populate('cart.product');

    res.status(200).json(populated);
});

const clearCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if(!cart){
        return next(new AppError('Cart not found', 404));
    };

    cart.cart = [];

    cart.total = 0;

    await cart.save();

    const populated = await Cart.findById(cart._id).populate('cart.product');

    res.status(200).json(populated);
});

module.exports = { getUserCart, addItemToCart, deleteItemFromCart, clearCart };