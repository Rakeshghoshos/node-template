const jwt = require("jsonwebtoken");
let { encrypt, decrypt } = require("./../utilities/encryptor_util");
const response = require("./../utilities/response_util");
const { model } = require("mongoose");
const generateAccessToken = (userData) => {
  let token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN_DAYS}d`,
  });
  return encrypt(token);
};

const isAuthenticated = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    let token = bearer[1];
    if (Boolean(token)) {
      try {
        token = decrypt(token);
      } catch (err) {
        return response.unAuthorized(res);
      }
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, auth) => {
      if (err) {
        return response.unAuthorized(res);
      } else {
        req.token = auth;
        next();
      }
    });
  } else {
    return response.unAuthorized(res);
  }
};

module.exports = {
  generateAccessToken,
  isAuthenticated,
};
