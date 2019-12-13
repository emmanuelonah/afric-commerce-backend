const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a product name'],
      trim: true,
      unique: true,
      maxlength: [100, 'Maximum character for a product name is 100']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please enter your product description'],
      trim: true,
      unique: true,
      maxlength: [500, 'Maximum character for a product name is 100']
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price']
    },
    numberOfProduct: {
      type: Number,
      required: true,
      default: 1
    },
    photoname: {
      type: String,
      required: [true, 'Please enter a photo']
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true
    }
  },
  {
    timestamps: true
  }
);

ProductSchema.pre('save', function(next) {
  this.slugify = slugify(this.name, {
    lower: true
  });
  next();
});

// Create statics to add product
ProductSchema.statics.getTotalProduct = async function(categoryId) {
  const obj = await this.aggregate([
    {
      $match: { category: categoryId }
    },
    {
      $group: {
        _id: '$category',
        totalNumberOfProduct: { $sum: '$numberOfProduct' }
      }
    }
  ]);

  try {
    await this.model('Category').findByIdAndUpdate(categoryId, {
      totalNumberOfProduct: Math.ceil(obj[0].totalNumberOfProduct)
    });
  } catch (error) {
    console.log(error);
  }
};

ProductSchema.post('save', function() {
  this.constructor.getTotalProduct(this.category);
});

ProductSchema.pre('remove', function(next) {
  this.constructor.getTotalProduct(this.category);
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
