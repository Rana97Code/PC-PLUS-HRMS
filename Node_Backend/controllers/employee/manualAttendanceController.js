const express = require("express");
const { Op } = require("sequelize");

const Attendance = require("../../models/employee/Attendance");
const Employee = require("../../models/employee/Employee");

const {
    getCurrentActiveUser,
} = require("../../middleware/authMiddleware");

// Enable this when the permission is available.
// const checkPermission = require("../../middleware/checkPermission");

const router = express.Router();

/**
 * Convert date and time into MySQL-compatible datetime.
 *
 * Example:
 * attendanceDate = 2026-07-18
 * attendanceTime = 09:30
 *
 * Result:
 * 2026-07-18 09:30:00
 */
const combineDateAndTime = (attendanceDate, attendanceTime) => {
    if (!attendanceDate || !attendanceTime) {
        return null;
    }

    const normalizedTime =
        attendanceTime.length === 5
            ? `${attendanceTime}:00`
            : attendanceTime;

    return `${attendanceDate} ${normalizedTime}`;
};

/**
 * Check whether a datetime value is valid.
 */
const isValidDateTime = (dateTime) => {
    if (!dateTime) {
        return true;
    }

    return !Number.isNaN(new Date(dateTime).getTime());
};

/**
 * GET active employees for the dropdown.
 */
router.get(
    "/pcplus/api/hrms/manual-attendance/employees",
    getCurrentActiveUser,
    // checkPermission("attendance_manual_add"),
    async (req, res) => {
        try {
            const employees = await Employee.findAll({
                attributes: [
                    "id",
                    "employee_id",
                    "name",
                    "email",
                    "phone",
                    "department_id",
                    "designation_id",
                    "status",
                ],

                where: {
                    status: 1,
                },

                order: [
                    ["name", "ASC"],
                    ["employee_id", "ASC"],
                ],

                raw: true,
            });

            return res.status(200).json({
                employees,
            });
        } catch (error) {
            console.error(
                "Manual attendance employee list error:",
                error
            );

            return res.status(500).json({
                detail:
                    error.message ||
                    "Unable to load employees",
            });
        }
    }
);

/**
 * GET existing attendance by employee and date.
 *
 * Query:
 * employee_id=EMP-001
 * attendance_date=2026-07-18
 */
router.get(
    "/pcplus/api/hrms/manual-attendance",
    getCurrentActiveUser,
    // checkPermission("attendance_manual_view"),
    async (req, res) => {
        try {
            const {
                employee_id,
                attendance_date,
            } = req.query;

            if (!employee_id) {
                return res.status(400).json({
                    detail: "Employee is required",
                });
            }

            if (!attendance_date) {
                return res.status(400).json({
                    detail:
                        "Attendance date is required",
                });
            }

            const attendance =
                await Attendance.findOne({
                    where: {
                        employee_id,
                        attendance_date,
                    },
                });

            return res.status(200).json({
                attendance:
                    attendance || null,
            });
        } catch (error) {
            console.error(
                "Manual attendance fetch error:",
                error
            );

            return res.status(500).json({
                detail:
                    error.message ||
                    "Unable to load attendance",
            });
        }
    }
);

/**
 * GET recent manual attendance records.
 */
router.get(
    "/pcplus/api/hrms/manual-attendance/recent",
    getCurrentActiveUser,
    // checkPermission("attendance_manual_view"),
    async (req, res) => {
        try {
            const limit = Math.min(
                Number(req.query.limit) || 20,
                100
            );

            const attendanceRows =
                await Attendance.findAll({
                    where: {
                        source: "manual",
                        status: 1,
                    },

                    order: [
                        [
                            "attendance_date",
                            "DESC",
                        ],
                        ["id", "DESC"],
                    ],

                    limit,

                    raw: true,
                });

            const employeeIds = [
                ...new Set(
                    attendanceRows.map(
                        (row) =>
                            row.employee_id
                    )
                ),
            ];

            const employees =
                employeeIds.length > 0
                    ? await Employee.findAll({
                          attributes: [
                              "employee_id",
                              "name",
                          ],

                          where: {
                              employee_id: {
                                  [Op.in]:
                                      employeeIds,
                              },
                          },

                          raw: true,
                      })
                    : [];

            const employeeMap =
                new Map(
                    employees.map(
                        (employee) => [
                            employee.employee_id,
                            employee.name,
                        ]
                    )
                );

            const attendance =
                attendanceRows.map(
                    (row) => ({
                        ...row,
                        employee_name:
                            employeeMap.get(
                                row.employee_id
                            ) || "Unknown Employee",
                    })
                );

            return res.status(200).json({
                attendance,
            });
        } catch (error) {
            console.error(
                "Recent manual attendance error:",
                error
            );

            return res.status(500).json({
                detail:
                    error.message ||
                    "Unable to load recent attendance",
            });
        }
    }
);

/**
 * POST create or update manual attendance.
 *
 * Body:
 * {
 *   employee_id: "EMP-001",
 *   attendance_date: "2026-07-18",
 *   in_time: "09:00",
 *   out_time: "18:00"
 * }
 */
router.post(
    "/pcplus/api/hrms/manual-attendance",
    getCurrentActiveUser,
    async (req, res) => {
        try {
            const {
                employee_id,
                attendance_date,
                in_time,
                out_time,
            } = req.body;

            if (!employee_id) {
                return res.status(400).json({
                    detail: "Please select an employee",
                });
            }

            if (!attendance_date) {
                return res.status(400).json({
                    detail: "Attendance date is required",
                });
            }

            // Default office times
            const normalizedInTime =
                typeof in_time === "string" && in_time.trim()
                    ? in_time.trim()
                    : "10:00";

            const normalizedOutTime =
                typeof out_time === "string" && out_time.trim()
                    ? out_time.trim()
                    : "18:00";

            const employee = await Employee.findOne({
                where: {
                    employee_id,
                    status: 1,
                },
            });

            if (!employee) {
                return res.status(404).json({
                    detail: "Active employee not found",
                });
            }

            const inDateTime = combineDateAndTime(
                attendance_date,
                normalizedInTime
            );

            const outDateTime = combineDateAndTime(
                attendance_date,
                normalizedOutTime
            );

            if (
                !isValidDateTime(inDateTime) ||
                !isValidDateTime(outDateTime)
            ) {
                return res.status(400).json({
                    detail: "Invalid attendance time",
                });
            }

            if (
                new Date(outDateTime).getTime() <
                new Date(inDateTime).getTime()
            ) {
                return res.status(400).json({
                    detail:
                        "Out-time cannot be earlier than in-time",
                });
            }

            const existingAttendance =
                await Attendance.findOne({
                    where: {
                        employee_id,
                        attendance_date,
                    },
                });

            const attendanceData = {
                employee_id,
                attendance_date,
                in_time: inDateTime,
                out_time: outDateTime,
                total_punch: 2,
                source: "manual",
                status: 1,
            };

            let attendance;
            let message;
            let operation;

            if (existingAttendance) {
                await existingAttendance.update(
                    attendanceData
                );

                attendance = existingAttendance;
                message =
                    "Attendance updated successfully";
                operation = "updated";
            } else {
                attendance = await Attendance.create(
                    attendanceData
                );

                message =
                    "Attendance created successfully";
                operation = "created";
            }

            return res.status(200).json({
                message,
                operation,
                attendance,
            });
        } catch (error) {
            console.error(
                "Manual attendance save error:",
                error
            );

            if (
                error.name ===
                "SequelizeUniqueConstraintError"
            ) {
                return res.status(409).json({
                    detail:
                        "Attendance already exists for this employee and date",
                });
            }

            return res.status(500).json({
                detail:
                    error.message ||
                    "Unable to save attendance",
            });
        }
    }
);

/**
 * DELETE manual attendance record.
 *
 * Only records having source = manual can be deleted.
 */
router.delete(
    "/pcplus/api/hrms/manual-attendance/:id",
    getCurrentActiveUser,
    // checkPermission("attendance_manual_delete"),
    async (req, res) => {
        try {
            const { id } = req.params;

            const attendance =
                await Attendance.findByPk(id);

            if (!attendance) {
                return res.status(404).json({
                    detail:
                        "Attendance record not found",
                });
            }

            if (
                attendance.source !==
                "manual"
            ) {
                return res.status(403).json({
                    detail:
                        "Fingerprint attendance cannot be deleted from the manual attendance page",
                });
            }

            await attendance.destroy();

            return res.status(200).json({
                message:
                    "Manual attendance deleted successfully",
            });
        } catch (error) {
            console.error(
                "Manual attendance delete error:",
                error
            );

            return res.status(500).json({
                detail:
                    error.message ||
                    "Unable to delete attendance",
            });
        }
    }
);

module.exports = router;