// ---------------------------Importing Packages-------------------------- //
const express = require("express");
const PlatformController = require("../controllers/PlatformController");
const router = express.Router();
// ----------------------------------------------------------------------- //

// ------------------- Routes for Platform ---------------- //
router.post("/create-platform-rate", PlatformController.createPlatformRate);
router.put("/update-platform-rate", PlatformController.updatePlatformRate);
router.get("/all-platform-rates", PlatformController.getAllPlatformRates);
router.get("/get-vehicle-rate", PlatformController.getVehicleRates);
router.post("/update-platform-rate", PlatformController.updateRates);
// ------------------------------------------------------ //

//------------------Export module----------------//
module.exports = router;