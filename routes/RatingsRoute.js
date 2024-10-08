// ------------------Importing Packages---------------- //
const express = require("express");
const RatingsController = require("../controllers/RideRatingsController");
const router = express.Router();
// ---------------------------------------------------- //

// ------------------- Routes for Ratings --------------- //
router.post("/rate-driver", RatingsController.createRideRating);
router.get("/driver-ratings/:driverId", RatingsController.getRetingByDriverID);

// ---------------------------------------------------- //

//------------------Export module----------------//
module.exports = router;
