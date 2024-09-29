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

// -------------------------- admin functions -------------------------- //
router.get("/profile/:id", PhoneOperatorController.getPhoneOperatorProfile);
router.put("/update-status/:id", PhoneOperatorController.updateOperatorStatus);
router.put("/update-profile/:id", PhoneOperatorController.updatePhoneOperatorProfile);
router.put("/delete/:id", PhoneOperatorController.deletePhoneOperator);
router.get("/get-all", PhoneOperatorController.getAllPhoneOperators);
router.get("/get-all-usernames", PhoneOperatorController.getAllUsernames);
// ----------------------------------------------------------------------- //

//------------------Export module----------------//
module.exports = router;