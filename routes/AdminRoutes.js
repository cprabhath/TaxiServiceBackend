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
// ---------------------------------------------------- //

//---------------------Export module------------------- //
module.exports = router;
// ---------------------------------------------------- //