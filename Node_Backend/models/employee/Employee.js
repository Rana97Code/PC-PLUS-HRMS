// models/Employee.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Employee = sequelize.define("Employee", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    employee_id: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },

    department: { type: DataTypes.STRING },
    designation: { type: DataTypes.STRING },

    joining_date: { type: DataTypes.DATEONLY },
    salary: { type: DataTypes.FLOAT, defaultValue: 0 },

    address: { type: DataTypes.TEXT },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },

    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
}, {
    tableName: "employees",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

module.exports = Employee;