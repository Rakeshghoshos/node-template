const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/register", async (req, res) => controller.registerUser(req, res));

router.post("/login", async (req, res) => controller.loginUser(req, res));

router.post("/saveSpectrumDetails", isAuthenticated, async (req, res) =>
  controller.insertspectrumSpeedDetails(req, res)
);
router.post("/saveVenueProfileDetails", isAuthenticated, async (req, res) =>
  controller.insertVenueProfileDetails(req, res)
);
router.post("/saveMarketDetails", isAuthenticated, async (req, res) =>
  controller.insertMarketDetails(req, res)
);
router.post("/saveMarketShareDetails", isAuthenticated, async (req, res) =>
  controller.insertMarketShareDetails(req, res)
);

router.post("/calculateVenueCapacity", isAuthenticated, async (req, res) =>
  controller.calculateVenueCapacity(req, res)
);
module.exports = router;
