const express = require('express');
const { checkoutSession, syncAllWatchesToSoteria, getPaymentStatus } = require('../controllers/soteria.controller');
const protect = require('../middlewares/auth.middleware');

const soteriaRouter = express.Router();

soteriaRouter.post('/checkout', protect, checkoutSession);
soteriaRouter.post('/sync-watches', syncAllWatchesToSoteria);
soteriaRouter.post('/payment-status/:intent', protect, getPaymentStatus);

module.exports = soteriaRouter;