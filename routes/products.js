const express = require('express');
const Product = require('../models/Product');
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');
const advancedResult = require('../middleware/advancedResult');
const { protect, authorizedRole } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResult(Product, {
      path: 'category',
      select: 'name description'
    }),
    getProducts
  )
  .post(protect, authorizedRole('admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorizedRole('admin'), updateProduct)
  .delete(protect, authorizedRole('admin'), deleteProduct);

module.exports = router;
