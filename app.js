require("dotenv").config({ path: "./.env" });
// require("./core/_init.database").initializeDB();
let cors = require("cors");
let path = require("path");
let logger = require("morgan");
let express = require("express");
let cookieParser = require("cookie-parser");
let serverUtil = require("./utilities/server_util");

let app = express();

app.use(cors({}));

// app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let port = serverUtil.normalizePort(process.env.PORT || "3000");
app.listen(port, () => {
  console.log("server is running on port :" + port);
});
