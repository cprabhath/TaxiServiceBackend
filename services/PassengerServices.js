//---------------------------Importing Packages--------------------------//
const ResponseService = require("../services/ResponseService");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require("../services/db");

//-----------------------------------------------------------------------//

// ------------------------------ Login ---------------------------------//
const login = async (res, email) => { 
      
    // Generate JWT token
    const token = jwt.sign({ userId: db.passengers.id, email: email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return {
        token,
        user: {
            id: db.passengers.id,
            email: db.passengers.email,
            name: db.passengers.fullName,
        },
    };

}

// ------------------------------ Get User By email ----------------------//
const getUserByEmail = async (email) => {
    try {
        const user = await db.passengers.findFirst({
            where: {
                email: email,
            },
        });
        return user;
    } catch (err) {
        console.error("Error fetching user: ", err);
    }
}

//---------------------------Register a passenger---------------//

const registerPassenger = async (fullname, email, password, username, nic, phone, address) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw new Error("Passenger already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new passenger document
        await db.passengers.create({
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
        const token = jwt.sign({ userId: passenger._id, email: passenger.email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        return ResponseService(res, 200, {
            token,
            user: {
                id: passenger._id,
                email: passenger.email,
                fullName: passenger.fullName,
            },
        });
    } catch (err) {
        console.error("Error registering passenger: ", err);
    }
}




// ---------------- Export the modules ------------------
module.exports = {
    getUserByEmail,
    registerPassenger,
    login
};

// ------------------------------------------------------