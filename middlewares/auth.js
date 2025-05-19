const jwt = require("jsonwebtoken");
let {
  encrypt,
  decrypt,
  verifyToken,
} = require("./../utilities/encryptor_util");
const response = require("./../utilities/response_util");
const generateAccessToken = (userData) => {
  let token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN_DAYS}d`,
  });
  return encrypt(token);
};
