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

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
require("dotenv").config();
// -------------------------------------------------------------------

// ------------------------- Set Port Server -------------------------
const PORT = process.env.PORT || 3000;
// -------------------------------------------------------------------

// ---------------------- DATABASE_URL -------------------------------
const DATABASE_URL = process.env.DATABASE_URL;
// -------------------------------------------------------------------

// ------------------- Initialize the Server -------------------------
app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting the server: ", err);
  });
// -------------------------------------------------------------------

//------------------- Body Parser ------------------------//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//--------------------------------------------------------//

try {
  // --------------------- Parse the URL -------------------------------
  const parsedUrl = url.parse(DATABASE_URL);
  const [username, password] = parsedUrl.auth.split(":");
  const hostname = parsedUrl.hostname;
  const port = parsedUrl.port || 3306;
  const dbName = parsedUrl.pathname.split("/")[1];
  // -------------------------------------------------------------------

  // ------------------ Parse the query parameters ---------------------
  const queryParams = querystring.parse(parsedUrl.query);
  const createDatabaseIfNotExist =
    queryParams.createDatabaseIfNotExist === "true";
  // -------------------------------------------------------------------

  // ---------------------- Connection configuration -------------------
  const connectionConfig = {
    host: hostname,
    port: port,
    user: username,
    password: password,
  };
  // -------------------------------------------------------------------

  // ----- Connect to MySQL server (not to a specific database) --------
  const connection = mysql.createConnection(connectionConfig);
  // -------------------------------------------------------------------

  // ------------------- Connect to MySQL server -----------------------
  connection.connect((err) => {
    if (err) {
      console.error("SQL ERROR: ", err);
      console.error(
        "Please check the DATABASE_URL environment variable or Check if MySQL server is running."
      );
      return;
    }
  
    if (createDatabaseIfNotExist) {
      connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\``,
        (err, result) => {
          if (err) {
            console.error("Unable to create or check database:", err);
          } else {
            console.log(`Database ${dbName} checked/created!`);
            // Seed the database with initial data
            seedDatabase(); // Function to insert seed data
          }
  
          connection.end((err) => {
            if (err) throw err;
            console.log("MySQL connection closed.");
  
            prisma
              .$connect()
              .then(() => {
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
                });
              })
              .catch((error) => {
                console.error(
                  "Unable to connect to the database with Prisma:",
                  error
                );
              });
          });
        }
      );
    } else {
      console.log(
        `Database creation check skipped as createDatabaseIfNotExist is set to ${createDatabaseIfNotExist}`
      );
  
      prisma
        .$connect()
        .then(() => {
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
          });
        })
        .catch((error) => {
          console.error(
            "Unable to connect to the database with Prisma:",
            error
          );
        });
    }
  });
  
  // Function to insert seed data
  async function seedDatabase() {
    try {
      console.log("Seeding initial data...");
      await prisma.admin.create({
        data: {
          email: 'cprabhath119@gmail.com',
          fullName: 'Admin User',
          username: 'admin',
          otp: null,
          isEmailVerified: true,
        },
      });
      console.log("Admin user created!");
  
      // Disconnect Prisma after seeding
      await prisma.$disconnect();
      console.log("Prisma disconnected after seeding.");
    } catch (error) {
      console.error("Error while seeding the database:", error);
    }
  }
} catch (e) {
  console.log(
    "ERROR in connecting to the database. Please check the DATABASE_URL environment variable. " +
      e
  );
}
// -------------------------------------------------------------------

try {
  // ------------------------ Route Handlers ---------------------------
  const AdminRoute = require("./routes/AdminRoutes");
  const DriverRoute = require("./routes/DriverRoutes");
  const PassengerRoute = require("./routes/PassengerRoutes");
  // -------------------------------------------------------------------

  // ----------------------- Handle the routes --------------------------
  app.use("/api/v1/admin", AdminRoute);
  app.use("/api/v1/driver", DriverRoute);
  app.use("/api/v1/passenger", PassengerRoute);
  // --------------------------------------------------------------------
} catch (e) {
  console.error("Error in routes: ", e.message);
}

// --------------------- this is test pull request ----------------------