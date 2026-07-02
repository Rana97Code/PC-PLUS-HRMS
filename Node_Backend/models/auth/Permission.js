const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Permission = sequelize.define("Permission", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    permission_name: DataTypes.STRING,

    permission_key: {
        type: DataTypes.STRING,
        allowNull: false
    },

    module_name: DataTypes.STRING,

    route_path: DataTypes.STRING,

    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: "permissions",
    timestamps: false
});

module.exports = Permission;