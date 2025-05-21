const path = require("path");
const fs = require("fs");
let code = {
  success: 200,
  badRequest: 400,
  dataNoExists: 404,
  internalServerError: 500,
  unAuthorized: 401,
};

function convertValuesToString(obj, cache = new WeakMap()) {
  if (cache.has(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    const newArr = obj.map((val) => convertValuesToString(val, cache));
    cache.set(obj, newArr);
    return newArr;
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    cache.set(obj, newObj);
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = convertValuesToString(value, cache);
    }
    return newObj;
  } else {
    return obj == null ? null : typeof obj === "boolean" ? obj : String(obj);
  }
}

module.exports = {
  success: (message, result, res) => {
    if (result != null && isNaN(result)) {
      result = JSON.parse(JSON.stringify(result));
      result = convertValuesToString(result);
    }
    return res.status(code.success).json({
      status: code.success,
      message: message || "Your request is successfully executed",
      data: result,
    });
  },
  error: (err, res) => {
    console.log(err.message);
    return res.status(code.internalServerError).json({
      status: code.internalServerError,
      message: res.req.baseUrl.includes("riders") ? err : err.message,
      data: null,
    });
  },
  badRequest: (res) => {
    return res.status(code.success).json({
      status: code.badRequest,
      message: "The request cannot be fulfilled due to bad syntax.",
      data: null,
    });
  },
  NoFoundDetailsRequest: (message, res) => {
    return res.status(code.dataNoExists).json({
      status: code.dataNoExists,
      message: message,
      data: null,
    });
  },
  unAuthorized: (res) => {
    return res.status(code.unAuthorized).json({
      status: code.unAuthorized,
      message: "You are not authorized to access the request",
      data: null,
    });
  },
  unprocessableEntityRequestWithMessage: (message, res) => {
    res.status(422).json({
      Message: message,
      Data: 0,
      Status: 422,
      IsSuccess: false,
    });
    res.end();
  },
  unauthorizedRequestWithMessage: (message, res) => {
    res.status(401).json({
      Message: message,
      Data: 0,
      Status: 401,
      IsSuccess: false,
    });
    res.end();
  },

  validationErrorWithMessage: (message, res) => {
    res.status(422).json({
      message: message,
      data: 0,
      status: 422,
      isSuccess: false,
    });
    res.end();
  },

  unauthorizedUser: (massage, res) => {
    res.status(401).json({
      message: massage,
      data: 0,
      status: 401,
      isSuccess: false,
    });
    res.end();
  },

  dataNotFound: (message, res) => {
    res.status(404).json({
      message: message,
      data: 0,
      status: 404,
      isSuccess: false,
    });
    res.end();
  },

  noDataAvailable: (message, res) => {
    res.status(403).json({
      message: message,
      data: 0,
      status: 403,
      isSuccess: false,
    });
    res.end();
  },

  sendFile: (file, res) => {
    res.sendFile(file, (err) => {
      if (err) {
        console.error("File failed to send:", err);
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
      console.log("sent successfully");
    });
  },
  download: (file, res) => {
    res.download(file, function (error) {
      if (error) {
        console.log("Error : ", error);
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
      console.log("sent successfully");
    });
  },
};
