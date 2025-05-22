const spectrumSpeedMaster = require("./spectrumSpeedMaster");
const venueProfileMaster = require("./venueProfileMaster");
const marketMaster = require("./marketMaster");
const marketShare = require("./marketShareMaster");
const userMaster = require("./userMaster");
const venueCapacity = require("./venueCapacty");

module.exports = {
  spectrumSpeed: spectrumSpeedMaster,
  venueProfile: venueProfileMaster,
  market: marketMaster,
  marketShare: marketShare,
  user: userMaster,
  venueCapacity: venueCapacity,
};
