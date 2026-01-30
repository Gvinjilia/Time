const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");

const crypto = require('crypto');

const createSendToken = (user, statusCode, res) => {
    const token = user.signToken();

    const cookieOptions = {
        httpOnly: true,
        secure: true, 
        sameSite: 'None',
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    };

    user.password = undefined;

    res.cookie('lg', token, cookieOptions);

    res.status(statusCode).json(user);
};

const signup = catchAsync(async (req, res, next) => {
    const { fullname, email, password } = req.body;

    const user = await User.findOne({ email });

    if(user){
        return next(new AppError('Email already registered', 400));
    };

    const newUser = await User.create({
        fullname,
        email, 
        password
    });

    const code = await newUser.createVerificationCode();

    await newUser.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get("host")}/api/auth/verify/${code}`;

    await sendEmail(email, 'TIME Watches', `
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" rel="stylesheet">
        </head>
        <div style="margin-left: 50px;">
            <div style="width: 500px">
                <img src="https://tidwatches.com/cdn/shop/files/INS1103.jpg?v=1717037695&width=750" style="height: 200px; width: 500px; object-fit: cover; margin-bottom: 5px" />
                <p style="font-family: 'Major Mono Display', monospace; font-size: 18px; margin-bottom: 5px">TIME WATCHES</p>
                <p style="font-family: 'Roboto', Helvetica, Arial, sans-serif; margin-bottom: 5px">Every timepiece that moves through the Time Watches exchange is a testament to material science. We have centered our brand identity around Grade 5 Titanium—a material born in the aerospace industry and perfected for the wrist. Our marketplace prioritizes these builds because they represent the pinnacle of wearable endurance. Titanium is 45% lighter than steel and possesses the highest strength-to-weight ratio of any metal. It is scratch-resistant, hypoallergenic, and impervious to the salt and sweat of an active life. When you buy a "Titanium Body" through our platform, you are investing in a frame that is built to survive the decades.</p>
            </div>

            <button style="background-color: black; width: 500px; padding: 10px; border: none; border-radius: 2px"><a href='${url}' style="text-decoration: none; color: white">Verify Email</a></button>
        </div>
    `);

    res.status(201).json({
        message: 'account created successfully'
    });
});

const verifyEmail = catchAsync(async (req, res, next) => {
    const { code } = req.params;

    const user = await User.findOne({ verificationCode: code });

    if(!user){
        return next(new AppError('The code is incorrect'));
    }

    user.isVerified = true,
    user.verificationCode = undefined;

    await user.save()

    res.status(200).send('<h1>User verified</h1>');
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new AppError('email or password incorrect', 401))
    };

    const correct = await user.comparePasswords(password, user.password);

    if(!correct){
        return next(new AppError('email or password incorrect', 401));
    };

    user.password = undefined;

    createSendToken(user, 201, res);
});

const logout = catchAsync(async (req, res, next) => {
    res.clearCookie('lg');

    res.status(200).send();
});

const forgotPass = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if(!user){
        return next(new AppError('email is incorrect!', 404));
    };

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPassToken = token;
    user.resetPassExpires = Date.now() + process.env.RESET_PASS_EXPIRES * 60 * 1000;

    await user.save();

    const reset = process.env.CLIENT_URL + `/reset-password/${token}`;

    await sendEmail(user.email, 'TIME Watches',
        `<head>
            <link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" rel="stylesheet">
        </head>
        <div style="margin-left: 50px;">
            <div style="width: 500px">
                <img src="https://tidwatches.com/cdn/shop/files/INS1103.jpg?v=1717037695&width=750" style="height: 200px; width: 500px; object-fit: cover;" />
                <p style="font-family: 'Major Mono Display', monospace; font-size: 18px;">TIME WATCHES</p>
                <p>Hi, ${user.fullname}, You have requested to reset your timeWatches password. Please click the button below to reset your password.</p>
                <p>We received a request to reset the password for your Time Watches account. If you requested this change, please follow the instructions in the email to create a new password. If you did not request a password reset, you can safely ignore this message and your account will remain secure. For security, we recommend using a strong and unique password that you haven’t used on other websites. Thank you for being a valued member of the Time Watches community. The Time Watches</p>
            </div>
            <div>
                <button style="background-color: black; width: 500px; padding: 10px; border: none; border-radius: 2px"><a href='${reset}' style="text-decoration: none; color: white">Reset Password</button>
            </div>
        </div>`
    );

    res.status(200).json({
        message: 'Sent!'
    });
});

const resetPass = catchAsync(async (req, res, next) => {
    const { token, newPass } = req.body;

    const user = await User.findOne({ resetPassToken: token });

    if(!user){
        return next(new AppError('Invalid Token', 404));
    };

    user.password = newPass;

    user.resetPassToken = undefined;
    user.resetPassExpires = undefined;

    await user.save();

    res.status(200).json({
        message: 'Password updated successfully'
    });
});

const autoLogin = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    
    res.status(200).json(user);
});

module.exports = { signup, login, logout, verifyEmail, autoLogin, resetPass, forgotPass };