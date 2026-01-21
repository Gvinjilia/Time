const express = require('express');
const { getWatches, createWatch, getWatch, updateWatch, deleteWatch } = require('../controllers/watch.controller');
const upload = require('../config/uploadImage');
const protect = require('../middlewares/auth.middleware');
const allowedTo = require('../middlewares/roles.middleware');

const watchRouter = express.Router();

watchRouter.route('/').get(getWatches).post(protect, allowedTo('admin', 'moderator'), upload.array('images', 4), createWatch);
watchRouter.route('/:id').get(getWatch).patch(protect, upload.array('images', 4), allowedTo('admin', 'moderator'), updateWatch).delete(protect, allowedTo('admin'), deleteWatch);

module.exports = watchRouter;