// models/associations.js
const Employee = require("./Employee");
const Department = require("./Department");
const Designation = require("./Designation");

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

module.exports = {
    Employee,
    Department,
    Designation
};