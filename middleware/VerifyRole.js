// Purpose Check user's authentication levels such as admin, phone Operator, driver, etc.
// -------------------------- Importing Modules --------------------------
const verifyToken = require("../services/VerificationService");
const ResponseService = require("../services/ResponseService");
// -----------------------------------------------------------------------

// -------------------------- Verify Admin -------------------------------
const VerifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return ResponseService(res, "Error", 401, "Access Denied! No token provided");
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.role !== "admin") {
      return ResponseService(res, "Error", 403, "Access Denied! You are not an admin");
    }
    next();
  } catch (err) {
    return ResponseService(res, "Error", 400, err);
  }
};

// -------------------------- Verify Phone Operator -------------------------------
const VerifyPhoneOperator = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return ResponseService(res, "Error", 401, "Access Denied! No token provided");
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.role !== "phoneOperator") {
      return ResponseService(res, "Error", 403, "Access Denied! You are not a phone operator");
    }
    next();
  } catch (err) {
    return ResponseService(res, "Error", 400, err);
  }
};
// --------------------------------------------------------------------------------

const VerifyDriver = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return ResponseService(res, "Error", 401, "Access Denied! No token provided");
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.role !== "driver") {
      return ResponseService(res, "Error", 403, "Access Denied! You are not a driver");
    }
    next();
  } catch (err) {
    return ResponseService(res, "Error", 400, err);
  }
};
// --------------------------------------------------------------------------------

// ---------------------------- Verify passenger -------------------------------
const VerifyPassenger = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return ResponseService(res, "Error", 401, "Access Denied! No token provided");
  }

  try {
    const decoded = await verifyToken(token);
    if (decoded.role !== "passenger") {
      return ResponseService(res, "Error", 403, "Access Denied! You are not a passenger");
    }
    next();
  } catch (err) {
    return ResponseService(res, "Error", 400, err);
  }
};

// --------------------------------------------------------------------------------

// -------------------------- Exporting Modules -----------------------------------
module.exports = {
    VerifyAdmin,
    VerifyPhoneOperator,
    VerifyDriver,
    VerifyPassenger
};
// --------------------------------------------------------------------------------