const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGOURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  console.log(
    `Database connected successfully to ${conn.connection.host}`.cyan.underline
      .bold
  );
};

module.exports = connectDB;
