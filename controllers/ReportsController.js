// --------------------------------- import modules ----------------------------
const db = require("../services/db");
const ResponseService = require("../services/ResponseService");
// -----------------------------------------------------------------------//

const totalEarinings = async (req, res) => {
  try {
    const rides = await db.rides.findMany({
      where: {
        status: "Pending" 
      },
      select: {
        cost: true,
        createdAt: true,
      },
    });

    const monthlyRevenue = {};

    rides.forEach((ride) => {
      const date = new Date(ride.createdAt);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`;

      if (!monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] = 0;
      }
      monthlyRevenue[monthYear] += parseFloat(ride.cost);
    });

    const labels = Object.keys(monthlyRevenue);
    const data = Object.values(monthlyRevenue);

    res.json({
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const totalRides = async (req, res) => {
  try {
    const totalTrips = await db.rides.count();
    const completedTrips = await db.rides.count({
      where: {
        status: 'completed',
      },
    });
    const cancelledTrips = await db.rides.count({
      where: {
        status: 'cancelled',
      },
    });
    const pendingTrips = await db.rides.count({
      where: {
        status: 'Pending',
      },
    });

    const tripReport = {
      labels: ["Total Trips", "Cancelled Trips", "Pending Trips", "Completed Trips"],
      datasets: [
        {
          label: "Trips",
          data: [totalTrips, cancelledTrips, pendingTrips, completedTrips],
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
        },
      ],
    };

    res.json(tripReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const driverPerformance = async (req, res) => {
  try {
    const groupedTrips = await db.rides.groupBy({
      by: ['driverId'],
      where: {
        status: 'Pending', 
      },
      _count: {
        id: true,
      },
    });

    const driverPerformanceData = await Promise.all(
      groupedTrips.map(async (tripGroup) => {
        const driver = await db.drivers.findUnique({
          where: { id: tripGroup.driverId },
          select: { fullName: true },
        });

        return {
          driverFullName: driver ? driver.fullName : 'Unknown Driver',
          tripsCompleted: tripGroup._count.id,
        };
      })
    );

    const labels = driverPerformanceData.map(dp => dp.driverFullName);
    const data = driverPerformanceData.map(dp => dp.tripsCompleted);

    res.json({
      labels,
      datasets: [
        {
          label: "Trips Completed",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const passengerActivityReport = async (req, res) => {
  try {
    const passengers = await db.passenger.findMany({
      include: {
        rides: true, 
      },
    });

    const passengerData = passengers.map(passenger => ({
      passengerFullName: passenger.fullName,
      ridesTaken: passenger.rides.length,
    }));

    const labels = passengerData.map(pd => pd.passengerFullName);
    const data = passengerData.map(pd => pd.ridesTaken);

    res.json({
      labels,
      datasets: [
        {
          label: "Rides Taken",
          data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Vehicle Usage Report
const vehicleUsageReport = async (req, res) => {
  try {
    const vehicles = await db.vehicle.findMany({
      include: {
        rides: true, // Assuming a relationship between vehicles and rides
      },
    });

    const vehicleData = vehicles.map(vehicle => ({
      vehicleId: vehicle.id,
        vehicleNumber: vehicle.vehicleNumber,
      trips: vehicle.rides.length,
    }));

    const labels = vehicleData.map(vd => vd.vehicleNumber);
    const data = vehicleData.map(vd => vd.trips);

    res.json({
      labels,
      datasets: [
        {
          label: "Trips",
          data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Operator Performance Report
const operatorPerformanceReport = async (req, res) => {
  try {
    const operators = await db.phoneOperator.findMany({
      include: {
        passengers: true, // Assuming a relationship between operators and passengers
      },
    });

    const operatorData = operators.map(operator => ({
      operatorFullName: operator.fullName,
      passengersRegistered: operator.passengers.length,
    }));

    const labels = operatorData.map(od => od.operatorFullName);
    const data = operatorData.map(od => od.passengersRegistered);

    res.json({
      labels,
      datasets: [
        {
          label: "Passengers Registered",
          data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------- get total passengers ----------------------------- //
const getTotalPassenger = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : new Date(); 

    if (from && to && from > to) {
      return ResponseService(res, "Error", 400, "Invalid date range");
    }

    const totalPassengers = await db.passenger.findMany({
      where: {
        deletedAt: null,
        createdAt: {
          gte: from || undefined, // Greater than or equal to fromDate, or ignore if not provided
          lte: to || undefined, // Less than or equal to toDate, or ignore if not provided
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        nic: true,
        phone: true,
        address: true,
        isTemporary: true,
        profileImage: true,
        updatedAt: true,
        createdAt: true,
        operator: true,
      },
    });

    return ResponseService(res, "Success", 200, totalPassengers);

  } catch (err) {
    console.error("Error getting total passengers: ", err);
    return ResponseService(res, "Error", 500, "Failed to get total passengers");
  }
};

// --------------------------------------------------------------------------------- //

module.exports = {
  totalEarinings,
  totalRides,
  driverPerformance,
  passengerActivityReport,
  vehicleUsageReport,
  operatorPerformanceReport,
  getTotalPassenger
};
