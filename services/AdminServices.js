// ------------------- ADMIN SERVICES -------------------

// --------- Import the required modules ----------------
const db = require("../services/db");
const emailServices = require("./EmailService");
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
                    otp: null,
                },
            });
        } catch (err) {
            console.error("ERROR " + err.message);
        }
    }, 5000);
}
// ------------------------------------------------------

// ----------------- Register an Admin ------------------
const registerAdmin = async (fullName, profileImage, username, email) => {
    try {
        const existingUser = await getAdminByUsername(username);

        if (!existingUser) {
            // Generate OTP
            const OTP = generateOTP();
            await db.admin.create({
                data: {
                    fullName: fullName,
                    profileImage: profileImage,
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
// ------------------------------------------------------

// ----------------- get Admin by ID --------------------
const getAdminById = async (id) => {
    try {
        const admin = await db.admin.findUnique({
            where: {
                id: id,
            },
        });
        return admin;
    } catch (err) {
        console.error("ERROR " + err.message);
        return null;
    }
};
// ------------------------------------------------------

// ----------------- Update Admin Profile ----------------
const updateAdminProfile = async (id, fullName, username, email, imageUrl) => {
    try {
        await db.admin.update({
            where: {
                id: id,
            },
            data: {
                fullName: fullName,
                profileImage : imageUrl,
                username: username,
                email: email,
            },
        });
        return { message: "Profile updated successfully" };
    } catch (err) {
        console.error("ERROR " + err.message);
        return { message: "ERROR " + err.message };
    }
};
// ------------------------------------------------------

// ----------------- Get Total Income -------------------
const getTotalIncome = async () => {
    try {
        const rides = await db.rides.findMany({
            select: {
                cost: true,
            },
            where: {
                status: "Pending",
            }
        });
                const totalIncome = rides.reduce((total, ride) => {
            const rideCost = parseFloat(ride.cost);
            return total + (isNaN(rideCost) ? 0 : rideCost);
        }, 0);
        
        return totalIncome;
    } catch (err) {
        console.error("ERROR " + err.message);
        return null;
    }
};
// ------------------------------------------------------

// ------------------- get net income -------------------
const getNetIncome = async () => {
    try {
       return "Not implemented";
    } catch (err) {
        console.error("ERROR " + err.message);
        return null;
    }
}


// ---------------- Export the modules ------------------
module.exports = {
    getAdminByUsername,
    updateAdminOtp,
    registerAdmin,
    generateOTP,
    removeOTP,
    getAdminById,
    updateAdminProfile,
    getTotalIncome,
    getNetIncome,
};
// ------------------------------------------------------