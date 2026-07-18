// models/payroll/PayrollAdjustment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PayrollAdjustment = sequelize.define(
    'PayrollAdjustment',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        employee_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        payroll_month: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        adjustment_type: {
            type: DataTypes.ENUM(
                'Allowance',
                'Deduction'
            ),
            allowNull: false,
        },

        adjustment_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },

        remarks: {
            type: DataTypes.TEXT,
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
    },
    {
        tableName: 'payroll_adjustments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = PayrollAdjustment;