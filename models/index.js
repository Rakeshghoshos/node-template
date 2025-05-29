const { Sequelize, DataTypes } = require("sequelize");
const { initializeDB } = require("../core/init_db");

async function initModels() {
  // Return cached models if already initialized
  if (global.modelsInstance) {
    return global.modelsInstance;
  }

  try {
    // Initialize Sequelize only if not already initialized

    let sequelizeInstance = await initializeDB();

    // Define models
    global.modelsInstance = {
      Market: require("./marketMaster")(sequelizeInstance, DataTypes),
      MarketShare: require("./marketShareMaster")(sequelizeInstance, DataTypes),
      SpectrumSpeed: require("./spectrumSpeed")(sequelizeInstance, DataTypes),
      User: require("./userMaster")(sequelizeInstance, DataTypes),
      VenueCapacity: require("./venueCapacity")(sequelizeInstance, DataTypes),
      VenueProfile: require("./venueProfileMaster")(
        sequelizeInstance,
        DataTypes
      ),
    };

    // Sync database (only once during initialization)
    await sequelizeInstance.sync({ force: false });
    console.log("Database synchronized successfully.");

    return modelsInstance;
  } catch (error) {
    console.error("Failed to initialize models:", error);
    throw error;
  }
}

initModels()
  .then(() => {
    console.log("models are initialized!");
  })
  .catch((err) => console.log("Err: on model init", err));
