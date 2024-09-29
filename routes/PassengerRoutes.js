// Purpose: To handle the passenger related operations.

// ---------------------------Importing Packages-------------------------- //
const express = require("express");
const PassengerController = require("../controllers/PassengerController");
const router = express.Router();
// ----------------------------------------------------------------------- // 


// ------------------- Routes for Passenger ---------------- //
router.post("/login", PassengerController.PassengerLogin);
router.post("/register", PassengerController.PassengerRegister);
router.post('/book-ride', PassengerController.bookRide);

// ------------------------------------------------------ //

// ----------------------- Administrator functions ----------------------- //
router.get("/totalPassengers", PassengerController.getTotalPassengerCount);
router.get("/allPassengers", PassengerController.getTotalPassenger);
router.put("/updatePassengerStatus/:id", PassengerController.updatePassengerStatus);
router.put("/deletePassenger/:id", PassengerController.deletePassenger);
router.get("/getPassenger/:id", PassengerController.getPassengerById);
// ----------------------------------------------------------------------- //

//------------------Export module----------------//

module.exports = router;

//-----------------------------------------------//
