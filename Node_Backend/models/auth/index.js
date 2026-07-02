const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");

User.belongsTo(Role, {
    foreignKey: "user_role",
    targetKey: "id"
});

Role.hasMany(User, {
    foreignKey: "user_role",
    sourceKey: "id"
});

Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "role_id",
    otherKey: "permission_id"
});

Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permission_id",
    otherKey: "role_id"
});

module.exports = {
    User,
    Role,
    Permission,
    RolePermission
};