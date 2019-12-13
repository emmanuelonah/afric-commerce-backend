const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@description   Get all ccategories
//@route         /api/v1/categories
//@access        Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

//@description   Get single category using id
//@route         /api/v1/categories/:id
//@access        Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category)
    return next(
      new ErrorResponse(`Category with ${req.params.id} does not exit`, 404)
    );
  res.status(200).json({ success: true, data: category });
});

//@description  Create new category
//@route        POST /api/v1/categories
//@access       Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(200).json({ success: true, data: category.toObject() });
});

//@description  Update Category using id
//@route        PUT /api/v1/categories/:id
//@access       Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category)
    return next(new ErrorResponse(`No id with category ${req.params.id}`, 404));

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).exec();

  res.status(200).json({ success: true, data: category.toObject() });
});

//@description  Delete Category using id
//@route        DELETE /api/v1/categories/:id
//@access       Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category)
    return next(new ErrorResponse(`No id with category ${req.params.id}`, 404));

  await category.remove();

  res.status(200).json({ success: true, data: {} });
});
