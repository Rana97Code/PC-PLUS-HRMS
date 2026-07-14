
const express = require("express");
const router = express.Router();

const { User, Role, Permission, RolePermission } = require("../../models/auth");


const { getCurrentActiveUser } = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission");

// ================= User =================

router.delete("/pcplus/api/users/:id", getCurrentActiveUser, checkPermission("user_delete"), async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }

        if (Number(user.id) === Number(req.user.id)) {
            return res.status(403).json({ detail: "You cannot delete your own account" });
        }

        if (Number(user.user_role) === 1) {
            return res.status(403).json({ detail: "Super Admin cannot be deleted" });
        }

        await user.destroy();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});




router.get("/pcplus/api/users-with-roles", getCurrentActiveUser, checkPermission("user_role_manage"), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                "id",
                "user_name",
                "user_phone",
                "user_email",
                "user_role",
                "user_img"
            ],
            include: [
                {
                    model: Role,
                    attributes: ["id", "role_name", "role_key"]
                }
            ],
            order: [["id", "DESC"]]
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

router.put("/pcplus/api/users/:id/change-role", getCurrentActiveUser, checkPermission("user_role_manage"), async (req, res) => {
    try {
        const { id } = req.params;
        const { user_role } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }

        if (Number(user.id) === Number(req.user.id)) {
            return res.status(403).json({
                detail: "You cannot change your own role"
            });
        }

        if (Number(user.user_role) === 1) {
            return res.status(403).json({
                detail: "Super Admin role cannot be changed"
            });
        }

        await user.update({ user_role });

        res.json({
            message: "User role updated successfully"
        });
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});


// ================= ROLE =================

router.get("/pcplus/api/roles", getCurrentActiveUser, checkPermission("role_manage"), async (req, res) => {
    try {
        const roles = await Role.findAll({
            order: [["id", "DESC"]]
        });

        res.json(roles);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

router.post("/pcplus/api/roles", getCurrentActiveUser, checkPermission("role_manage"), async (req, res) => {
    try {
        const { role_name, role_key, status } = req.body;

        const role = await Role.create({
            role_name,
            role_key,
            status: status ?? 1
        });

        res.json({
            message: "Role created successfully",
            role
        });
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

router.put("/pcplus/api/roles/:id", getCurrentActiveUser, checkPermission("role_manage"), async (req, res) => {
    try {
        const { id } = req.params;
        const { role_name, role_key, status } = req.body;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({ detail: "Role not found" });
        }

        await role.update({
            role_name,
            role_key,
            status
        });

        res.json({
            message: "Role updated successfully",
            role
        });
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

router.delete("/pcplus/api/roles/:id", getCurrentActiveUser, checkPermission("role_manage"), async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(id) === 1) {
            return res.status(403).json({
                detail: "Super Admin role cannot be deleted"
            });
        }

        await RolePermission.destroy({
            where: { role_id: id }
        });

        await Role.destroy({
            where: { id }
        });

        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

// ================= PERMISSION =================

router.get("/pcplus/api/permissions", getCurrentActiveUser, checkPermission("permission_manage"), async (req, res) => {
    try {
        const permissions = await Permission.findAll({
            order: [["module_name", "ASC"], ["id", "ASC"]]
        });

        res.json(permissions);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

router.post("/pcplus/api/permissions", getCurrentActiveUser, checkPermission("permission_manage"), async (req, res) => {
    try {
        const {
            permission_name,
            permission_key,
            module_name,
            route_path,
            status
        } = req.body;

        const permission = await Permission.create({
            permission_name,
            permission_key,
            module_name,
            route_path,
            status: status ?? 1
        });

        res.json({
            message: "Permission created successfully",
            permission
        });
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

// ================= ROLE PERMISSION =================

router.get("/pcplus/api/roles/:role_id/permissions", getCurrentActiveUser, checkPermission("role_permission_manage"), async (req, res) => {
    try {
        const { role_id } = req.params;

        const rolePermissions = await RolePermission.findAll({
            where: { role_id }
        });

        const permissionIds = rolePermissions.map((item) => item.permission_id);

        res.json(permissionIds);
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

router.post("/pcplus/api/roles/:role_id/permissions", getCurrentActiveUser, checkPermission("role_permission_manage"), async (req, res) => {
    try {
        const { role_id } = req.params;
        const { permission_ids } = req.body;

        if (Number(role_id) === 1) {
            return res.status(403).json({
                detail: "Super Admin already has all permissions"
            });
        }

        await RolePermission.destroy({
            where: { role_id }
        });

        const insertData = permission_ids.map((permission_id) => ({
            role_id,
            permission_id
        }));

        await RolePermission.bulkCreate(insertData);

        res.json({
            message: "Role permissions updated successfully"
        });
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

module.exports = router;