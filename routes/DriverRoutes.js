// Purpose: To handle the driver related operations.

// ---------------------------Importing Packages-------------------------- //
const express = require("express");
const DriverController = require("../controllers/DriverController");
const router = express.Router();

// ----------------------------------------------------------------------- // 

// ------------------- Routes for Driver ---------------- //
router.post("/login", DriverController.DriverLogin);
router.post("/register", DriverController.DriverRegister);
router.post("/profile", DriverController.getDriverProfile);
//router.put("/update-profile", DriverController.updateDriverProfile);
router.get("/ride-details", DriverController.getRideList);
// ------------------------------------------------------ //

// ------------------- Administrator functions ---------------- //
router.get("/totalDrivers", DriverController.getTotalDriverCount);
// ------------------------------------------------------ //

//------------------Export module----------------//
module.exports = router;
//-----------------------------------------------//
