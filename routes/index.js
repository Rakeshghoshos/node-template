const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/saveSpectrumDetails", async (req, res) =>
  controller.insertSpectrumSpeedDetails(req, res)
);

module.exports = router;
