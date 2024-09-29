// Purpose: To handle the admin related operations.
// ------------------Importing Packages---------------- //
const express = require("express");
const AdminController = require("../controllers/AdminController");
const VerifyRole = require("../middleware/VerifyRole");
const router = express.Router();
// ---------------------------------------------------- //

// ------------------- Routes for Admin --------------- //
router.post("/login", AdminController.Login);
router.post("/register", AdminController.Register);
router.get("/profile", AdminController.getAdminProfile);
router.put("/update-profile", AdminController.updateAdminProfile);
router.get("/get-net-income", AdminController.getNetIncome); // Not implemented
router.get("/total-income", AdminController.getTotalIncome);
router.post("/add-phone-operator", AdminController.addPhoneOperator);
// ---------------------------------------------------- //

//---------------------Export module------------------- //
module.exports = router;
// ---------------------------------------------------- //
