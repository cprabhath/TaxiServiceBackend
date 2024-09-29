// --------------------------- Importing Modules --------------------------
const ResponseService = require("../services/ResponseService");
const db = require("../services/db");
// -----------------------------------------------------------------------//

// ---------------------- Create a new vehicle ---------------------------
const createVehicle = async (req, res) => {
    const { vehicleNumber, vehicleType, vehicleModel, vehicleColor, vehicleCapacity, vehicleOwner, images } = req.body;

    try {
        // Create a new vehicle
        await db.vehicles.create({
            data: {
                vehicleNumber: vehicleNumber,
                vehicleType: vehicleType,
                vehicleModel: vehicleModel,
                vehicleColor: vehicleColor,
                SeatingCapacity: vehicleCapacity,
                vehicleOwner: vehicleOwner,
                ImagePath: images
            }
        });

        return ResponseService(res, "Success", 201, "Vehicle created successfully!");
    } catch (ex) {
        console.error("Error creating vehicle: ", ex);
        return ResponseService(res, "Error", 500, "Failed to create vehicle");
    }
};
// -----------------------------------------------------------------------//

// ---------------------- Get all vehicles -------------------------------
const getAllVehicles = async (req, res) => {
    try {
        const vehicleList = await db.vehicle.findMany();
        return ResponseService(res, "Success", 200, vehicleList);
    } catch (ex) {
        console.error("Error fetching vehicles: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch vehicles");
    }
};
// -----------------------------------------------------------------------//

// ---------------------- Get vehicle by ID ------------------------------
const getVehicleById = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await db.vehicle.findUnique({
            where: {
                id: parseInt(vehicleId)
            }
        });

        return ResponseService(res, "Success", 200, vehicle);
    } catch (ex) {
        console.error("Error fetching vehicle: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch vehicle");
    }
};
// -----------------------------------------------------------------------//

// ---------------------- Update vehicle details --------------------------
const updateVehicle = async (req, res) => {
    const vehicleId = req.params.id;
    const { vehicleNumber, vehicleType, vehicleModel, vehicleColor, vehicleCapacity, vehicleOwner, images } = req.body;

    try {
        await db.vehicle.update({
            where: {
                id: parseInt(vehicleId)
            },
            data: {
                vehicleNumber: vehicleNumber,
                vehicleType: vehicleType,
                vehicleModel: vehicleModel,
                vehicleColor: vehicleColor,
                SeatingCapacity: vehicleCapacity,
                vehicleOwner: vehicleOwner,
                ImagePath: images
            }
        });

        return ResponseService(res, "Success", 200, "Vehicle updated successfully!");
    } catch (ex) {
        console.error("Error updating vehicle: ", ex);
        return ResponseService(res, "Error", 500, "Failed to update vehicle");
    }
};
// -----------------------------------------------------------------------//

// ---------------------- Delete vehicle ---------------------------------
const deleteVehicle = async (req, res) => {
    const vehicleId = req.params.id;

    try {
        await db.vehicle.update({
            where: {
                id: parseInt(vehicleId)
            },
            data: {
                deletedAt: new Date()
            }
        });

        return ResponseService(res, "Success", 200, "Vehicle deleted successfully!");
    } catch (ex) {
        console.error("Error deleting vehicle: ", ex);
        return ResponseService(res, "Error", 500, "Failed to delete vehicle");
    }
};
// -----------------------------------------------------------------------//

// ---------------------- Get all vehicle types ---------------------------
const getAllVehicleTypes = async (req, res) => {

    const { vehicleType } = req.body;

    try {
        const vehicleTypes = await db.vehicle.findMany({
            where: {
                vehicleType: vehicleType
            }
        });
        return ResponseService(res, "Success", 200, vehicleTypes);
    } catch (ex) {
        console.error("Error fetching vehicle types: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch vehicle types");
    }
};
// -----------------------------------------------------------------------//

// ------------------------ Update vehicle status -------------------------
const updateVehicleStatus = async (req, res) => {
    const vehicleId = req.params.id;
    const { status } = req.body;

    try {
        await db.vehicle.update({
            where: {
                id: parseInt(vehicleId)
            },
            data: {
                status: status
            }
        });

        return ResponseService(res, "Success", 200, "Vehicle status updated successfully!");
    } catch (ex) {
        console.error("Error updating vehicle status: ", ex);
        return ResponseService(res, "Error", 500, "Failed to update vehicle status");
    }
};
// -----------------------------------------------------------------------//

// ---------------------------- Export modules ----------------------------
module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getAllVehicleTypes,
    updateVehicleStatus
};