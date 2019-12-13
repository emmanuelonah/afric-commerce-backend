const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Category = require('../models/Category');

//@description  Get category products && get all products
//@routes       GET /api/v1/categories/:categoryId/products & api/v1/products
//@access       Public & Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const products = await Product.find({ category: req.params.categoryId })
      .lean()
      .exec();

    if (!products)
      return next(
        new ErrorResponse(`Category with id ${req.params.id} does not exist`)
      );

    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

//@description  Get a single category
//@routes       GET api/v1/products/:id
//@access       Public
exports.getProduct = asyncHandler(async (res, req, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorResponse(`Product not found`, 404));

  res.status(200).json({ success: true, data: product });
});

//@description  Create category product
//@routes       POST /api/v1/categories/:categoryId/products
//@access       Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category)
    return next(
      new ErrorResponse(
        'You can not create a product for a category that does not exist',
        404
      )
    );

  req.body.category = req.params.categoryId;

  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

//@description  Update category product
//@routes       PUT /api/v1/products/:id
//@access       Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product)
    return next(
      new ErrorResponse(
        'You can not create a product for a category that does not exist',
        404
      )
    );

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: product });
});

//@description  Delete category product
//@routes       DELETE /api/v1/products/:id
//@access       Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse('Product does not exist', 404));

  await product.remove();

  res.status(200).json({ success: true, data: {} });
});
