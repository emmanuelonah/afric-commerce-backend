const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
dotenv.config({ path: './config/config.env' });
require('colors');
const app = express();

const connectDB = require('./config/db');

//Import Custom middleware
const errorHandler = require('./middleware/error');

//Import routes
const auth = require('./routes/auth');
const categories = require('./routes/categories');
const products = require('./routes/products');
const carts = require('./routes/carts');

// Mount connection
connectDB();

const PORT = process.env.PORT || 7000;
//Mount cookieParser
app.use(cookieParser());

// Enable cors
app.use(cors());

// Enable mongoSanitize
app.use(mongoSanitize());

//Mount json parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/categories', categories);
app.use('/api/v1/products', products);
app.use('/api/v1/carts', carts);

//Mount erroHandler
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  server.close(() => process.exit(1));
});
