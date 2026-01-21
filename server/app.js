const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/error.controller');
const authRouter = require('./routers/auth.router');
const watchRouter = require('./routers/watch.router');
const oauthRouter = require('./routers/oauth.router');
const orderRouter = require('./routers/order.router');
const cartRouter = require('./routers/cart.router');
const stripeRouter = require('./routers/stripe.router');
const reviewRouter = require('./routers/review.router');
const userRouter = require('./routers/user.router');
const soteriaRouter = require('./routers/soteria.router');

const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// app.use(helmet());
// app.use(mongoSanitize());
// app.use(rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: 'You have reached the maximum number of attempts, please try again in 15 minutes, when the limit resets to 100'
// }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/watches', watchRouter);
app.use('/api/oauth', oauthRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/users', userRouter);
// app.use('/api/soteria', soteriaRouter);

app.use(globalErrorHandler);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('connected to MongoDB');

        app.listen(process.env.PORT, () => {
            console.log('The server is running on port', process.env.PORT);
        });
    }).catch(err => {
        console.log(err);
        process.exit(1);
    });