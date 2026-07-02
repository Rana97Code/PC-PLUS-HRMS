const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Role = sequelize.define("Role", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: "roles",
    timestamps: false
});

module.exports = Role;