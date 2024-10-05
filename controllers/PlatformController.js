// --------------------------------- import modules ----------------------------
const ResponseService = require("../services/ResponseService");
const db = require("../services/db");
// -----------------------------------------------------------------------//

// ----------------------- create new platform rate -----------------------
const createPlatformRate = async (req, res) => {
    const { rate } = req.body;

    try {
        // Create a new platform rate
        await db.platformRates.create({
            data: {
                rate: rate,
                status: "Active",
            }
        });

        return ResponseService(res, "Success", 201, "Platform rate created successfully!");
    } catch (ex) {
        console.error("Error creating platform rate: ", ex);
        return ResponseService(res, "Error", 500, "Failed to create platform rate");
    }
};
// ----------------------------------------------------------------------- //

// ------------------------------ update platform rate ---------------------
const updatePlatformRate = async (req, res) => {
    const { id, rate } = req.body;

    try {
        const platformRate = await db.platformRates.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!platformRate) {
            return ResponseService(res, "Error", 404, "Platform rate not found");
        }

        await db.platformRates.update({
            where: {
                id: parseInt(id)
            },
            data: {
                rate: rate
            }
        });

        return ResponseService(res, "Success", 200, "Platform rate updated successfully!");
    } catch (ex) {
        console.error("Error updating platform rate: ", ex);
        return ResponseService(res, "Error", 500, "Failed to update platform rate");
    }
};
// ----------------------------------------------------------------------- //

// ---------------------- Get all platform rates --------------------------
const getAllPlatformRates = async (req, res) => {
    try {
        const platformRates = await db.platformRates.findMany();

        return ResponseService(res, "Success", 200, platformRates);
    } catch (ex) {
        console.error("Error fetching platform rates: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch platform rates");
    }
};
// ----------------------------------------------------------------------- //

// -------------------------- get vehicle rates ---------------------------
const getVehicleRates = async (req, res) => {
    try {
        const vehicleRates = await db.rates.findMany();

        return ResponseService(res, "Success", 200, vehicleRates);
    } catch (ex) {
        console.error("Error fetching vehicle rates: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch vehicle rates");
    }
};
// ----------------------------------------------------------------------- //

// ---------------------- update rates ---------------------------
const updateRates = async (req, res) => {
    const { id, rate } = req.body;

    try {
        const rates = await db.rates.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!rates) {
            return ResponseService(res, "Error", 404, "Rate not found");
        }

        await db.rates.update({
            where: {
                id: parseInt(id)
            },
            data: {
                rate: rate
            }
        });

        return ResponseService(res, "Success", 200, "Rate updated successfully!");
    } catch (ex) {
        console.error("Error updating rate: ", ex);
        return ResponseService(res, "Error", 500, "Failed to update rate");
    }
};
// ----------------------------------------------------------------------- //

// ------------------------------- Export module ---------------------------
module.exports = {
    createPlatformRate,
    updatePlatformRate,
    getAllPlatformRates,
    getVehicleRates,
    updateRates
};