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
    { userId: existingUser.id, username: username },
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

// ------------------------------ Exporting the functions ------------------------------//
module.exports = {
  Login,
  Register,
};
