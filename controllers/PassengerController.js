const ResponseService = require("../services/ResponseService");
const PassengerServices = require("../services/PassengerServices");
const bcrypt = require("bcrypt");

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
const PassengerRegister = (req, res) => {
  // Checking if the user exists
  const { fullname, email, password, username, nic, phone, address } = req.body;

  // Create a new user
  try {
    const passenger = PassengerServices.registerPassenger(
      email,
      fullname,
      username,
      nic,
      phone,
      address,
      password
    );
    return ResponseService(res, "Success", 201, passenger);
  } catch (ex) {
    console.error("Error registering passenger: ", ex);
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
};
