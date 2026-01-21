const express = require('express');
const protect = require('../middlewares/auth.middleware');
const allowedTo = require('../middlewares/roles.middleware');
const { getUsers, getUser, updateUser, deleteUser, updateUserData } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.route('/').get(protect, allowedTo('admin', 'moderator'), getUsers).patch(protect, updateUserData);
userRouter.route('/:id').get(protect, allowedTo('admin', 'moderator'), getUser).patch(protect, allowedTo('admin', 'moderator'), updateUser).delete(protect, allowedTo('admin', 'moderator'), deleteUser);

module.exports = userRouter;