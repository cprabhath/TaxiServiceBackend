// Purpose: To handle the admin related operations.

//---------------------------Importing Packages--------------------------//
const jwt = require("jsonwebtoken");
const adminServices = require("../services/AdminServices");
const emailServices = require("../services/EmailService");
const ResponseService = require("../services/ResponseService");
//-----------------------------------------------------------------------//

let emailCount = 0;

// ------------------------------ Login ---------------------------------//
const Login = async (req, res) => {
  const { username, otp } = req.body;

  // Checking if the user exists
  const existingUser = await adminServices.getAdminByUsername(username);

  if (!existingUser) {
    return ResponseService(
      res,
      "Error",
      404,
      "Seems like you are not registered yet!"
    );
  }

  if (!existingUser.isEmailVerified) {
    return ResponseService(
      res,
      "Error",
      400,
      "Seems like you haven't verified your email yet!"
    );
  }

  // Checking if the user has exceeded the number of OTP requests
  if (emailCount > 3) {
    return ResponseService(
      res,
      "Error",
      400,
      "You have exceeded the number of OTP requests. Before trying again, Please check your email first!"
    );
  }

  if (!otp) {
    // Generate an OTP and save it to the user record
    const generatedOtp = await adminServices.generateOTP();

    // Send OTP to user's email
    const email = existingUser.email;

    try {
      const emailSent = await emailServices.sendEmail(
        res,
        email,
        "Verification",
        {
          heading: "One Time Password",
          username: existingUser.username.toUpperCase(),
          token: generatedOtp,
        }
      );

      if (emailSent) {
        emailCount = emailCount + 1;
        await adminServices.updateAdminOtp(username, generatedOtp);
        return ResponseService(
          res,
          "Send",
          200,
          "OTP has been sent to your email Address!"
        );
      } else {
        return ResponseService(
          res,
          "Error",
          400,
          "Failed to send the OTP. Please try again!"
        );
      }
    } catch (err) {
      return ResponseService(res, "Error", 500, "ERROR " + err.message);
    }
  } else {
    // Check if the OTP is correct
    if (otp !== existingUser.otp) {
      return ResponseService(
        res,
        "Error",
        400,
        "Seems like the OTP is incorrect"
      );
    }

    // Generating the token
    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Removing the OTP after use
    await adminServices.removeOTP(username);

    // Returning the token
    return ResponseService(res, "Success", 200, token);
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
