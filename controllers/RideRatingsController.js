// --------------------------- Importing Modules --------------------------
const ResponseService = require("../services/ResponseService");
const db = require("../services/db");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// -----------------------------------------------------------------------//

// -------------------------- create a new ride rating ---------------------
const createRideRating = async (req, res) => {
    const { driverId, passengerId, rating, review } = req.body;

    try {
        // Create a new ride rating
        await db.driverRatings.create({
            data: {
                driverId: parseInt(driverId),
                passengerId: parseInt(passengerId),
                rating: parseInt(rating),
                comment: review
            }
        });

        return ResponseService(res, "Success", 201, "Ride rating created successfully!");
    } catch (ex) {
        console.error("Error creating ride rating: ", ex);
        return ResponseService(res, "Error", 500, "Failed to create ride rating");
    }
};
// -----------------------------------------------------------------------//

// -------------------------- Get all ride ratings ------------------------
const getRetingByDriverID = async (req, res) => {
    const driverId = req.params.driverId;
    try {
        const ratings = await db.driverRatings.findMany({
            where: {
                driverId: parseInt(driverId)
            }
        });

        return ResponseService(res, "Success", 200, ratings);
    } catch (ex) {
        console.error("Error fetching ride ratings: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch ride ratings");
    }
};
// -----------------------------------------------------------------------//


// -------------------------- Export Module -----------------------------
module.exports = {
    createRideRating,
    getRetingByDriverID
}
// -----------------------------------------------------------------------//