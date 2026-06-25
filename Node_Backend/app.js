const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");

const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const transactionController = require("./controllers/transactionController");

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://erp.pcplusbd.com",
        "http://localhost:5173/"
    ];

const app = express();

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
app.use(userController);
app.use(transactionController);

sequelize.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});