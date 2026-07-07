// routes/designationRoutes.js
const express = require("express");
const router = express.Router();

const Designation = require("../../models/employee/Designation");
const Department = require("../../models/employee/Department");

const { getCurrentActiveUser } = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission");

// Create Designation
router.post(
    "/pcplus/api/designations",
    getCurrentActiveUser,
    checkPermission("designation_add"),
    async (req, res) => {
        try {
            const designation = await Designation.create(req.body);
            res.status(201).json(designation);
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    }
);

// Get All Designations
router.get(
    "/pcplus/api/designations",
    getCurrentActiveUser,
    checkPermission("designation_view"),
    async (req, res) => {
        try {
            const designations = await Designation.findAll({
                attributes: [
                    "id",
                    "department_id",
                    "designation_name",
                    "designation_code",
                    "description",
                    "status",
                    "created_by",
                    "created_at"
                ],
                include: [
                    {
                        model: Department,
                        attributes: ["id", "department_name", "department_code"]
                    }
                ],
                where: { status: 1 },
                order: [["id", "DESC"]]
            });

            res.json(designations);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

// Get Single Designation
router.get(
    "/pcplus/api/designations/:id",
    getCurrentActiveUser,
    checkPermission("designation_view_details"),
    async (req, res) => {
        try {
            const designation = await Designation.findByPk(req.params.id, {
                include: [
                    {
                        model: Department,
                        attributes: ["id", "department_name", "department_code"]
                    }
                ]
            });

            if (!designation) {
                return res.status(404).json({ detail: "Designation not found" });
            }

            res.json(designation);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

// Update Designation
router.put(
    "/pcplus/api/designations/:id",
    getCurrentActiveUser,
    checkPermission("designation_edit"),
    async (req, res) => {
        try {
            const designation = await Designation.findByPk(req.params.id);

            if (!designation) {
                return res.status(404).json({ detail: "Designation not found" });
            }

            await designation.update(req.body);

            res.json({
                message: "Designation updated successfully",
                designation
            });
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    }
);

// Soft Delete Designation
router.delete(
    "/pcplus/api/designations/:id",
    getCurrentActiveUser,
    checkPermission("designation_delete"),
    async (req, res) => {
        try {
            const designation = await Designation.findByPk(req.params.id);

            if (!designation) {
                return res.status(404).json({ detail: "Designation not found" });
            }

            await designation.update({ status: 0 });

            res.json({ message: "Designation deleted successfully" });
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
);

module.exports = router;