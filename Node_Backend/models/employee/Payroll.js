// models/payroll/Payroll.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Payroll = sequelize.define(
    'Payroll',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        payroll_period_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        employee_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        payroll_month: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        total_calendar_days: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        working_days: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        present_days: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        absent_days: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        leave_days: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        late_days: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        overtime_hours: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },

        basic_salary: {
            type: DataTypes.DECIMAL(15, 2),
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

        overtime_amount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        bonus_amount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        gross_salary: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        absent_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        late_deduction: {
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

        advance_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        other_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        total_deduction: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        net_salary: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },

        payment_method: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        payment_reference: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                'Draft',
                'Approved',
                'Paid',
                'Hold'
            ),
            defaultValue: 'Draft',
        },

        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'payrolls',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',

        indexes: [
            {
                unique: true,
                fields: [
                    'employee_id',
                    'payroll_month',
                ],
            },
        ],
    }
);

module.exports = Payroll;