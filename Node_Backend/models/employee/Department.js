// models/Department.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Department = sequelize.define("Department", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    department_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    department_code: {
        type: DataTypes.STRING,
        allowNull: true
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },

    created_by: {
        type: DataTypes.STRING,
        allowNull: true
    },

    updated_by: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "departments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Department;