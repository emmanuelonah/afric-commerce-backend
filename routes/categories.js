const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');
const Category = require('../models/Category');
const { protect, authorizedRole } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');
const router = express.Router();

//Import another resource
const products = require('./products');

//Mount products resource
router.use('/:categoryId/products', products);

router
  .route('/')
  .get(advancedResult(Category, 'products'), getCategories)
  .post(protect, authorizedRole('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorizedRole('admin'), updateCategory)
  .delete(protect, authorizedRole('admin'), deleteCategory);

module.exports = router;
