const { Sequelize } = require("sequelize");

const initializeDB = async () => {
  try {
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false, // Set to true to see SQL queries in the console
    });

    // Test the connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    return sequelize;
  } catch (err) {
    console.error("Unable to connect to the database:", err.message);
    process.exit(1);
  }
};

module.exports = { initializeDB };
