const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const mail = require('../utils/mail');
const crypto = require('crypto');

//@description    Register new user
//@route          /api/v1/auth/register
//@access         Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.create({ name, email, password });

  setTokenCookie(res, 201, user);
});

//@description    Login new user
//@route          /api/v1/auth/login
//@access         Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .select('+password')
    .exec();

  if (!user) return next(new ErrorResponse('Invalid Credentials', 401));

  const match = await user.confirmPassword(password);

  if (!match) return next(new ErrorResponse('Invalid Credentials', 401));

  setTokenCookie(res, 200, user);
});

//@description    Login new user
//@route          /api/v1/auth/me
//@access         Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .lean()
    .exec();

  if (!user) return next(new ErrorResponse('Unauthorized access', 403));

  res.status(200).json({ success: true, data: user });
});

//@description forgetPassword using email
//@route       /api/v1/auth/forgetPassword
//@access      Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  if (!user)
    return next(
      new ErrorResponse(
        "You've entered the incorrect email address. Please try again.",
        400
      )
    );

  const resetToken = user.forgetPasswordToken();

  await user.save();

  const resetUrl = `http://localhost/api/v1/auth/resetPassword/${resetToken}`;

  const message = `
  <p>**********</p> 

   <h2>Team AfricLite</h2>

   <p>**********</p> 

   <p>Dear customer,</p>

   <p>Follow this link to reset your AfriNote password for your ${user.password} account.</p>

   <p><a>${resetUrl}</a><p>

   <p>If you didn’t ask to reset your password, you can ignore this email.</p>

   Thanks,
  `;

  const options = {
    message,
    to: user.email,
    subject: 'Reset Password'
  };

  try {
    await mail(options);
    res.status(200).json({ success: true, data: 'Message sent successfully' });
  } catch (error) {
    console.log(error);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

//@description resetPassword using token
//@route       /api/v1/auth/resetPassword/:token
//@access      Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  let user = await User.findOne({
    resetToken,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) return next(new ErrorResponse('Invalid token', 400));

  if (!req.body.password)
    return next(new ErrorResponse('Please enter a new password', 400));

  //Set new password
  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  setTokenCookie(res, 200, user);
});

const setTokenCookie = (res, status, user) => {
  const token = user.generateToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 86400000)
  };

  if (process.env.NODE_ENV === 'production') options.httpOnly = true;

  res
    .status(status)
    .cookie('token', token, options)
    .json({
      success: true,
      token: token
    });
};
