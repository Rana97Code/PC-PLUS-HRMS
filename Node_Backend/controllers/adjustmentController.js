const express = require("express");
const { Op, fn, col, literal } = require("sequelize");

const Transaction = require("../models/Transaction");
const Balance = require("../models/Balance");
const User = require("../models/User");
const { getCurrentActiveUser } = require("../middleware/authMiddleware");

const router = express.Router();



router.get("/pcplus/api/adjustment/all_adjustment", getCurrentActiveUser, async (req, res) => {
    try {
        const rows = await Adjustment.findAll({
            order: [["id", "DESC"]]
        });

        return res.json(rows);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch adjustment list",
            error: err.message
        });
    }
});