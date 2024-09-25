// Purpose of this snippet: To handle the phone operator related operations.

// ---------------------------Importing Packages-------------------------- //
const express = require("express");
const PhoneOperatorController = require("../controllers/PhoneOperatorController");
const router = express.Router();
// ----------------------------------------------------------------------- //

// ------------------- Routes for Phone Operator ---------------- //
router.post("/login", PhoneOperatorController.Login);
router.post("/register", PhoneOperatorController.Register);
// ------------------------------------------------------ //

//------------------Export module----------------//
module.exports = router;