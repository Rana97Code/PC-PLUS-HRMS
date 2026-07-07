// models/associations.js
const Employee = require("./Employee");
const Department = require("./Department");
const Designation = require("./Designation");
const Attendance = require("./Attendance");

Employee.belongsTo(Department, {
    foreignKey: "department_id"
});

Department.hasMany(Employee, {
    foreignKey: "department_id"
});

Employee.belongsTo(Designation, {
    foreignKey: "designation_id"
});

Designation.hasMany(Employee, {
    foreignKey: "designation_id"
});

Employee.hasMany(Attendance, {
    foreignKey: "employee_id",
    sourceKey: "employee_id",
});

Attendance.belongsTo(Employee, {
    foreignKey: "employee_id",
    targetKey: "employee_id",
});

module.exports = {
    Employee,
    Department,
    Designation,
    Attendance
};