//---------------------------Importing Packages--------------------------//
const ResponseService = require("../services/ResponseService");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require("../services/db");

//-----------------------------------------------------------------------//

// ------------------------------ Login ---------------------------------//
const login = async (res, email) => { 
    // Check if the user exists
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        throw new Error("User not found");
    }

    // Generate JWT token
    const token = jwt.sign({ 
        userId: existingUser.id,
        email: existingUser.email,
        role : existingUser.role

     }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return {
        token,
        user: {
            id: existingUser.id,
            email: existingUser.email,
            fullName: existingUser.fullName,
        },
    };
}

//-------------get image and id of ride-------------//

const getVehiclesByType = async (type )=>{
        try {
            console.log("called");
          const vehicles = await db.vehicle.findMany({
            where: {
              vehicleType: type,
              isVehicleVerified: true,
              deletedAt: null,
            },
            select: {
              id: true,
              vehicleNumber: true,
              vehicleType: true,
              ImagePath: true,
            },
          });
          return vehicles;
        } catch (error) {
          console.error('Error fetching vehicles by type:', error);
          throw new Error('Unable to fetch vehicles.');
        }
}

// ------------------------------ Get User By email ----------------------//
const getUserByEmail = async (email) => {
    try {
        const user = await db.passenger.findFirst({ // UPDATED
            where: {
                email: email,
                deletedAt: null,
            },
        });
        return user;
    } catch (err) {
        console.error("Error fetching user: ", err);
    }
}

//---------------------------Register a passenger---------------//
// --------------------- UPDATED PARAMETERS ---------------------
const registerPassenger = async (email, fullname, username, nic, phone, address, password) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw new Error("Passenger already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new passenger document
        await db.passenger.create({
            data: {
                email: email,
                fullName: fullname,
                username: username,
                nic: nic,
                phone: phone,
                address: address,
                password: hashedPassword,
                isEmailVerified: false,
                isTemporary: false,
            }
        });

        // Generate JWT token
        const token = jwt.sign({ userId: passenger._id, email: passenger.email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        return {
            token,
            user: {
                id: passenger.id,
                email: passenger.email,
                fullName: passenger.fullName,
            },
        };
    } catch (err) {
        console.error("Error registering passenger: ", err);
    }
}

// ---------------------------------- admin functions -------------------------------- //
// ----------------------------- Get total passengers ----------------------------- //
const getTotalPassengerCount = async () => {
    try {
        const totalPassengers = await db.passenger.count(); // UPDATED
        return totalPassengers;
    } catch (err) {
        console.error("Error getting total passengers: ", err);
    }
}
// --------------------------------------------------------------------------------- //

//---------------------------Book a Ride---------------//
const bookRide = async (bookingData) => {
    try {
        await db.rides.create({
            data: {
                passengerId: parseInt(bookingData.passengerId),
                pickupLocation: bookingData.currentPlaceName,
                dropLocation: bookingData.destination,
                distance: bookingData.distance,
                duration: bookingData.duration,
                cost: bookingData.cost,
                vehicleId: parseInt(bookingData.vehicleId),
            },
        });
        return { success: true, message: "Ride booked successfully." };
    } catch (error) {
        console.error("Error booking the ride:", error);
        return { success: false, message: "Failed to book the ride." };
    }
};


// ---------------- Export the modules ------------------
module.exports = {
    getUserByEmail,
    registerPassenger,
    login,
    bookRide,
    getTotalPassengerCount,
    getVehiclesByType,
};

// ------------------------------------------------------