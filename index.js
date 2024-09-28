// ----------------------------------------------------------------------------------//
// This is the Server file that will run the server and connect to the database.     //
// It will also handle the routes and the requests from the client.                  //
//                              DO NOT MODIFY THIS FILE.                             //
// ----------------------------------------------------------------------------------//

// ------------------- Import the required modules -------------------
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const mysql = require("mysql2");
const url = require("url");
const querystring = require("querystring");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const cors = require("cors");
// -------------------------------------------------------------------

// ------------------- Create the Express app ------------------------
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
require("dotenv").config();
// -------------------------------------------------------------------

// ------------------- Set the environment variables -----------------
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
// -------------------------------------------------------------------

// ----------------------- Start the server --------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on("error", (err) => {
  console.error("Error starting the server: ", err);
});
// -------------------------------------------------------------------

// ------------------- Middleware for parsing requests ---------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// -------------------------------------------------------------------

// ------------------- Connect to the database -----------------------
try {
  // ------------------- Parse the DATABASE_URL -----------------------
  const parsedUrl = url.parse(DATABASE_URL);
  const [username, password] = parsedUrl.auth.split(":");
  const hostname = parsedUrl.hostname;
  const port = parsedUrl.port || 3306;
  const dbName = parsedUrl.pathname.split("/")[1];
  // -------------------------------------------------------------------

  // ------------------- Check if the database exists -------------------
  const queryParams = querystring.parse(parsedUrl.query);
  const createDatabaseIfNotExist = queryParams.createDatabaseIfNotExist === "true";
  // -------------------------------------------------------------------

  // ------------------- Create a connection to the database -------------------
  const connectionConfig = {
    host: hostname,
    port: port,
    user: username,
    password: password,
  };
  // -------------------------------------------------------------------

  const connection = mysql.createConnection(connectionConfig);

  // ------------------- Check if the database exists -------------------
  connection.connect((err) => {
    if (err) {
      console.error("SQL ERROR: ", err);
      console.error("Please check the DATABASE_URL environment variable or Check if MySQL server is running.");
      return;
    }
    // ------------------------------------------------------------------

    // ------------------- Create the database if it does not exist -------------------
    if (createDatabaseIfNotExist) {
      connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err, result) => {
        if (err) {
          console.error("Unable to create or check database:", err);
        } else {
          console.log(`Database ${dbName} checked/created!`);
          
          connection.end((err) => {
            if (err) throw err;
            console.log("MySQL connection closed.");

            prisma.$connect().then(async () => {
              console.log("Connected to the database with Prisma");

              exec("npx prisma db push", async (err, stdout, stderr) => {
                if (err) {
                  console.error(`Error running prisma db push: ${err}`);
                  return;
                }
                console.log(`Prisma db push output: ${stdout}`);
                if (stderr) {
                  console.error(`Prisma db push error: ${stderr}`);
                }

                await seedDatabase(); 
              });
            }).catch((error) => {
              console.error("Unable to connect to the database with Prisma:", error);
            });
          });
        }
      });
      // -------------------------------------------------------------------

      // ------------------- Create the database if it does not exist -------------------
    } else {
      console.log(`Database creation check skipped as createDatabaseIfNotExist is set to ${createDatabaseIfNotExist}`);

      prisma.$connect().then(() => {
        console.log("Connected to the database with Prisma");

        exec("npx prisma db push", (err, stdout, stderr) => {
          if (err) {
            console.error(`Error running prisma db push: ${err}`);
            return;
          }
          console.log(`Prisma db push output: ${stdout}`);
          if (stderr) {
            console.error(`Prisma db push error: ${stderr}`);
          }

          seedDatabase(); 
        });
      }).catch((error) => {
        console.error("Unable to connect to the database with Prisma:", error);
      });
    }
  });

  // ------------------- Seed the database with initial data -------------------
  async function seedDatabase() {
    try {
      console.log("Checking if initial data seeding is required...");
      const existingAdmin = await prisma.admin.findFirst();

      if (existingAdmin) {
        console.log("Tables and initial data already exist. Skipping seeding.");
      } else {
        console.log("Seeding initial data...");
        await prisma.admin.create({
          data: {
            email: "cprabhath119@gmail.com",
            fullName: "Admin User",
            username: "admin",
            otp: null,
            isEmailVerified: true,
          },
        });
        console.log("Admin user created!");
      }
    } catch (error) {
      console.error("Error while seeding the database:", error);
    } finally {
      await prisma.$disconnect();
      console.log("Prisma disconnected after seeding.");
    }
  }
  // -------------------------------------------------------------------
} catch (e) {
  console.log("ERROR in connecting to the database. Please check the DATABASE_URL environment variable. " + e);
}
// -------------------------------------------------------------------

// ------------------------ Server Health Check -----------------------
app.get("/api/v1/health", async (req, res) => {
  try {
    await prisma.$connect();
    
    res.status(200).json({
      status: 'success',
      message: 'Server and database are running',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server is running, but database connection failed',
    });
  }
});

// ------------------- Routes for the application --------------------
try {
  const AdminRoute = require("./routes/AdminRoutes");
  const DriverRoute = require("./routes/DriverRoutes");
  const PassengerRoute = require("./routes/PassengerRoutes");
  const PhoneOperatorRoute = require("./routes/PhoneOperatorRoutes");
  // -------------------------------------------------------------------

  app.use("/api/v1/admin", AdminRoute);
  app.use("/api/v1/driver", DriverRoute);
  app.use("/api/v1/passenger", PassengerRoute);
  app.use("/api/v1/phone-operator", PhoneOperatorRoute);
  // --------------------------------------------------------------------
  
} catch (e) {
  console.error("==================================================");
  console.error("Error in routes: ", e.message);
  console.error("==================================================");
}
// -------------------------------------------------------------------
