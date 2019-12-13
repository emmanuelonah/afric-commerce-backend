const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@description  Add to cart
//@route        /api/v1/carts/:productId
//@access       Private
exports.addCart = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.product = req.params.productId;
  req.body.qty = 1;

  const { product, user, qty } = req.body;

  let checkproduct = await Product.findById(product)
    .lean()
    .exec();

  if (!checkproduct)
    return next(new ErrorResponse(`Product is out of stock`, 404));

  if (checkproduct.numberOfProduct === 0)
    return next(new ErrorResponse(`Product is out of stock`, 404));

  let cart = await Cart.findOne({ product });

  if (cart) {
    updateCart(res, req, cart, next);
  } else {
    cart = await Cart.create({
      product,
      user,
      qty
    });

    res.status(201).json({ sucess: true, data: cart });
  }
});

//@description  Get users cart
//@route        /api/v1/carts/
//@access       Private
exports.getUserCartList = asyncHandler(async (req, res, next) => {
  console.log(req.user._id);

  const carts = await Cart.find({ user: req.user._id })
    .lean()
    .exec();

  res.status(200).json({ success: true, data: carts });
});

const updateCart = async (res, req, cart, next) => {
  if (req.user._id.toString() !== cart.user.toString())
    return next(new ErrorResponse('Unauthorize to update this cart', 403));

  let newQty;
  if (cart.qty === -1) newQty = -1;
  else newQty = 1;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        qty: cart.qty + newQty
      },
      { new: true }
    ).exec();
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    console.log(error);
  }
};
