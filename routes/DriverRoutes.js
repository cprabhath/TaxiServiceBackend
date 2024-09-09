// Purpose: To handle the driver related operations.

// ---------------------------Importing Packages-------------------------- //
const express = require("express");
const DriverController = require("../controllers/DriverController");
const router = express.Router();
// ----------------------------------------------------------------------- //


// ------------------- Routes for Driver ---------------- //
router.get("/login", DriverController.DriverLogin);
// ------------------------------------------------------ //


//------------------Export module----------------//
module.exports = router;
//-----------------------------------------------//