const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../models/User');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) token = req.cookies.token;
  if (!token) return next(new ErrorResponse('Unauthorized access', 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse('Unauthorized access', 401));
  }
});

exports.authorizedRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.roles))
    return next(new ErrorResponse('Unauthorized access', 403));

  next();
};
