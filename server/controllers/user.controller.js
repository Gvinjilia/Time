const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json(users);
});

const getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if(!user){
        return next(new AppError('User not found', 404));
    };

    res.status(200).json(user);
});

const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'admin', 'moderator'];

    const user = await User.findById(id);

    if(!user){
        return next(new AppError('User not found', 404));
    };

    if(!validRoles.includes(role)){
        return next(new AppError('User role should be valid in order to be changed', 400));
    };

    user.role = role;

    await user.save();

    res.status(200).json(user);
});

const updateUserData = catchAsync(async (req, res, next) => {
    const { fullname, email, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if(!user){
        return next(new AppError('User not found!', 404));
    };

    const correct = await user.comparePasswords(oldPassword, user.password);

    if(oldPassword.trim() !== ''){
        if(!correct){
            return next(new AppError('The old password you entered is incorrect!', 400));
        };
    };

    if(oldPassword.trim() === newPassword.trim()){ // trim - ით მოვაშრეთ ზედმეტი space - ები, როდესაც მომხმარებელი old password field - ში შემოიტანს
        // 'Nino1234  ' და ახალ password field - ში 'Nino1234' შემოწმდება მსგავსად 'Nino1234  '.trim() ---> 'Nino1234' === 'Nino1234' რის შემდეგაც გაეშვება
        return next(new AppError("You new password cannot be the same as your old password")); // დაგვიბრუნდება errpr
    };

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (newPassword && newPassword !== '') user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json(user);
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if(!user){
        return next(new AppError('User not found', 404));
    };

    res.status(204).send();
});

module.exports = { getUser, getUsers, updateUser, updateUserData, deleteUser };