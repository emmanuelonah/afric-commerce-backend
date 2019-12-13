const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a cateogory name'],
      trim: true,
      unique: true,
      maxlength: [100, 'Maximum character for a category name is 100']
    },
    description: {
      type: String,
      required: [true, 'Please enter a description for this cateogory'],
      trim: true,
      unique: true,
      maxlength: [500, 'Maximum character for a category description is 500']
    },
    totalNumberOfProduct: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Reverse populate using virtuals
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

// Cascade delete product
CategorySchema.pre('remove', async function(next) {
  await this.model('Product').deleteMany({ category: this._id });
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
