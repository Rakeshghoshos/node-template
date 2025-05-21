const mongoose = require("mongoose");

const initializeDB = async () => {
  try {
    await mongoose.connect(process.env.database);
    console.log("Database instances are active!");
  } catch (err) {
    console.log(err.message);
    console.log("Connection failed!");
    process.exit(0);
  }
};

module.exports = { initializeDB };
