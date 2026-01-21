const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'something went wrong'
    });
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    if(process.env.NODE_ENV === 'dev'){
        return sendErrorDev(err, res)
    } else {
        return sendErrorProd(err, res);
    }
}

module.exports = globalErrorHandler;