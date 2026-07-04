
const express = require("express");
const router = express.Router();

const { getCurrentActiveUser } = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission");

const Employee = require("../../models/employee/Employee");
const Department = require("../../models/employee/Department");
const Designation = require("../../models/employee/Designation");

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
                where: { status: 1 },
                order: [["id", "DESC"]]
            });

            res.json(employees);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

// CREATE
router.post("/pcplus/api/employees", getCurrentActiveUser,checkPermission("employee_create"), async (req, res) => {
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
router.get("/pcplus/api/employees/:id", getCurrentActiveUser, checkPermission("employee_single"), async (req, res) => {
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
router.put("/pcplus/api/employees/:id", getCurrentActiveUser, checkPermission("employee_update"), async (req, res) => {
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