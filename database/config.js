const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    // mongoose.connect(process.env.DB_CONN, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    // });

    mongoose.connect(process.env.DB_CONN);
    console.log('Database is online');
  } catch (error) {
    console.log(error);
    throw new Error('Error al iniciar la base de datos');
  }
};

module.exports = { dbConnection };
