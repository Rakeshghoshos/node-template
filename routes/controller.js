const models = require("../models/index");
const response = require("../utilities/response_util");

exports.insertSpectrumSpeedDetails = async (req, res) => {
  {
    try {
      const spectrumSpeeds = req.body;

      if (!Array.isArray(spectrumSpeeds)) {
        return response.success("Request body must be an array", 0, res);
      }

      const insertedSpeeds = await models.SpectrumSpeed.insertMany(
        spectrumSpeeds
      );

      return response.success("inserted successfully", 1, res);
    } catch (error) {
      console.log(error);
      return response.error(error, res);
    }
  }
};
