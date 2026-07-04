// routes/departmentRoutes.js
const express = require("express");
const router = express.Router();

const Department = require("../../models/employee/Department");
const { getCurrentActiveUser } = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission");

// Create Department
router.post(
    "/pcplus/api/departments",
    getCurrentActiveUser,
    checkPermission("department_create"),
    async (req, res) => {
        try {
            const department = await Department.create(req.body);
            res.status(201).json(department);
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    }
);

// Get All Departments
router.get(
    "/pcplus/api/departments",
    getCurrentActiveUser,
    checkPermission("department_view"),
    async (req, res) => {
        try {
            const departments = await Department.findAll({
                attributes: [
                    "id",
                    "department_name",
                    "department_code",
                    "description",
                    "status",
                    "created_by",
                    "created_at"
                ],
                where: { status: 1 },
                order: [["id", "DESC"]]
            });

            res.json(departments);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

// Get Single Department
router.get(
    "/pcplus/api/departments/:id",
    getCurrentActiveUser,
    checkPermission("department_view"),
    async (req, res) => {
        try {
            const department = await Department.findByPk(req.params.id);

            if (!department) {
                return res.status(404).json({ detail: "Department not found" });
            }

            res.json(department);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

// Update Department
router.put(
    "/pcplus/api/departments/:id",
    getCurrentActiveUser,
    checkPermission("department_update"),
    async (req, res) => {
        try {
            const department = await Department.findByPk(req.params.id);

            if (!department) {
                return res.status(404).json({ detail: "Department not found" });
            }

            await department.update(req.body);

            res.json({
                message: "Department updated successfully",
                department
            });
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    }
);

// Soft Delete Department
router.delete(
    "/pcplus/api/departments/:id",
    getCurrentActiveUser,
    checkPermission("department_delete"),
    async (req, res) => {
        try {
            const department = await Department.findByPk(req.params.id);

            if (!department) {
                return res.status(404).json({ detail: "Department not found" });
            }

            await department.update({ status: 0 });

            res.json({ message: "Department deleted successfully" });
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

module.exports = router;