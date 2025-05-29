const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isEngineer } = require("../../middlewares/auth");

router.post("/register", async (req, res) => controller.registerUser(req, res));

router.post("/login", async (req, res) => controller.loginUser(req, res));

router.post("/saveSpectrumDetails", isEngineer, async (req, res) =>
  controller.insertspectrumSpeedDetails(req, res)
);
router.post("/saveVenueProfileDetails", isEngineer, async (req, res) =>
  controller.insertVenueProfileDetails(req, res)
);
router.post("/saveMarketDetails", isEngineer, async (req, res) =>
  controller.insertMarketDetails(req, res)
);
router.post("/saveMarketShareDetails", isEngineer, async (req, res) =>
  controller.insertMarketShareDetails(req, res)
);

router.post("/calculateVenueCapacity", isEngineer, async (req, res) =>
  controller.calculateVenueCapacity(req, res)
);
router.post("/getVenueCapacities", isEngineer, async (req, res) =>
  controller.getVenueCapacities(req, res)
);
module.exports = router;
