// ------------------------ Import functions ---------------------------//
const ResponseService = require("../services/ResponseService");
const PhoneOperatorService = require("../services/PhoneOperatorService");
const bcrypt = require("bcrypt");
const db = require("../services/db");
const jwt = require("jsonwebtoken");
//-----------------------------------------------------------------------//

// ------------------------------ Login ---------------------------------//
const Login = async (req, res) => {
  const { username, password } = req.body;

  // Checking if the user exists
  const existingUser = await PhoneOperatorService.getPhoneOperatorByUsername(
    username
  );

  if (!existingUser) {
    return ResponseService(res, "Error", 404, "Phone Operator does not exist!");
  }

  // Checking if the password is correct
  const validPassword = await bcrypt.compare(password, existingUser.password);

  if (!validPassword) {
    return ResponseService(res, "Error", 400, "Invalid Password!");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: existingUser.id,
      username: existingUser.username,
      role: existingUser.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return ResponseService(res, "Success", 200, {
    token,
    user: {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    },
  });
};

// ------------------------------ Register ---------------------------------//
const Register = async (req, res) => {
  const { email, fullName, username, nic, password, phone, address } = req.body;

  // Checking if the user exists
  const existingUser = await PhoneOperatorService.getPhoneOperatorByUsername(
    username
  );

  if (existingUser) {
    return ResponseService(res, "Error", 400, "Phone Operator already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new phone operator document
  await db.phoneOperator.create({
    data: {
      email: email,
      fullName: fullName,
      username: username,
      nic: nic,
      password: hashedPassword,
      phone: phone,
      address: address,
      isEmailVerified: false,
    },
  });

  return ResponseService(
    res,
    "Success",
    201,
    "Phone Operator registered successfully!"
  );
};
//-----------------------------------------------------------------------//

// -------------------------------- admin functions --------------------------------//
// ------------------------------ getPhoneOperatorProfile ------------------------------//
const getPhoneOperatorProfile = async (req, res) => {
  const userId = req.params.id;

  const phoneOperator = await db.phoneOperator.findUnique({
    where: {
      id: parseInt(userId),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      username: true,
      nic: true,
      phone: true,
      address: true,
    },
  })

  return ResponseService(res, "Success", 200, phoneOperator);
};
// -------------------------------------------------------------------------------------//

// ------------------------------ updatePhoneOperatorProfile ------------------------------//
const updatePhoneOperatorProfile = async (req, res) => {
  const userId = req.params.id;

  const { email, fullName, nic, phone, address } = req.body;

  await db.phoneOperator.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      email: email,
      fullName: fullName,
      nic: nic,
      phone: phone,
      address: address,
    },
  });

  return ResponseService(res, "Success", 200, "Profile updated successfully!");
};
// -----------------------------------------------------------------------//

// ------------------------------ getAllPhoneOperators ------------------------------//
const getAllPhoneOperators = async (req, res) => {
  const phoneOperators = await db.phoneOperator.findMany({
    where: {
      deletedAt: null,
    }
  });
  return ResponseService(res, "Success", 200, phoneOperators);
};
// -----------------------------------------------------------------------//

// ------------------------------ updateOperatorStatus ------------------------------//
const updateOperatorStatus = async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  await db.phoneOperator.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      status: status,
    },
  });

  return ResponseService(res, "Success", 200, "Operator status updated successfully!");
};
// -----------------------------------------------------------------------//

// ------------------------------ deletePhoneOperator ------------------------------//
const deletePhoneOperator = async (req, res) => {
  const userId = req.params.id;

  await db.phoneOperator.update({
    where: {
      id: parseInt(userId),
    },
    data:{
      deletedAt: new Date(),
    }
  });

  return ResponseService(res, "Success", 200, "Operator deleted successfully!");
};
// -----------------------------------------------------------------------//

// ------------------------------ getAllUsernames ------------------------------//
const getAllUsernames = async (req, res) => {
  const usernames = await db.phoneOperator.findMany({
    select: {
      username: true,
    }
  });

  return ResponseService(res, "Success", 200, usernames);
};
// -----------------------------------------------------------------------//
// ------------------------------ Exporting the functions ------------------------------//
module.exports = {
  Login,
  Register,
  getPhoneOperatorProfile,
  updatePhoneOperatorProfile,
  getAllPhoneOperators,
  updateOperatorStatus,
  deletePhoneOperator,
  getAllUsernames,
};
