const models = require("../models/index");
const response = require("../utilities/response_util");
let { encrypt, decrypt } = require("./../utilities/encryptor_util");
const { generateAccessToken } = require("./../middlewares/auth");

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
