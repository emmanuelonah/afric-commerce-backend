const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
      maxlength: [50, 'Chracter must be a maximum of 50']
    },
    email: {
      type: String,
      required: [true, 'Please enter an email address'],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      min: [4, 'Minimum character of 4 letters'],
      max: [20, 'Maximum character of 20 letters'],
      select: false
    },
    roles: {
      type: String,
      enum: ['user'],
      default: 'user'
    },
    resetToken: String,
    resetTokenExpire: Date
  },
  {
    timestamps: true
  }
);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.confirmPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateToken = function() {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

UserSchema.methods.forgetPasswordToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.resetToken = hash;
  this.resetTokenExpire = Date.now() + 10 * 60000;
  return token;
};

module.exports = mongoose.model('User', UserSchema);
