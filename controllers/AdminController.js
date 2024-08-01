// Purpose: To handle the admin related operations.

//---------------------------Importing Packages--------------------------//
const jwt = require("jsonwebtoken");
const adminServices = require("../services/AdminServices");
const emailServices = require("../services/EmailService");
//-----------------------------------------------------------------------//

// ------------------------------ Login ---------------------------------//
const Login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Please provide your username" });
  }

  const { username, otp } = req.body;

  // Checking if the username is provided
  if (username === "") {
    return res.status(400).json({ message: "Please provide your username" });
  }

  try {
    const existingUser = await adminServices.getAdminByUsername(username);

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!existingUser.isEmailVerified) {
      return res.status(401).json({ message: "Email is not verified" });
    }

    if (!otp) {
      // Generate an OTP and save it to the user record
      const generatedOtp = await adminServices.generateOTP();

      // Send OTP to user's email or phone (implementation required)
      const email = existingUser.email;

      emailServices
        .sendEmail(res, email, "Verification", {
          heading: "One Time Password",
          username: existingUser.username,
          token: generatedOtp,
        })
        .then(async (emailSent) => {
          if (emailSent) {
            await adminServices.updateAdminOtp(username, generatedOtp);
            return res.status(200).json({ message: "OTP sent to your email" });
          } else {
            return res.status(500).json({ message: "ERROR " + err });
          }
        })
        .catch((err) => {
          return res.status(500).json({ message: "ERROR " + err });
        });
    } else {
      // Check if the OTP is correct
      if (otp !== existingUser.otp) {
        return res.status(401).json({ message: "Invalid OTP" });
      }

      // Generating the token
      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Removing the OTP after use
      await adminServices.removeOTP(username);

      // Returning the token
      return res.status(200).json({ token });
    }
  } catch (err) {
    return res.status(500).json({ message: "ERROR " + err });
  }
};

// ----------------------------------------------------------------------//

// ------------------------------ Register ------------------------------//
const Register = async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Please provide required information" });
  }
  const { fullName, username, email } = req.body;

  //Checking if the email and password are provided
  if ((email === "", fullName === "", username === "")) {
    return res
      .status(400)
      .json({ message: "Please provide required information" });
  }

  //Checking if the email exists in the database
  try {
    const existingUser = await adminServices.getAdminByUsername(username);

    if (!existingUser) {
      //Creating the user
      await adminServices
        .registerAdmin(fullName, username, email)
        .then((response) => {
          return res.status(201).json({ message: response.message });
        })
        .catch((err) => {
          return res.status(500).json({ message: "ERROR " + err.message });
        });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    return res.status(500).json({ message: "ERROR " + err.message });
  }
};
// ----------------------------------------------------------------------//

// -------------------------- Exporting the module ----------------------//
module.exports = {
  Login,
  Register,
};
// ----------------------------------------------------------------------//
