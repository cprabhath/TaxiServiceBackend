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
router.put("/update-profile", DriverController.updateDriverProfile);
router.get("/ride-details", DriverController.getRideList);
router.post("/get-ride-count", DriverController.getTotalRidesCount);
router.post("/total-earnings", DriverController.getTotalEarnings);
router.put("/update-status/:driverId", DriverController.updateDriverStatus);
router.put("/rides/:rideId", DriverController.updateRideStatus);
router.post("/vehicle/details", DriverController.getVehicleDetails);


// ------------------------------------------------------ //

// ------------------- Administrator functions ---------------- //
router.get("/total-drivers", DriverController.getTotalDriverCount);
router.get("/total-vehicles", DriverController.getTotalVehicleCount);
router.get("/all-drivers", DriverController.getAllDrivers);
// ------------------------------------------------------ //

//------------------Export module----------------//
module.exports = router;
//-----------------------------------------------//
