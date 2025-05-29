const admin = require("./admin/index");
const engineers = require("./engineer/index");

module.exports = [
  //   { path: "/api/admin", file: admin },
  { path: "/api/engineer", file: engineers },
];
