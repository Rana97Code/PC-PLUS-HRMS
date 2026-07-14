const express = require("express");
const { Op, fn, col, literal } = require("sequelize");

const Employee = require("../../models/employee/Employee");
const Attendance = require("../../models/employee/Attendance");
const Department = require("../../models/employee/Department");
const Designation = require("../../models/employee/Designation");
const { getCurrentActiveUser } = require("../../middleware/authMiddleware");

const router = express.Router();

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

router.get("/pcplus/api/hrms/dashboard", getCurrentActiveUser, async (req, res) => {
    try {
        const today = new Date();
        const todayStr = formatDate(today);

        const monthStart = formatDate(startOfMonth(today));
        const monthEnd = formatDate(endOfMonth(today));

        const totalEmployees = await Employee.count({
            where: { status: 1 }
        });

        const totalDepartments = await Department.count({
            where: { status: 1 }
        });

        const totalDesignations = await Designation.count({
            where: { status: 1 }
        });

        const todayAttendance = await Attendance.findAll({
            where: {
                attendance_date: todayStr
            },
            include: [
                {
                    model: Employee,
                    attributes: ["id", "employee_id", "name", "email", "phone", "department_id", "designation_id"],
                    include: [
                        {
                            model: Department,
                            attributes: ["id", "department_name"]
                        },
                        {
                            model: Designation,
                            attributes: ["id", "designation_name"]
                        }
                    ]
                }
            ],
            order: [["in_time", "ASC"]]
        });

        const presentToday = todayAttendance.filter((item) => item.in_time).length;
        const absentToday = Math.max(totalEmployees - presentToday, 0);

        const lateEmployees = todayAttendance.filter((item) => {
            if (!item.in_time) return false;

            const inTime = new Date(item.in_time);
            const lateLimit = new Date(item.in_time);
            lateLimit.setHours(10, 0, 0, 0);

            return inTime > lateLimit;
        });

        const earlyOutEmployees = todayAttendance.filter((item) => {
            if (!item.out_time) return false;

            const outTime = new Date(item.out_time);
            const earlyLimit = new Date(item.out_time);
            earlyLimit.setHours(17, 0, 0, 0);

            return outTime < earlyLimit;
        });

        const departmentEmployees = await Employee.findAll({
            attributes: [
                "department_id",
                [fn("COUNT", col("Employee.id")), "total"]
            ],
            where: { status: 1 },
            include: [
                {
                    model: Department,
                    attributes: ["department_name"]
                }
            ],
            group: ["department_id", "Department.id"],
            raw: true
        });

        const monthlyAttendanceRows = await Attendance.findAll({
            attributes: [
                "attendance_date",
                [fn("COUNT", col("Attendance.id")), "present"]
            ],
            where: {
                attendance_date: {
                    [Op.between]: [monthStart, monthEnd]
                }
            },
            group: ["attendance_date"],
            order: [["attendance_date", "ASC"]],
            raw: true
        });

        const weeklyAttendanceRows = await Attendance.findAll({
            attributes: [
                "attendance_date",
                [fn("COUNT", col("Attendance.id")), "present"]
            ],
            where: {
                attendance_date: {
                    [Op.gte]: literal("DATE_SUB(CURDATE(), INTERVAL 6 DAY)")
                }
            },
            group: ["attendance_date"],
            order: [["attendance_date", "ASC"]],
            raw: true
        });

        return res.json({
            cards: {
                totalEmployees,
                presentToday,
                absentToday,
                lateToday: lateEmployees.length,
                earlyOutToday: earlyOutEmployees.length,
                totalDepartments,
                totalDesignations
            },

            attendance_summary: {
                presentToday,
                absentToday,
                lateToday: lateEmployees.length,
                earlyOutToday: earlyOutEmployees.length
            },

            department_chart: departmentEmployees.map((item) => ({
                department: item["Department.department_name"] || "No Department",
                total: Number(item.total || 0)
            })),

            monthly_attendance: monthlyAttendanceRows.map((item) => ({
                date: item.attendance_date,
                present: Number(item.present || 0),
                absent: Math.max(totalEmployees - Number(item.present || 0), 0)
            })),

            weekly_attendance: weeklyAttendanceRows.map((item) => ({
                date: item.attendance_date,
                present: Number(item.present || 0),
                absent: Math.max(totalEmployees - Number(item.present || 0), 0)
            })),

            late_employees: lateEmployees.map((item) => ({
                employee_id: item.Employee?.employee_id,
                name: item.Employee?.name,
                department: item.Employee?.Department?.department_name || "N/A",
                designation: item.Employee?.Designation?.designation_name || "N/A",
                in_time: item.in_time
            })),

            early_out_employees: earlyOutEmployees.map((item) => ({
                employee_id: item.Employee?.employee_id,
                name: item.Employee?.name,
                department: item.Employee?.Department?.department_name || "N/A",
                designation: item.Employee?.Designation?.designation_name || "N/A",
                out_time: item.out_time
            })),

            recent_activities: [
                {
                    title: "Attendance synced",
                    status: "Completed",
                    time: "Today"
                },
                {
                    title: "Employee dashboard loaded",
                    status: "Completed",
                    time: "Today"
                }
            ]
        });

    } catch (error) {
        return res.status(500).json({
            detail: error.message
        });
    }
});

module.exports = router;