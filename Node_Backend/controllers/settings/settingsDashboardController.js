const express = require("express");
const { fn, col } = require("sequelize");

const { User, Role, Permission, RolePermission } = require("../../models/auth");
const { getCurrentActiveUser } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/pcplus/api/settings/dashboard", getCurrentActiveUser, async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalRoles = await Role.count();
        const activeRoles = await Role.count({ where: { status: 1 } });
        const totalPermissions = await Permission.count();
        const activePermissions = await Permission.count({ where: { status: 1 } });
        const assignedPermissions = await RolePermission.count();

        const usersByRole = await User.findAll({
            attributes: [
                "user_role",
                [fn("COUNT", col("User.id")), "total"]
            ],
            include: [
                {
                    model: Role,
                    attributes: ["role_name", "role_key"]
                }
            ],
            group: ["user_role", "Role.id"],
            raw: true
        });

        const permissionsByModule = await Permission.findAll({
            attributes: [
                "module_name",
                [fn("COUNT", col("id")), "total"]
            ],
            group: ["module_name"],
            order: [["module_name", "ASC"]],
            raw: true
        });

        const recentUsers = await User.findAll({
            attributes: ["id", "user_name", "user_email", "user_role"],
            include: [
                {
                    model: Role,
                    attributes: ["role_name", "role_key"]
                }
            ],
            order: [["id", "DESC"]],
            limit: 5
        });

        return res.json({
            cards: {
                totalUsers,
                totalRoles,
                activeRoles,
                totalPermissions,
                activePermissions,
                assignedPermissions
            },

            users_by_role: usersByRole.map((item) => ({
                role_name: item["Role.role_name"] || "No Role",
                role_key: item["Role.role_key"] || "no_role",
                total: Number(item.total || 0)
            })),

            permissions_by_module: permissionsByModule.map((item) => ({
                module_name: item.module_name || "Others",
                total: Number(item.total || 0)
            })),

            recent_users: recentUsers,

            recent_activities: [
                {
                    title: "Settings dashboard loaded",
                    status: "Completed",
                    time: "Today"
                },
                {
                    title: "Role and permission status checked",
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