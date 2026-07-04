// models/Designation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Department = require("./Department");

const Designation = sequelize.define("Designation", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    designation_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    designation_code: {
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
    tableName: "designations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

Designation.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(Designation, { foreignKey: "department_id" });

module.exports = Designation;