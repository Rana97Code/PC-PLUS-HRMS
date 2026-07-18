// models/payroll/PayrollPeriod.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PayrollPeriod = sequelize.define(
    'PayrollPeriod',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        payroll_month: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        total_employees: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        total_gross_salary: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        total_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        total_net_salary: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        status: {
            type: DataTypes.ENUM(
                'Draft',
                'Generated',
                'Approved',
                'Paid',
                'Cancelled'
            ),
            defaultValue: 'Draft',
        },

        generated_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        approved_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        approved_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        paid_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        paid_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'payroll_periods',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = PayrollPeriod;