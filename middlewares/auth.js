const jwt = require("jsonwebtoken");
let { encrypt, decrypt } = require("./../utilities/encryptor_util");
const response = require("./../utilities/response_util");

let models = global.modelsInstance;

const generateAccessToken = (userData) => {
  let token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN_DAYS}d`,
  });
  return encrypt(token);
};

const isEngineer = (req, res, next) => {
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
        const existingUser = await models.User.findOne({
          where: { id: auth.id },
        });
        if (existingUser && existingUser.role != "admin") {
          req.token = auth;
          req.models = global.modelsInstance;
          next();
        } else {
          return response.unAuthorized(res);
        }
      }
    });
  } else {
    return response.unAuthorized(res);
  }
};

const isAdmin = (req, res, next) => {
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
        const existingUser = await models.User.findOne({
          where: { id: auth.id },
        });
        if (existingUser && existingUser.role == "admin") {
          req.token = auth;
          req.models = global.modelsInstance;
          next();
        } else {
          return response.unAuthorized(res);
        }
      }
    });
  } else {
    return response.unAuthorized(res);
  }
};

module.exports = {
  generateAccessToken,
  isEngineer,
};
