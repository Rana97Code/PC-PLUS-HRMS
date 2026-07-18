// models/payroll/EmployeeSalary.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const EmployeeSalary = sequelize.define(
    'EmployeeSalary',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        employee_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        basic_salary: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },

        house_rent: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        medical_allowance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        conveyance_allowance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        mobile_allowance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        food_allowance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        other_allowance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        provident_fund: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        tax_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        loan_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        other_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        overtime_rate: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        working_days_per_month: {
            type: DataTypes.INTEGER,
            defaultValue: 26,
        },

        working_hours_per_day: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 8,
        },

        payment_method: {
            type: DataTypes.ENUM(
                'Cash',
                'Bank',
                'Mobile Banking'
            ),
            defaultValue: 'Bank',
        },

        bank_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        bank_account_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        mobile_banking_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },

        created_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        updated_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'employee_salaries',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = EmployeeSalary;