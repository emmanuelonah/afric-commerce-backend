const express = require('express');
const { addCart, getUserCartList } = require('../controllers/carts');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(protect, getUserCartList);

router.route('/:productId').post(protect, addCart);

module.exports = router;
