const response = require("../../utilities/response_util");
let { encrypt, decrypt } = require("../../utilities/encryptor_util");
const { generateAccessToken } = require("../../middlewares/auth");
const constants = require("../../core/constants");

exports.registerUser = async (req, res) => {
  let models = global.modelsInstance;
  try {
    const { name, mobile, emailId, password, role } = req.body;

    if (!emailId || !password) {
      return response.error("Email and password are required", res);
    }

    const existingUser = await models.User.findOne({ where: { emailId } });
    if (existingUser) {
      return response.error("Email already registered", res);
    }

    const encryptedPassword = encrypt(password);

    const user = await models.User.create({
      name: name || "",
      mobile: mobile || "",
      emailId,
      password: encryptedPassword,
      role: role || "",
    });

    const userData = {
      id: user.id,
      emailId: user.emailId,
      name: user.name,
      role: user.role,
    };
    const token = generateAccessToken(userData);

    const responseData = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      emailId: user.emailId,
      role: user.role,
      token,
    };

    return response.success("User registered successfully", responseData, res);
  } catch (error) {
    console.error(error);
    return response.error(error.message, res);
  }
};

exports.loginUser = async (req, res) => {
  try {
    let models = global.modelsInstance;
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

    const user = await models.User.findOne({
      where: {
        [emailId ? "emailId" : "mobile"]: emailId || mobile,
      },
    });

    if (!user) {
      return response.error("User not found", res);
    }

    const decryptedPassword = decrypt(user.password);
    if (decryptedPassword !== password) {
      return response.error("Invalid password", res);
    }

    const userData = {
      id: user.id,
      emailId: user.emailId,
      name: user.name,
      role: user.role,
    };
    const token = generateAccessToken(userData);

    const responseData = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      emailId: user.emailId,
      role: user.role,
      token,
    };

    return response.success("Login successful", responseData, res);
  } catch (error) {
    console.error(error);
    return response.error(error.message, res);
  }
};

exports.insertspectrumSpeedDetails = async (req, res) => {
  try {
    const spectrumSpeeds = req.body;

    // Validate that the request body is an array
    if (!Array.isArray(spectrumSpeeds)) {
      return response.error("Request body must be an array", res);
    }

    // Pre-process each record to ensure band and carriersAvailable are arrays
    const processedSpeeds = spectrumSpeeds.map((speed) => ({
      ...speed,
      band: Array.isArray(speed.band) ? speed.band : [speed.band], // Convert string to array if needed
      carriersAvailable: Array.isArray(speed.carriersAvailable)
        ? speed.carriersAvailable
        : speed.carriersAvailable
        ? [speed.carriersAvailable]
        : [], // Handle undefined or string
    }));

    // Perform bulkCreate with processed data
    const insertedSpeeds = await models.SpectrumSpeed.bulkCreate(
      processedSpeeds,
      {
        validate: true, // Ensure model validations are applied
      }
    );

    return response.success(
      "Inserted successfully",
      insertedSpeeds.length,
      res
    );
  } catch (error) {
    console.error("Error inserting spectrum speeds:", error);
    return response.error(error.message, res);
  }
};

exports.insertVenueProfileDetails = async (req, res) => {
  try {
    const venueProfiles = req.body;

    if (!Array.isArray(venueProfiles)) {
      return response.success("Request body must be an array", 0, res);
    }

    const insertedProfiles = await models.VenueProfile.bulkCreate(
      venueProfiles
    );

    return response.success(
      "Inserted successfully",
      insertedProfiles.length,
      res
    );
  } catch (error) {
    console.error(error);
    return response.error(error.message, res);
  }
};

exports.insertMarketDetails = async (req, res) => {
  try {
    const markets = req.body;

    if (!Array.isArray(markets)) {
      return response.success("Request body must be an array", 0, res);
    }

    const insertedMarkets = await models.Market.bulkCreate(markets);

    return response.success(
      "Inserted successfully",
      insertedMarkets.length,
      res
    );
  } catch (error) {
    console.error(error);
    return response.error(error.message, res);
  }
};

exports.insertMarketShareDetails = async (req, res) => {
  try {
    const marketShares = req.body;

    if (!Array.isArray(marketShares)) {
      return response.success("Request body must be an array", 0, res);
    }

    const insertedMarketShares = await models.MarketShare.bulkCreate(
      marketShares
    );

    return response.success(
      "Inserted successfully",
      insertedMarketShares.length,
      res
    );
  } catch (error) {
    console.error(error);
    return response.error(error.message, res);
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
    const spectrumSpeeds = await models.SpectrumSpeed.findAll();
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
      for (const carrier of nrSpectrum.fr1) {
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
    const laaPenetration = constants.laaPenetration;

    // Determine market share
    let marketShare;
    if (venueInformation.marketShare === "Custom") {
      marketShare = venueInformation.customMarketShareValue;
    } else {
      const marketShareData = await models.MarketShare.findOne({
        where: { marketId: venueInformation.market },
      });
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
      const profileData = await models.VenueProfile.findOne({
        where: { name: venueInformation.venueType },
      });
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
    let LaaSpeed = 0;
    let lteDlSpeed = lteSpectrum.reduce((sum, carrier) => {
      if (carrier.technology !== "Not used") {
        const spec = spectrumSpeeds.find(
          (s) =>
            s.technology === carrier.technology &&
            s.band.includes(carrier.band) &&
            s.systemType === carrier.systemType &&
            s.bandwidth === carrier.bandwidth
        );
        if (spec && spec.technology !== "LAA") {
          return sum + spec.dlSpeed;
        } else if (spec) {
          LaaSpeed = Number(spec.dlSpeed);
        }
      }
      return sum;
    }, 0);

    const lteUlSpeed = lteSpectrum.reduce((sum, carrier) => {
      if (carrier.technology !== "Not used") {
        const spec = spectrumSpeeds.find(
          (s) =>
            s.technology === carrier.technology &&
            s.band.includes(carrier.band) &&
            s.systemType === carrier.systemType &&
            s.bandwidth === carrier.bandwidth
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

      if (LaaSpeed !== 0) {
        lteDlSpeed += LaaSpeed * laaPenetration[year];
      }
      results.lteSectors[year] = {
        dl: Math.ceil(lteDlTraffic / lteDlSpeed),
        ul: Math.ceil(lteUlTraffic / lteUlSpeed),
      };
    }

    // NR FR1 and FR2 Calculations (only if lteOnlyCalculations is false)
    if (!venueInformation.lteOnlyCalculations) {
      const nrDlSpeed = nrSpectrum.fr1.reduce((sum, carrier) => {
        if (carrier.technology !== "Not used" && carrier.band !== "mmW") {
          const spec = spectrumSpeeds.find(
            (s) =>
              s.technology === carrier.technology &&
              s.band.includes(carrier.band) &&
              s.systemType === carrier.systemType &&
              s.bandwidth === carrier.bandwidth
          );
          return sum + (spec ? spec.dlSpeed : 0);
        }
        return sum;
      }, 0);

      const nrUlSpeed = nrSpectrum.fr1.reduce((sum, carrier) => {
        if (carrier.technology !== "Not used" && carrier.band !== "mmW") {
          const spec = spectrumSpeeds.find(
            (s) =>
              s.technology === carrier.technology &&
              s.band.includes(carrier.band) &&
              s.systemType === carrier.systemType &&
              s.bandwidth === carrier.bandwidth
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
      nrSpectrum,
      user: req.token,
      optional,
      results,
    };

    const savedCalc = await models.VenueCapacity.create(venueCalcData);

    return response.success(
      "Calculations completed and stored successfully",
      savedCalc,
      res
    );
  } catch (error) {
    console.error(error);
    return response.error(error.message, res);
  }
};

exports.getVenueCapacities = async (req, res) => {
  try {
    // Extract query parameters
    const { userId, page = 1, limit = 10 } = req.body;

    // Pagination options
    const offset = (page - 1) * limit;

    // Build query
    const where = {};
    if (userId) {
      where["user.id"] = userId; // Access JSONB field
    }

    // Fetch paginated results
    const { count, rows } = await models.VenueCapacity.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    // Prepare response data
    const responseData = {
      totalDocs: count,
      totalPages: Math.ceil(count / limit),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      docs: rows,
    };

    return response.success(
      "Venue capacities retrieved successfully",
      responseData,
      res
    );
  } catch (error) {
    console.error(error);
    return response.error(error.message, res);
  }
};
