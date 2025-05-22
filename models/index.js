const spectrumSpeedMaster = require("./spectrumSpeedMaster");
const venueProfileMaster = require("./venueProfileMaster");
const marketMaster = require("./marketMaster");
const marketShare = require("./marketShareMaster");
const userMaster = require("./userMaster");
const venueCalculations = require("./venueCalculations");

module.exports = {
  spectrumSpeed: spectrumSpeedMaster,
  venueProfile: venueProfileMaster,
  market: marketMaster,
  marketShare: marketShare,
  user: userMaster,
  venueCalculations: venueCalculations,
};
