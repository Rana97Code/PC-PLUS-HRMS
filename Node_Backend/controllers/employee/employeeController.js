
const express = require("express");
const router = express.Router();

const { getCurrentActiveUser } = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission");

const Employee = require("../../models/employee/Employee");
const Department = require("../../models/employee/Department");
const Designation = require("../../models/employee/Designation");
const Attendance = require("../../models/employee/Attendance");


router.get(
    "/pcplus/api/employees",
    getCurrentActiveUser,
    checkPermission("employee_view"),
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
                    "joining_date",
                    "salary",
                    "status"
                ],
                include: [
                    {
                        model: Department,
                        attributes: ["id", "department_name"]
                    },
                    {
                        model: Designation,
                        attributes: ["id", "designation_name"]
                    }
                ],
                // where: { status: 1 },
                order: [["id", "DESC"]]
            });

            res.json(employees);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

// CREATE
router.post("/pcplus/api/employee", getCurrentActiveUser,checkPermission("employee_add"), async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

// LIST
router.get("/pcplus/api/employees", getCurrentActiveUser, checkPermission("employee_list"), async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: { status: 1 },
            order: [["id", "DESC"]],
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

// SINGLE
router.get("/pcplus/api/employee/:id", getCurrentActiveUser, checkPermission("employee_details"), async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({ detail: "Employee not found" });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

// UPDATE
router.put("/pcplus/api/employee/:id", getCurrentActiveUser, checkPermission("employee_edit"), async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({ detail: "Employee not found" });
        }

        await employee.update(req.body);
        res.json(employee);
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

//status update

router.patch('/pcplus/api/employees/:id/status',getCurrentActiveUser,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const numericStatus = Number(status);

            if (![0, 1].includes(numericStatus)) {
                return res.status(400).json({
                    detail: 'Status must be either 0 or 1',
                });
            }

            const employee = await Employee.findByPk(id);

            if (!employee) {
                return res.status(404).json({
                    detail: 'Employee not found',
                });
            }

            await employee.update({
                status: numericStatus,
                updated_by:
                    req.user?.id ||
                    req.user?.user_id ||
                    req.user?.user_email ||
                    null,
                updated_at: new Date(),
            });

            return res.status(200).json({
                detail: `Employee status changed to ${
                    numericStatus === 1 ? 'Active' : 'Inactive'
                }`,
                employee: {
                    id: employee.id,
                    employee_id: employee.employee_id,
                    name: employee.name,
                    status: employee.status,
                },
            });
        } catch (error) {
            console.error('Employee status update error:', error);

            return res.status(500).json({
                detail: 'Failed to change employee status',
                error: error.message,
            });
        }
    }
);

//Employee All Details Views
router.get(
    '/pcplus/api/employees/:id/details',
    getCurrentActiveUser,
    async (req, res) => {
        try {
            const { id } = req.params;

            const employee = await Employee.findByPk(id, {
                include: [
                    {
                        model: Department,
                        attributes: ['id', 'department_name'],
                        required: false,
                    },
                    {
                        model: Designation,
                        attributes: ['id', 'designation_name'],
                        required: false,
                    },
                ],
            });

            if (!employee) {
                return res.status(404).json({
                    detail: 'Employee not found',
                });
            }

            /*
             * Attendance.employee_id contains the employee code,
             * for example EMP-0001.
             */
            const attendanceHistory = await Attendance.findAll({
                where: {
                    employee_id: employee.employee_id,
                },
                order: [['attendance_date', 'DESC']],
            });

            const presentDays = attendanceHistory.filter(
                (attendance) => attendance.in_time
            ).length;

            const lateDays = attendanceHistory.filter((attendance) => {
                if (!attendance.in_time) return false;

                const inTime = String(attendance.in_time).slice(0, 5);

                return inTime > '10:00';
            }).length;

            const earlyLeaveDays = attendanceHistory.filter(
                (attendance) => {
                    if (!attendance.out_time) return false;

                    const outTime = String(attendance.out_time).slice(
                        0,
                        5
                    );

                    return outTime < '17:00';
                }
            ).length;

            return res.status(200).json({
                employee,
                attendance_history: attendanceHistory,
                attendance_summary: {
                    total_records: attendanceHistory.length,
                    present_days: presentDays,
                    late_days: lateDays,
                    early_leave_days: earlyLeaveDays,
                },
            });
        } catch (error) {
            console.error('Employee details error:', error);

            return res.status(500).json({
                detail: 'Failed to load employee details',
                error: error.message,
            });
        }
    }
);

// SOFT DELETE
router.delete("/pcplus/api/employees/:id", getCurrentActiveUser, checkPermission("employee_delete"), async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({ detail: "Employee not found" });
        }

        await employee.update({ status: 0 });
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

module.exports = router;