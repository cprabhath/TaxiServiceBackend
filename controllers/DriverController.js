const ResponseService = require("../services/ResponseService");
const DriverServices = require("../services/DriverServices");
const bcrypt = require('bcrypt');
const db = require("../services/db");


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
        const token = await DriverServices.login(email);  // Await if it's an async function
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
// this function is used to update the status of the driver like busy, available
const updateDriverStatus = async (req, res) => {
    const { driverId } = req.params;
    const { status } = req.body; // Expecting the status to be in the request body

    if (!driverId || !status) {
        return res.status(400).json({ message: "Driver ID and status are required." });
    }

    try {
        await DriverServices.updateDriverStatus(driverId, status);
        return res.status(200).json({ message: "Driver status updated successfully!" });
    } catch (error) {
        console.error("Error updating driver status: ", error);
        return res.status(500).json({ message: "Failed to update driver status" });
    }
};

// ----------------------------------------------------------------------//

// ----------------------------------- get all drivers ----------------------------//
const getAllDrivers = async (req, res) => {
    try {
        const drivers = await db.drivers.findMany({
            where: {
                deletedAt: null
            }
        });
        return ResponseService(res, "Success", 200, drivers);
    } catch (ex) {
        console.error("Error fetching drivers: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch drivers");
    }
}



// ----------------------------------new update ------------------------------------//


//----------------------------------fetch driver profile---------------------------//

// ---------------------------------- Fetch Driver Profile ---------------------------//
// This function fetches the profile details of the driver
const getDriverProfile = async (req, res) => {
    const { driverId } = req.body;

    try {
        const driverProfile = await DriverServices.getDriverProfile(driverId);
        return ResponseService(res, "Success", 200, driverProfile);
    } catch (ex) {
        console.error("Error fetching driver profile: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch driver profile");
    }
};

//-----------------------------------Get Ride list--------------------------------//
// This function fetches the list of rides assigned to the driver
const getRideList = async (req, res) => {

    try {
        const rideList = await DriverServices.getRideList();
        return ResponseService(res, "Success", 200, rideList);
    } catch (ex) {
        console.error("Error fetching Rides: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch Rides");
    }
}
// ------------------------------------------------------------------------------//


// ---------------------------------- Fetch Vehicle details ---------------------------//
const getVehicleDetails = async (req, res) => {
    const { vehicleId } = req.body;

    try {
        const vehicleDetails = await DriverServices.getVehicleDetails(vehicleId);
        return ResponseService(res, "Success", 200, vehicleDetails);
    } catch (ex) {
        console.error("Error fetching Vehicle Details: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch  Vehicle Details");
    }
}

//--------------------------------update ride status----------------------------//
const updateRideStatus = async (req, res) => {
    const { rideId } = req.params;
    const { status } = req.body;

    console.log(`Received request to update ride ID: ${rideId} to status: ${status}`);

    try {
        if (!rideId || !status) {
            return ResponseService(res, "Ride ID and status are required", 400);
        }

        // Parse rideId to an integer
        const rideIdInt = parseInt(rideId, 10);
        if (isNaN(rideIdInt)) {
            return ResponseService(res, "Invalid Ride ID", 400);
        }

        const updatedRide = await DriverServices.updateRideStatus(rideIdInt, status);
        
        if (updatedRide) {
            return ResponseService(res, "Success", 200, updatedRide);
        } else {
            console.log(`No ride found with ID: ${rideIdInt}`);
            return ResponseService(res, "Failed to update ride status", 400);
        }
    } catch (ex) {
        console.error("Error updating ride status: ", ex);
        return ResponseService(res, "Error", 500, "Failed to update ride status");
    }
};



//-------------------------------------------------------------------------------------//

// ---------------------------------- Get Rides count -----------------------------//
// This function fetches the count of rides assigned to the driver
const getTotalRidesCount = async (req, res) => {

    const { driverId } = req.body

    try{
        const rideList = await DriverServices.getTotalCount(driverId);
        return ResponseService(res, "Success", 200, rideList);
    } catch (ex){
        console.error("Error fetching rides count", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch count");
    }
}

// ---------------------------- get total earnings -------------------------//

const getTotalEarnings = async (req, res) => {
    const { driverId } = req.body

    try {
      const totalEarning = await DriverServices.getTotalEarnings(driverId);
  
      return ResponseService(res, "Success", 200, totalEarning);
    } catch (err) {
      return ResponseService(res, "Error", 500, "ERROR " + err.message);
    }
  };
  // ----------------------------------------------------------------------//



// ----------------------------------- Administrator functions -----------------------------------//

// ----------------------------------- Get total count of drivers -----------------------------------//
const getTotalDriverCount = async (req, res) => {
    try {
        const totalDrivers = await DriverServices.getTotalDriverCount();
        return ResponseService(res, "Success", 200, totalDrivers);
    } catch (ex) {
        console.error("Error fetching total driver count: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch total driver count");
    }
}
// -------------------------------------------------------------------------------------------------//

// ------------------------------------- get total vehicle count -----------------------------------//

const getTotalVehicleCount = async (req, res) => {
    try {
        const totalVehicles = await DriverServices.getTotalVehicleCount();
        return ResponseService(res, "Success", 200, totalVehicles);
    } catch (ex) {
        console.error("Error fetching total vehicle count: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch total vehicle count");
    }
}

// --------------------------------------- Update driver Profile ----------------------------------------//
const updateDriverProfile = async (req, res) => {
    const driverId =  req.params.driverId
    const { data } = req.body;

    try {
        const updatedProfile = await db.drivers.update({
            where: {
                id: parseInt(driverId)
            },

            data:{
                email: data.email,
                fullName: data.fullName,
                username: data.username,
                nic: data.nic,
                phone: data.phone,
                address: data.address,
                
            }
        })
        return ResponseService(res, "Success", 200, updatedProfile);
    } catch (ex) {
        console.error("Error updating driver profile: ", ex);
        return ResponseService(res, "Error", 500, "Failed to update driver profile");
        
    }
};

// -------------------------------------------------------------------------------------------------//

module.exports = {
    DriverLogin,
    DriverRegister,
    updateDriverStatus,
    getDriverProfile,
    getTotalDriverCount,
    getRideList,
    getTotalRidesCount,
    getTotalVehicleCount,
    getTotalEarnings,
    updateRideStatus,
    getVehicleDetails,
    getAllDrivers,
    updateDriverProfile
}