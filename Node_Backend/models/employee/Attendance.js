// models/hrms/Attendance.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Attendance = sequelize.define("Attendance", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    employee_id: { type: DataTypes.STRING, allowNull: false },
    attendance_date: { type: DataTypes.DATEONLY, allowNull: false },

    in_time: { type: DataTypes.DATE },
    out_time: { type: DataTypes.DATE },

    total_punch: { type: DataTypes.INTEGER, defaultValue: 1 },
    source: { type: DataTypes.STRING, defaultValue: "fingerprint" },

    status: { type: DataTypes.INTEGER, defaultValue: 1 },
}, {
    tableName: "attendances",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
        {
            unique: true,
            fields: ["employee_id", "attendance_date"],
        },
    ],
});

module.exports = Attendance;