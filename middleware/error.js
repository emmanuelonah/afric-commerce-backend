const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === 'development') console.log(err);

  let message;

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  if (err.code === 11000) {
    message =
      err.errmsg
        .split('index:')[1]
        .split('_1')[0]
        .trim() + ' Already Exist';
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ObjectParameterError' || err.name === 'JsonWebTokenError') {
    message = 'Unauthorized access';
    error = new ErrorResponse(message, 403);
  }

  if (err.code === 66) {
    message = 'You are not allowed to carry out this action';
    error = new ErrorResponse(message, 403);
  }

  if (err.name === 'CastError') {
    message = 'Resource with id does not exist';
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    msg: error.message || 'Internal server error'
  });
};

module.exports = errorHandler;
