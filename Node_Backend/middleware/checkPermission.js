const { User, Role, Permission } = require("../models/auth");

const checkPermission = (permissionKey) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            const user = await User.findByPk(userId, {
                include: {
                    model: Role,
                    include: Permission
                }
            });

            if (!user) {
                return res.status(401).json({ message: "Unauthorized user" });
            }

            if (user.Role?.role_key === "super_admin") {
                return next();
            }

            const permissions = user.Role?.Permissions || [];

            const hasPermission = permissions.some(
                (permission) => permission.permission_key === permissionKey
            );

            if (!hasPermission) {
                return res.status(403).json({
                    message: "You do not have permission to access this resource"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                message: "Permission checking failed",
                error: error.message
            });
        }
    };
};

module.exports = checkPermission;