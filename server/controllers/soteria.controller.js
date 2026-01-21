// const Cart = require("../models/cart.model");
// const catchAsync = require("../utils/catchAsync");
// const Watch = require("../models/watch.model");
// const soteria = require('soteria-sdk');

// soteria.configure(process.env.SOTERIA_PUBLIC_KEY, process.env.SOTERIA_SECRET_KEY);

// const checkoutSession = catchAsync(async (req, res, next) => {
//     const cart = await Cart.findOne({ userId: req.user._id }).populate("cart.product");

//     if(!cart || cart.cart.length === 0){
//         return next(new AppError('Cart is empty', 404));
//     };

//     const soteriaCart = cart.cart.map(item => ({
//         name: item.product.name,
//         price: item.product.price * 100,
//         quantity: item.quantity
//     }));

//     const { clientSecret, amount } = await soteria.createCheckout(soteriaCart);

//     res.json({
//         clientSecret,
//         amount,
//         url: `https://soteria-client.onrender.com/checkout/${clientSecret}`
//     });
// });

// const syncAllWatchesToSoteria = catchAsync(async (req, res, next) => {
//     const allWatches = await Watch.find();

//     const watches = allWatches.map((watch) => ({
//         id: watch._id.toString(),
//         price: watch.price * 100,
//         name: watch.name
//     }));

//     const result = await soteria.syncCatalog(watches);

//     res.status(200).json({
//         success: true
//     });
// });

// module.exports = { checkoutSession, syncAllWatchesToSoteria };