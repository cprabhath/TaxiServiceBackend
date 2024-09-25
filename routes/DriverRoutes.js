// Purpose: To handle the driver related operations.

// ---------------------------Importing Packages-------------------------- //
const express = require("express");
const DriverController = require("../controllers/DriverController");
const router = express.Router();

// ----------------------------------------------------------------------- // 

// ------------------- Routes for Driver ---------------- //
router.post("/login", DriverController.DriverLogin);
router.post("/register", DriverController.DriverRegister);
router.get("/profile", DriverController.getDriverProfile);
// ------------------------------------------------------ //

//------------------Export module----------------//
module.exports = router;
//-----------------------------------------------//
