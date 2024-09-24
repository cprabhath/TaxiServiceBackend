//---------------------------Importing Packages--------------------------//
const ResponseService = require("../services/ResponseService");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require("../services/db");

//-----------------------------------------------------------------------//

// ------------------------------ Login ---------------------------------//
const login = async (res, email) => {   
    // Generate JWT token
    const token = jwt.sign({ userId: db.drivers.id, email: email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return {
        token,
        user: {
            id: db.drivers.id,
            email: db.drivers.email,
            name: db.drivers.fullName,
        },
    };

}

// ------------------------------ Get User By email ----------------------//
const getUserByEmail = async (email) => {
    try {
        const user = await db.drivers.findFirst({
            where: {
                email: email,
            },
        });
        return user;
    } catch (err) {
        console.error("Error fetching user: ", err);
    }
}

//---------------------------Register a driver---------------//

const registerDriver = async (fullname, email, password, username, nic, phone, address) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw new Error("Driver already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new driver document
        await db.drivers.create({
            data: {
                email: email,
                fullName: fullname,
                username: username,
                nic: nic,
                phone: phone,
                address: address,
                password: hashedPassword,
                isEmailVerified: false
            }
        });

        // Generate JWT token
        const token = jwt.sign({ userId: driver._id, email: driver.email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        return ResponseService(res, 200, {
            token,
            user: {
                id: driver._id,
                email: driver.email,
                fullName: driver.fullName,
            },
        });
    } catch (err) {
        console.error("Error registering driver: ", err);
    }
}

// --------------------------- Update Driver Status ----------------------//
const updateDriverStatus = async (driverId, status) => {
    try {
        await db.drivers.update({
            where: {
                id: driverId,
            },
            data: {
                status: status,
            },
        });
    } catch (err) {
        console.error("Error updating driver status: ", err);
    }
}
// ----------------------------------------------------------------------//


// ---------------- Export the modules ------------------
module.exports = {
    getUserByEmail,
    registerDriver,
    login
};

// ------------------------------------------------------