// ------------------- ADMIN SERVICES -------------------

// --------- Import the required modules ----------------
const db = require("../services/db");
// ------------------------------------------------------

// ---------------- getAdminByUsername ------------------
const getAdminByUsername = async (username) => {
    try {
        const admin = await db.admin.findUnique({
            where: {
                username: username,
            },
        });
        return admin;
    } catch (err) {
        console.error("ERROR " + err.message);
        return null;
    }
}
// ------------------------------------------------------

// -------------- Generate 6 digit OTP ------------------
const generateOTP = () => {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    return OTP.toString();
};
// ------------------------------------------------------

// ------------ Remove otp after 5 seconds --------------
const removeOTP = (username) => {
    setTimeout(async () => {
        try {
            await db.admin.update({
                where: {
                    username: username,
                },
                data: {
                    Otp: null,
                },
            });
        } catch (err) {
            console.error("ERROR " + err.message);
        }
    }, 5000);
}
// ------------------------------------------------------

// ----------------- Register an Admin ------------------
const registerAdmin = async (fullName, username, email) => {
    try {
        const existingUser = await getAdminByUsername(username);

        if (!existingUser) {
            // Generate OTP
            const OTP = generateOTP();
            await db.admin.create({
                data: {
                    fullName: fullName,
                    username: username,
                    isEmailVerified: false,
                    email: email,
                    otp: OTP,
                },
            });
            return { message: "User created successfully " + "OTP is : " + OTP };
        } else {
            return { message: "User already exists" };
        }
    } catch (err) {
        console.error("ERROR " + err.message);
        return { message: "ERROR " + err.message };
    }
};
// ------------------------------------------------------

// ----------------- Update Admin OTP -------------------
const updateAdminOtp = async (username, otp) => {
    try {
        await db.admin.update({
            where: {
                username: username,
            },
            data: {
                otp: otp,
            },
        });
    } catch (err) {
        console.error("ERROR " + err.message);
    }
};

// ---------------- Export the modules ------------------
module.exports = {
    getAdminByUsername,
    updateAdminOtp,
    registerAdmin,
    generateOTP,
    removeOTP,
};
// ------------------------------------------------------