const express = require('express');
const { signup, login, logout, autoLogin, verifyEmail, forgotPass, resetPass } = require('../controllers/auth.controller');
const protect = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

authRouter.post('/autoLogin', protect, autoLogin);

authRouter.get('/verify/:code', verifyEmail);

authRouter.post('/forgot-password', forgotPass);
authRouter.post('/reset-password', resetPass);

module.exports = authRouter;