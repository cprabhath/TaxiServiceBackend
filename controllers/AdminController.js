// Purpose: To handle the admin related operations.

//---------------------------Importing Packages--------------------------//
const jwt = require("jsonwebtoken");
const adminServices = require("../services/AdminServices");
const emailServices = require("../services/EmailService");
const ResponseService = require("../services/ResponseService");
const AdminServices = require("../services/AdminServices");
const db = require("../services/db");
const bcrypt = require("bcrypt");
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

    // send admin details

    // Removing the OTP after use
    await adminServices.removeOTP(username);

    // Returning the token
    return ResponseService(res, "Success", 200, {
      token,
      user: existingUser,
    });
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
  const { fullName, profileImage, username, email } = req.body;

  //Checking if the email and password are provided
  if ((email === "", fullName === "", username === "", profileImage === "")) {
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
        .registerAdmin(fullName, profileImage, username, email)
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

// ----------------------------- getAdminProfile -------------------------//
const getAdminProfile = async (req, res) => {
  const { id } = req.body;

  try {
    const admin = await adminServices.getAdminById(id);

    if (!admin) {
      return ResponseService(res, "Error", 404, "Admin not found");
    }

    return ResponseService(res, "Success", 200, admin);
  } catch (err) {
    return ResponseService(res, "Error", 500, "ERROR " + err.message);
  }
};
// ----------------------------------------------------------------------//

// ----------------------------- updateAdminProfile ----------------------//
const updateAdminProfile = async (req, res) => {
  const { id } = req.body;
  const { fullName, username, email, imageUrl } = req.body;

  try {
    const admin = await adminServices.getAdminById(id);

    if (!admin) {
      return ResponseService(res, "Error", 404, "Admin not found");
    }

    await adminServices
      .updateAdminProfile(id, fullName, username, email, imageUrl)
      .then((response) => {
        return ResponseService(res, "Success", 200, response.message);
      })
      .catch((err) => {
        return ResponseService(res, "Error", 500, "ERROR " + err.message);
      });
  } catch (err) {
    return ResponseService(res, "Error", 500, "ERROR " + err.message);
  }
};
// ----------------------------------------------------------------------//

// ---------------------------- get total income -------------------------//
const getTotalIncome = async (req, res) => {
  try {
    const totalIncome = await adminServices.getTotalIncome();

    return ResponseService(res, "Success", 200, totalIncome);
  } catch (err) {
    return ResponseService(res, "Error", 500, "ERROR " + err.message);
  }
};
// ----------------------------------------------------------------------//

// -------------------------------- get net income -----------------------//
const getNetIncome = async (req, res) => {
  try {
    const netIncome = await adminServices.getNetIncome();

    return ResponseService(res, "Success", 200, netIncome);
  } catch (err) {
    return ResponseService(res, "Error", 500, "ERROR " + err.message);
  }
};
// ----------------------------------------------------------------------//

// ------------------------- Phone Operator add by admin -----------------//
const addPhoneOperator = async (req, res) => {
  const { email, fullName, username, nic, phone, address } = req.body;

  try {
    const existingOperator = await db.phoneOperator.findUnique({
      where: {
        email: email,
      },
    });

    if (existingOperator) {
      return ResponseService(res, "Error", 400, "Operator already exists");
    }

    const OTP = await AdminServices.generateOTP();

    hashedOTP = await bcrypt.hash(OTP, 10);

    await db.phoneOperator.create({
      data: {
        email: email,
        fullName: fullName,
        username: email,
        nic: nic,
        password: hashedOTP,
        phone: phone,
        address: address,
      },
    });

    const emailSent = await emailServices.sendEmail(res, email, "Password", {
      heading: "One Time Password",
      username: fullName.toUpperCase(),
      token: "Your username is : " + email + " and password is : " + OTP,
    });

    if (emailSent) {
      return ResponseService(
        res,
        "Success",
        200,
        "Operator added successfully"
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
    return { message: "ERROR " + err.message };
  }
};

// -------------------------- Exporting the module ----------------------//
module.exports = {
  Login,
  Register,
  getAdminProfile,
  updateAdminProfile,
  getTotalIncome,
  getNetIncome,
  addPhoneOperator,
};
// ----------------------------------------------------------------------//
