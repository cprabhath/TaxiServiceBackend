const ResponseService = require("../services/ResponseService");
const DriverServices = require("../services/DriverServices");
const bcrypt = require('bcrypt');


//----------------------------------Driver Login--------------------------------//
const DriverLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Await the result of fetching the user by email
        const existingUser = await DriverServices.getUserByEmail(email);

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

        // If login is successful, you might want to return a token or user details
        const token = await DriverServices.login(res, email);  // Await if it's an async function
        return ResponseService(res, "Success", 200, token);

    } catch (error) {
        console.log(error)
        return ResponseService(res, "Error", 500, "An error occurred during login");
    }
};


//----------------------------------Driver Register--------------------------------//
const DriverRegister = (req, res) => {
    // Checking if the user exists
    const { fullname, email, password, username, nic, phone, address } = req.body;

    // Create a new user
    try {
        DriverServices.registerDriver(fullname, email, password, username, nic, phone, address);
        return ResponseService(res, "Success", 201, "Driver registered successfully!");
    } catch (ex) {
        console.error("Error registering driver: ", ex);
        return ResponseService(res, "Error", 500, "Failed to register driver");
    }
}

// ------------------------------ Update Driver Status ------------------------------//
// this function is used to update the status of the driver like busy, available, etc.
const UpdateDriverStatus = (req, res) => {
    const { status } = req.body;
    const { driverId } = req.params;

    try {
        DriverServices.updateDriverStatus(driverId, status);
        return ResponseService(res, "Success", 200, "Driver status updated successfully!");
    } catch (ex) {
        console.error("Error updating driver status: ", ex);
        return ResponseService(res, "Error", 500, "Failed to update driver status");
    }
}
// ----------------------------------------------------------------------//




// ----------------------------------new update ------------------------------------//


//----------------------------------fetch driver profile---------------------------//

// ---------------------------------- Fetch Driver Profile ---------------------------//
// This function fetches the profile details of the driver
const getDriverProfile = async (req, res) => {
    const { driverId } = req.params;
    try {
        const driverProfile = await DriverServices.getDriverProfile(driverId);
        return ResponseService(res, "Success", 200, driverProfile);
    } catch (ex) {
        console.error("Error fetching driver profile: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch driver profile");
    }
};




module.exports = {
    DriverLogin,
    DriverRegister,
    UpdateDriverStatus,
    getDriverProfile
}