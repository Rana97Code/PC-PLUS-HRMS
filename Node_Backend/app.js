const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");
const seedDatabase = require("./seeders");

// Import models so Sequelize knows them
require("./models/auth/User");
require("./models/employee/Attendance");
require("./models/Transaction");
require("./models/Balance");
require("./models/Due");
require("./models/auth/Role");
require("./models/auth/Permission");
require("./models/auth/RolePermission");
require("./models/employee/Employee");
require("./models/employee/Department");
require("./models/employee/Designation");
require("./models/employee/EmployeeAssociations");

const authController = require("./controllers/authController");
const rolePermissionController = require("./controllers/settings/rolePermissionController");
const settingsDashboardController = require("./controllers/settings/settingsDashboardController");

const userController = require("./controllers/userController");
const transactionController = require("./controllers/transactionController");
const dueController = require("./controllers/dueController");
const employeeController = require("./controllers/employee/employeeController");
const dashboardController = require("./controllers/employee/dashboardController");
const departmentController = require("./controllers/employee/departmentController");
const designationController = require("./controllers/employee/designationController");
const attendanceController = require("./controllers/employee/attendanceController");

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://erp.pcplusbd.com"
    ];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "public", "uploads"))
);

app.get("/", (req, res) => {
    res.send("Node.js Express API Working Successfully!");
});

app.use(authController);
app.use(attendanceController);
app.use(rolePermissionController);
app.use(settingsDashboardController);
app.use(userController);
app.use(transactionController);
app.use(dueController);
app.use(employeeController);
app.use(dashboardController);
app.use(departmentController);
app.use(designationController);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully");
        return sequelize.sync(); // creates missing tables
    })
    .then(async () => {
        console.log("Database synced successfully");

        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection/sync failed:", err);
    });