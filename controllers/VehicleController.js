// --------------------------- Importing Modules --------------------------
const ResponseService = require("../services/ResponseService");
const db = require("../services/db");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// -----------------------------------------------------------------------//

// ---------------------- Create a new vehicle ---------------------------
const createVehicle = async (req, res) => {
    const { vehicleNumber, vehicleType, vehicleModel, vehicleColor, vehicleCapacity, vehicleOwner, images } = req.body;

    try {
        // Create a new vehicle
        await db.vehicle.create({
            data: {
                vehicleNumber: vehicleNumber,
                vehicleType: vehicleType,
                vehicleModel: vehicleModel,
                vehicleColor: vehicleColor,
                vehicleOwner: vehicleOwner,
                SeatingCapacity: vehicleCapacity,
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
        const vehicleList = await db.vehicle.findMany({
            where: {
                deletedAt: null
            }
        });
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
                id: parseInt(vehicleId),
                deletedAt: null
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


//----------------------Driver updated part start-----------------------------------//
// ---------------------- Get vehicle by vehicle number ------------------------------
const getVehicleByNumber = async (req, res) => {
    try {
        const vehicleNumber = req.params.vehicleNumber;
        const vehicle = await db.vehicle.findUnique({
            where: {
                vehicleNumber: vehicleNumber
            }
        });

        if (!vehicle) {
            return ResponseService(res, "Error", 404, "Vehicle not found");
        }

        return ResponseService(res, "Success", 200, vehicle);
    } catch (ex) {
        console.error("Error fetching vehicle: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch vehicle");
    }
};
// -----------------------------------------------------------------------//

//--------------------------- get vehicle details using driver id-------------//
const getVehicleDetailsByDriverId = async (req, res) => {
    const driverId = req.user.id; // Assuming you have middleware to fetch the logged-in user's details
    try {
      const vehicles = await prisma.vehicle.findMany({
        where: {
          driverId: driverId, // Assuming you've added driverId to the Vehicle model
        },
      });
      res.json({ data: vehicles });
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      res.status(500).json({ message: 'Error fetching vehicle details.' });
    }
  };
// -----------------------------------------------------------------------//

//---------------------------------get vehicle details using driver id-----------------//
// In your controller file (e.g., vehicleController.js)
const getVehiclesByDriver = async (req, res) => {
    try {
        const driverId = req.body.driverId;
    
        if (!driverId) {
          return res.status(400).json({ message: 'Driver ID is required' });
        }
    
        // Fetch vehicles for the driver
        const vehicles = await prisma.vehicle.findMany({
          where: {
            driverId: driverId,
          },
        });
    
        if (!vehicles || vehicles.length === 0) {
          return res.status(404).json({ message: 'No vehicles found for this driver' });
        }
    
        return res.status(200).json({ vehicles });
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
      }
  };

  //----------------------------------------------------------------------------//
//----------------------Driver updated part end-----------------------------------//

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
                vehicleType: vehicleType,
                deletedAt: null
            }
        });
        return ResponseService(res, "Success", 200, vehicleTypes);
    } catch (ex) {
        console.error("Error fetching vehicle types: ", ex);
        return ResponseService(res, "Error", 500, "Failed to fetch vehicle types");
    }
};
const getVehicleDetails = async (req, res) => {
    const { vehicleType } = req.body;

    try {
        const vehicleTypes = await db.vehicle.findMany({
            where: {
                vehicleType: vehicleType
            },
            select: {
                vehicleNumber: true,
                vehicleType: true,
                ImagePath: true
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
    try {
        await db.vehicle.update({
            where: {
                id: parseInt(vehicleId)
            },
            data: {
                status: "approved"
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
    updateVehicleStatus,
    getVehicleByNumber,
    getVehicleDetailsByDriverId,
    getVehiclesByDriver,
    getVehicleDetails,
};