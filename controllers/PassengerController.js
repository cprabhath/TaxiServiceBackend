const ResponseService = require("../services/ResponseService");
const PassengerServices = require("../services/PassengerServices");
const bcrypt = require("bcrypt");
const db = require("../services/db");
const emailServices = require("../services/EmailService");

//----------------------------------Passenger Login--------------------------------//
const PassengerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Await the result of fetching the user by email
    const existingUser = await PassengerServices.getUserByEmail(email);

    // Check if the user exists 00.

    if (!existingUser) {
      return ResponseService(
        res,
        "Error",
        404,
        "Seems like you are not registered yet!"
      );
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, existingUser.password);

    // If password does not match, send error response
    if (!isMatch) {
      return ResponseService(res, "Error", 401, "Invalid email or password!");
    }

    // If login is successful, you might want to return a token or user details
    const token = await PassengerServices.login(res, email); // Await if it's an async function
    return ResponseService(res, "Success", 200, token);
  } catch (error) {
    console.log(error);
    return ResponseService(res, "Error", 500, "An error occurred during login");
  }
};

//----------------------------------Passenger Register--------------------------------//
const PassengerRegister = async (req, res) => {
  const { fullname, email, nic, phone, address, profileImage, adminID, registeredby } = req.body;

  try {
    // Checking if the user already exists
    const existingUser = await PassengerServices.getUserByEmail(email);

    if (existingUser) {
      return ResponseService(res, "Error", 400, "Passenger already exists");
    }

    // Generate a random password (length of 10 characters)
    const generateRandomPassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
      }
      return password;
    };

    const plainPassword = generateRandomPassword();

    // Hashing the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Creating the new passenger
    const newPassenger = await db.passenger.create({
      data: {
        fullName: fullname,
        email: email,
        username: email,
        nic: nic,
        phone: phone,
        address: address,
        password: hashedPassword,  // Store the hashed password
        isTemporary: registeredby,
        isEmailVerified: false,
        profileImage: profileImage,
        adminId: parseInt(adminID),
      }
    });

    const emailSent = await emailServices.sendEmail(res, email, "Password", {
      heading: "One Time Password",
      username: fullname.toUpperCase(),
      token: "Your username is : " + email + " and password is : " + plainPassword,
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
    return ResponseService(res, "Success", 201, "Passenger registered successfully", {
      plainPassword, // Optional: Include this if you need to share the generated password
    });
  } catch (error) {
    console.error("Error registering passenger:", error);
    return ResponseService(res, "Error", 500, "Failed to register passenger");
  }
};

// -------------------------------- Admin functions -------------------------------- //
// ----------------------------- Get total passengers ----------------------------- //
const getTotalPassengerCount = async (req, res) => {
  try {
    const totalPassengers = await PassengerServices.getTotalPassengerCount();
    return ResponseService(res, "Success", 200, totalPassengers);
  } catch (err) {
    console.error("Error getting total passengers: ", err);
    return ResponseService(res, "Error", 500, "Failed to get total passengers");
  }
};
// --------------------------------------------------------------------------------- //

// ------------------------------- get total passengers ----------------------------- //
const getTotalPassenger = async (req, res) => {

  
  try {
    const totalPassengers = await db.passenger.findMany({
      where:{
        deletedAt: null
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        nic: true,
        phone: true,
        address: true,
        isTemporary: true,
        profileImage: true,
        updatedAt: true,
        createdAt: true,
        operator: true
      },
    });
    return ResponseService(res, "Success", 200, totalPassengers);

  } catch (err) {
    console.error("Error getting total passengers: ", err);
    return ResponseService(res, "Error", 500, "Failed to get total passengers");
  }
};
// --------------------------------------------------------------------------------- //

// ------------------------------- Update Passenger Status ----------------------------- //
const updatePassengerStatus = async (req, res) => {
  try {
    const userID = req.params.id;
    const { status } = req.body;
    await db.passenger.update({
      where: {
        id: parseInt(userID),
      },
      data: {
        status: status,
      },
    });
    return ResponseService(res, "Success", 200, "Passenger status updated successfully!");
  } catch (err) {
    console.error("Error updating passenger status: ", err);
    return ResponseService(res, "Error", 500, "Failed to update passenger status");
  }
};
// --------------------------------------------------------------------------------- //

// ------------------------------- Delete Passenger ----------------------------- //  
const deletePassenger = async (req, res) => {
  try {
    const userID = req.params.id;
    await db.passenger.update({
      where: {
        id: parseInt(userID),
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return ResponseService(res, "Success", 200, "Passenger deleted successfully!");
  } catch (err) {
    console.error("Error deleting passenger: ", err);
    return ResponseService(res, "Error", 500, "Failed to delete passenger");
  }
};
// --------------------------------------------------------------------------------- //

// ------------------------------- Get Passenger By ID ----------------------------- //
const getPassengerById = async (req, res) => {
  try {
    const userID = req.params.id;
    const passenger = await db.passenger.findUnique({
      where: {
        id: parseInt(userID),
        deletedAt: null
      },
      include:{
        operator: true,
        admin: true,
      }
    });

    return ResponseService(res, "Success", 200, passenger);
  } catch (err) {
    console.error("Error getting passenger: ", err);
    return ResponseService(res, "Error", 500, "Failed to get passenger");
  }
};
// --------------------------------------------------------------------------------- //


//---------------------------Book a Ride---------------//
// Book Ride Function
const bookRide = async (req, res) => {
  try {
    const bookingData = req.body;

    // Call the service to book the ride
    const result = await PassengerServices.bookRide(bookingData);

    if (result.success) {
      return res
        .status(200)
        .json({
          message: "Ride booked successfully!",
          bookingId: result.bookingId,
        });
    } else {
      return res
        .status(500)
        .json({ message: "Error booking the ride.", error: result.error });
    }
  } catch (error) {
    console.error("Error occurred during ride booking:", error);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
};

module.exports = {
  PassengerLogin,
  PassengerRegister,
  getTotalPassengerCount,
  bookRide,
  getTotalPassenger,
  updatePassengerStatus,
  deletePassenger,
  getPassengerById,
};