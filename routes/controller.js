const models = require("../models/index");
const response = require("../utilities/response_util");
let { encrypt, decrypt } = require("./../utilities/encryptor_util");
const { generateAccessToken } = require("./../middlewares/auth");
const constants = require("../core/constants");

exports.registerUser = async (req, res) => {
  try {
    const { name, mobile, emailId, password, role } = req.body;

    if (!emailId || !password) {
      return response.error("Email and password are required", res);
    }

    const existingUser = await models.user.findOne({ emailId });
    if (existingUser) {
      return response.error("Email already registered", res);
    }

    const encryptedPassword = encrypt(password);

    const user = new models.user({
      name: name || "",
      mobile: mobile || "",
      emailId,
      password: encryptedPassword,
      role: role || "",
    });

    const savedUser = await user.save();

    const userData = {
      id: savedUser._id,
      emailId: savedUser.emailId,
      role: savedUser.role,
    };
    const token = generateAccessToken(userData);

    const responseData = {
      id: savedUser._id,
      name: savedUser.name,
      mobile: savedUser.mobile,
      emailId: savedUser.emailId,
      role: savedUser.role,
      token,
    };

    return response.success("User registered successfully", responseData, res);
  } catch (error) {
    console.error(error);
    return response.error(error, res);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { emailId, mobile, password } = req.body;

    if (!password || (!emailId && !mobile)) {
      return response.error(
        "Password and either email or mobile are required",
        res
      );
    }

    if (emailId && mobile) {
      return response.error("Provide either email or mobile, not both", res);
    }
    const user = await models.user.findOne({
      $or: [{ emailId: emailId || "" }, { mobile: mobile || "" }],
    });

    if (!user) {
      return response.error("User not found", res);
    }

    const decryptedPassword = decrypt(user.password);
    if (decryptedPassword !== password) {
      return response.error("Invalid password", res);
    }

    const userData = {
      id: user._id,
      emailId: user.emailId,
      role: user.role,
    };
    const token = generateAccessToken(userData);

    // Prepare response data (exclude password)
    const responseData = {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      emailId: user.emailId,
      role: user.role,
      token,
    };

    return response.success("Login successful", responseData, res);
  } catch (error) {
    console.error(error);
    return response.error(error, res);
  }
};

exports.insertspectrumSpeedDetails = async (req, res) => {
  {
    try {
      const spectrumSpeeds = req.body;

      if (!Array.isArray(spectrumSpeeds)) {
        return response.success("Request body must be an array", 0, res);
      }

      const insertedSpeeds = await models.spectrumSpeed.insertMany(
        spectrumSpeeds
      );

      return response.success("inserted successfully", 1, res);
    } catch (error) {
      console.log(error);
      return response.error(error, res);
    }
  }
};

exports.insertVenueProfileDetails = async (req, res) => {
  try {
    const venueProfiles = req.body;

    if (!Array.isArray(venueProfiles)) {
      return response.success("Request body must be an array", 0, res);
    }

    const insertedProfiles = await models.venueProfile.insertMany(
      venueProfiles
    );

    return response.success("Inserted successfully", 1, res);
  } catch (error) {
    console.error(error);
    return response.error(error, res);
  }
};

exports.insertMarketDetails = async (req, res) => {
  try {
    const markets = req.body;

    if (!Array.isArray(markets)) {
      return response.success("Request body must be an array", 0, res);
    }

    const insertedMarkets = await models.market.insertMany(markets);

    return response.success("Inserted successfully", 1, res);
  } catch (error) {
    console.error(error);
    return response.error(error, res);
  }
};
exports.insertMarketShareDetails = async (req, res) => {
  try {
    const marketShares = req.body;

    if (!Array.isArray(marketShares)) {
      return response.success("Request body must be an array", 0, res);
    }

    const insertedMarketShares = await models.marketShare.insertMany(
      marketShares
    );

    return response.success("Inserted successfully", 1, res);
  } catch (error) {
    console.error(error);
    return response.error(error, res);
  }
};

exports.calculateVenueCapacity = async (req, res) => {
  try {
    const { venueInformation, lteSpectrum, nrSpectrum, optional } = req.body;

    // Validate input structure
    if (!venueInformation || !lteSpectrum || !nrSpectrum || !optional) {
      return response.error("Missing required input fields", res);
    }

    // Validate LTE spectrum combinations
    const spectrumSpeeds = await models.spectrumSpeed.find().lean();
    for (const carrier of lteSpectrum) {
      if (carrier.technology !== "Not used") {
        const isValid = spectrumSpeeds.some(
          (spec) =>
            spec.technology === carrier.technology &&
            spec.band.includes(carrier.band)
        );
        if (!isValid) {
          return response.error(
            `Invalid LTE combination: ${carrier.technology}/${carrier.band}`,
            res
          );
        }
      }
    }

    // Validate NR spectrum combinations only if lteOnlyCalculations is false
    if (!venueInformation.lteOnlyCalculations) {
      for (const carrier of nrSpectrum) {
        if (carrier.technology !== "Not used") {
          const isValid = spectrumSpeeds.some(
            (spec) =>
              spec.technology === carrier.technology &&
              spec.band.includes(carrier.band)
          );
          if (!isValid) {
            return response.error(
              `Invalid NR combination: ${carrier.technology}/${carrier.band}`,
              res
            );
          }
        }
      }
    }

    const ltePenetration = constants.ltePenetration;
    const nrPenetration = constants.nrPenetration;
    // Determine market share
    let marketShare;
    if (venueInformation.marketShare === "Custom") {
      marketShare = venueInformation.customMarketShareValue;
    } else {
      const marketShareData = await models.marketShare
        .findOne({
          marketId: venueInformation.market,
        })
        .lean();
      if (!marketShareData) {
        return response.error(
          `Market share data not found for market: ${venueInformation.market}`,
          res
        );
      }
      marketShare = marketShareData.TMOOnly / 100; // Convert percentage to decimal
    }

    // Determine venue profile
    let venueProfile;
    if (venueInformation.marketShare === "Custom") {
      venueProfile = optional.customVenueProfile;
    } else {
      const profileData = await models.venueProfile
        .findOne({
          name: venueInformation.venueType,
        })
        .lean();
      if (!profileData) {
        return response.error(
          `Venue profile not found for venue type: ${venueInformation.venueType}`,
          res
        );
      }
      venueProfile = {
        averageTargetLteDlThroughput: profileData.dlLTESpeed,
        averageTargetLteUlThroughput: profileData.ulLTESpeed,
        averageTargetNrDlThroughput: profileData.dlNRSpeed,
        averageTargetNrUlThroughput: profileData.upNRSpeed,
        dlActivityFactor: profileData.dlActivityFactor / 100, // Convert percentage to decimal
        ulActivityFactor: profileData.ulActivityFactor / 100, // Convert percentage to decimal
      };
    }

    // Calculate sectors
    const results = {
      lteSectors: {},
      nrFr1Sectors: {},
      nrFr2Sectors: {},
    };

    const years = [2023, 2024, 2025, 2026, 2027, 2028];
    const attendees = venueInformation.totalAttendees;

    // LTE Calculations
    const lteDlSpeed = lteSpectrum.reduce((sum, carrier) => {
      if (carrier.technology !== "Not used") {
        const spec = spectrumSpeeds.find(
          (s) =>
            s.technology?.toString() === carrier.technology?.toString() &&
            s.band.includes(carrier.band) &&
            s.systemType.toString() == carrier.systemType.toString() &&
            s.bandwidth?.toString() == carrier.bandwidth?.toString()
        );
        return sum + (spec ? spec.dlSpeed : 0);
      }
      return sum;
    }, 0);

    const lteUlSpeed = lteSpectrum.reduce((sum, carrier) => {
      if (carrier.technology !== "Not used") {
        const spec = spectrumSpeeds.find(
          (s) =>
            s.technology?.toString() === carrier.technology?.toString() &&
            s.band.includes(carrier.band) &&
            s.systemType.toString() == carrier.systemType.toString() &&
            s.bandwidth?.toString() == carrier.bandwidth?.toString()
        );
        return sum + (spec ? spec.ulSpeed : 0);
      }
      return sum;
    }, 0);

    for (const year of years) {
      const lteSubs = attendees * marketShare * ltePenetration[year];
      const dlActivityFactor =
        venueProfile.dlActivityFactor * (1 + 0.1 * (year - 2023));
      const ulActivityFactor =
        venueProfile.ulActivityFactor * (1 + 0.1 * (year - 2023));

      const lteDlTraffic =
        lteSubs * venueProfile.averageTargetLteDlThroughput * dlActivityFactor;
      const lteUlTraffic =
        lteSubs * venueProfile.averageTargetLteUlThroughput * ulActivityFactor;

      results.lteSectors[year] = {
        dl: Math.ceil(lteDlTraffic / lteDlSpeed),
        ul: Math.ceil(lteUlTraffic / lteUlSpeed),
      };
    }

    // NR FR1 and FR2 Calculations (only if lteOnlyCalculations is false)
    if (!venueInformation.lteOnlyCalculations) {
      const nrDlSpeed = nrSpectrum.reduce((sum, carrier) => {
        if (carrier.technology !== "Not used" && carrier.band !== "mmW") {
          const spec = spectrumSpeeds.find(
            (s) =>
              s.technology?.toString() === carrier.technology?.toString() &&
              s.band.includes(carrier.band) &&
              s.systemType.toString() == carrier.systemType.toString() &&
              s.bandwidth?.toString() == carrier.bandwidth?.toString()
          );
          return sum + (spec ? spec.dlSpeed : 0);
        }
        return sum;
      }, 0);

      const nrUlSpeed = nrSpectrum.reduce((sum, carrier) => {
        if (carrier.technology !== "Not used" && carrier.band !== "mmW") {
          const spec = spectrumSpeeds.find(
            (s) =>
              s.technology?.toString() === carrier.technology?.toString() &&
              s.band.includes(carrier.band) &&
              s.systemType.toString() == carrier.systemType.toString() &&
              s.bandwidth?.toString() == carrier.bandwidth?.toString()
          );
          return sum + (spec ? spec.ulSpeed : 0);
        }
        return sum;
      }, 0);

      for (const year of years) {
        const nrSubs = attendees * marketShare * nrPenetration[year];
        const dlActivityFactor =
          venueProfile.dlActivityFactor * (1 + 0.1 * (year - 2023));
        const ulActivityFactor =
          venueProfile.ulActivityFactor * (1 + 0.1 * (year - 2023));

        const nrDlTraffic =
          nrSubs * venueProfile.averageTargetNrDlThroughput * dlActivityFactor;
        const nrUlTraffic =
          nrSubs * venueProfile.averageTargetNrUlThroughput * ulActivityFactor;

        results.nrFr1Sectors[year] = {
          dl: Math.ceil(nrDlTraffic / nrDlSpeed),
          ul: Math.ceil(nrUlTraffic / nrUlSpeed),
        };
      }

      // NR FR2 Calculations
      const mmWaveCoverage = venueInformation.areaCoverageByMmWave;
      for (const year of years) {
        results.nrFr2Sectors[year] = {
          dl: mmWaveCoverage === 0 ? "Not Selected" : 0,
          ul: mmWaveCoverage === 0 ? "Not Selected" : 0,
        };
      }
    }

    // Store data in venueCapacity
    const venueCalcData = {
      venueInformation,
      lteSpectrum,
      nrSpectrum: {
        fr1: nrSpectrum.filter((c) => c.band !== "mmW"),
        fr2: nrSpectrum.filter((c) => c.band === "mmW"),
      },
      optional,
      results,
    };

    const savedCalc = await models.venueCapacity.create(venueCalcData);

    return response.success(
      "Calculations completed and stored successfully",
      savedCalc,
      res
    );
  } catch (error) {
    console.error(error);
    return response.error(error, res);
  }
};
