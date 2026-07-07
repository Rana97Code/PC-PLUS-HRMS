// routes/hrms/attendanceRoutes.js
const express = require("express");
const { Op, fn, col, where } = require("sequelize");
const Attendance = require("../../models/employee/Attendance");
const Employee = require("../../models/employee/Employee");
const { getCurrentActiveUser } = require("../../middleware/authMiddleware");
// const checkPermission = require("../../middleware/checkPermission");

const router = express.Router();

function getDateOnly(dateTime) {
    return new Date(dateTime).toISOString().slice(0, 10);
}

// Fingerprint device will call this API
router.post("/pcplus/api/attendance/fingerprint-punch", async (req, res) => {
    try {
        const { employee_id, punch_time } = req.body;

        if (!employee_id || !punch_time) {
            return res.status(400).json({
                detail: "employee_id and punch_time are required",
            });
        }

        const punchDate = getDateOnly(punch_time);
        const newPunch = new Date(punch_time);

        let attendance = await Attendance.findOne({
            where: {
                employee_id,
                attendance_date: punchDate,
            },
        });

        if (!attendance) {
            attendance = await Attendance.create({
                employee_id,
                attendance_date: punchDate,
                in_time: newPunch,
                out_time: newPunch,
                total_punch: 1,
                source: "fingerprint",
            });
        } else {
            const oldIn = attendance.in_time ? new Date(attendance.in_time) : newPunch;
            const oldOut = attendance.out_time ? new Date(attendance.out_time) : newPunch;

            if (newPunch < oldIn) {
                attendance.in_time = newPunch;
            }

            if (newPunch > oldOut) {
                attendance.out_time = newPunch;
            }

            attendance.total_punch = Number(attendance.total_punch || 0) + 1;
            attendance.source = "fingerprint";

            await attendance.save();
        }

        return res.json({
            message: "Attendance updated successfully",
            attendance,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            detail: "Attendance punch failed",
            error: error.message,
        });
    }
});

// Daily attendance list with pagination
router.get("/pcplus/api/attendance/daily", getCurrentActiveUser, async (req, res) => {
    try {
        const {
            date,
            page = 1,
            limit = 10,
            sortBy = "name",
            sortDir = "ASC",
            search = "",
        } = req.query;

        const attendanceDate = date || new Date().toISOString().slice(0, 10);
        const offset = (Number(page) - 1) * Number(limit);

        const employeeWhere = {
            status: 1,
        };

        if (search) {
            employeeWhere[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { employee_id: { [Op.like]: `%${search}%` } },
            ];
        }

        const { count, rows } = await Employee.findAndCountAll({
            where: employeeWhere,
            attributes: ["id", "employee_id", "name", "email", "phone", "department_id", "designation_id"],
            include: [
                {
                    model: Attendance,
                    as: "attendance",
                    required: false,
                    where: {
                        attendance_date: attendanceDate,
                    },
                    attributes: ["id", "attendance_date", "in_time", "out_time", "total_punch"],
                },
            ],
            order: [[sortBy, sortDir.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
            limit: Number(limit),
            offset,
        });

        return res.json({
            total: count,
            page: Number(page),
            limit: Number(limit),
            data: rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ detail: "Daily attendance fetch failed" });
    }
});

// Single employee monthly report
router.get("/pcplus/api/attendance/monthly-report", getCurrentActiveUser, async (req, res) => {
    try {
        const { employee_id, month } = req.query;

        if (!employee_id || !month) {
            return res.status(400).json({ detail: "employee_id and month are required" });
        }

        const startDate = `${month}-01`;
        const endDate = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)
            .toISOString()
            .slice(0, 10);

        const employee = await Employee.findOne({
            where: { employee_id },
        });

        const records = await Attendance.findAll({
            where: {
                employee_id,
                attendance_date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            order: [["attendance_date", "ASC"]],
        });

        return res.json({
            employee,
            month,
            startDate,
            endDate,
            records,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ detail: "Monthly report fetch failed" });
    }
});

module.exports = router;