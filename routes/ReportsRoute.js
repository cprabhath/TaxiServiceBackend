// Purpose: To handle the admin related operations.
// ------------------Importing Packages---------------- //
const express = require("express");
const ReportsController = require("../controllers/ReportsController");
const router = express.Router();
// ---------------------------------------------------- //

// ------------------- Routes for Reports --------------- //
router.get("/total-earnings", ReportsController.totalEarinings);
router.get("/total-rides", ReportsController.totalRides);
router.get("/driver-performance", ReportsController.driverPerformance);
router.get("/passenger-activity", ReportsController.passengerActivityReport);
router.get("/vehicle-activity", ReportsController.vehicleUsageReport);
router.get("/operator-performance", ReportsController.operatorPerformanceReport);
router.get("/total-passengers", ReportsController.getTotalPassenger);

// ---------------------------------------------------- //

//---------------------Export module------------------- //
module.exports = router;