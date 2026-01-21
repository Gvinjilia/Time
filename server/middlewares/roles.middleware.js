const AppError = require("../utils/AppError")

const allowedTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have a permission', 401));
        };

        next();
    };
};

module.exports = allowedTo;