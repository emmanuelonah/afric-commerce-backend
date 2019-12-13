const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  qty: {
    type: Number,
    default: 1,
    required: true
  }
});

module.exports = mongoose.model('Cart', CartSchema);
