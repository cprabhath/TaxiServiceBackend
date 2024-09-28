const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../services/db");
const { sendPasswordEmail } = require("../services/EmailService");
const ResponseService = require("../services/ResponseService");
const PassengerServices = require("../services/PassengerServices");
const { log } = require("console");

// Function to generate a random password if one is not provided
const generatePassword = () => {
  return crypto.randomBytes(6).toString("hex"); // Generates a 12-character random password
};

//----------------------------------Passenger Login--------------------------------//
const PassengerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Await the result of fetching the user by email
    const existingUser = await PassengerServices.getUserByEmail(email);

    // Check if the user exists
    if (!existingUser) {
      return ResponseService(res, "Error", 404, "Seems like you are not registered yet!");
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, existingUser.password);

    // If password does not match, send error response
    if (!isMatch) {
      return ResponseService(res, "Error", 401, "Invalid email or password!");
    }

    // If login is successful, generate a token or return user details
    const token = await PassengerServices.login(res, email); // Await if it's an async function
    return ResponseService(res, "Success", 200, token);
  } catch (error) {
    console.log("Error during login: ", error);
    return ResponseService(res, "Error", 500, "An error occurred during login");
  }
};

//----------------------------------Passenger Register--------------------------------//
const PassengerRegister = async (req, res) => {
  const { fullname, email, password, username, nic, phone, address } = req.body;

  try {

    // If password is not provided, generate one
    let plainPassword = password || generatePassword();

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 is the salt rounds

    // Register passenger with hashed password
    const passenger = await PassengerServices.registerPassenger(
      email,
      fullname,
      username,
      nic,
      phone,
      address,
      hashedPassword
    );

    // Prepare email data
    const emailData = {
      fullName: fullname,
      email: email,
      password: plainPassword, // Send plain password in the email
    };

    console.log("Passenger registration details:", fullname, email, plainPassword);

    // Send welcome email to the user with the plain password
    const emailSent = await sendPasswordEmail(email, 'Your Account Details', emailData);

    if (!emailSent) {
      return ResponseService(res, "Error", 500, "Failed to send registration email");
    }

    // Respond with the registered passenger data (but not the plain password)
    return ResponseService(res, "Success", 201, passenger);
  } catch (ex) {
    console.error("Error registering passenger:", ex);
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

// ------------------------------- Get total passengers ---------------------------- //
const getTotalPassenger = async (req, res) => {
  try {
    const totalPassengers = await db.passenger.findMany({
      where: {
        deletedAt: null,
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
      },
    });
    return ResponseService(res, "Success", 200, totalPassengers);
  } catch (err) {
    console.error("Error getting total passengers: ", err);
    return ResponseService(res, "Error", 500, "Failed to get total passengers");
  }
};

// ------------------------------- Update Passenger Status ------------------------- //
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

// ------------------------------- Delete Passenger -------------------------------- //
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

// ------------------------------- Get Passenger By ID ----------------------------- //
const getPassengerById = async (req, res) => {
  try {
    const userID = req.params.id;
    const passenger = await db.passenger.findUnique({
      where: {
        id: parseInt(userID),
        deletedAt: null,
      },
      include: {
        operator: true,
      },
    });
    return ResponseService(res, "Success", 200, passenger);
  } catch (err) {
    console.error("Error getting passenger: ", err);
    return ResponseService(res, "Error", 500, "Failed to get passenger");
  }
};

//---------------------------Book a Ride----------------------------------//
const bookRide = async (req, res) => {
  try {
    const bookingData = req.body;

    // Call the service to book the ride
    const result = await PassengerServices.bookRide(bookingData);

    if (result.success) {
      return ResponseService(res, "Success", 200, {
        message: "Ride booked successfully!",
        bookingId: result.bookingId,
      });
    } else {
      return ResponseService(res, "Error", 500, "Error booking the ride.");
    }
  } catch (error) {
    console.error("Error occurred during ride booking:", error);
    return ResponseService(res, "Error", 500, "An unexpected error occurred.");
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
