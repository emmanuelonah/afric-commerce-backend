const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const mongoose = require('mongoose');
const Category = require('./models/Category');
require('colors');

mongoose.connect(process.env.MONGOURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/category.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Category.create(categories);
    console.log('Data seeded successfully'.green.underline);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Category.deleteMany();
    console.log('Data deleted successfully'.red.underline);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
