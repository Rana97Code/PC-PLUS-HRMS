const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define("Transaction", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transaction_date: { type: DataTypes.DATEONLY, allowNull: false },
    transaction_type: DataTypes.STRING,
    transaction_title: DataTypes.STRING,
    transaction_by: DataTypes.STRING,
    transaction_to: DataTypes.STRING,
    transaction_invoice: DataTypes.STRING,
    amount_in: { type: DataTypes.FLOAT, defaultValue: 0 },
    amount_out: { type: DataTypes.FLOAT, defaultValue: 0 },
    cost: { type: DataTypes.FLOAT, defaultValue: 0 },
    due_amount: { type: DataTypes.FLOAT, defaultValue: 0 },
    return_amount: { type: DataTypes.FLOAT, defaultValue: 0 },
    transaction_notes: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    created_by: DataTypes.INTEGER,
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_by: DataTypes.INTEGER
}, {
    tableName: "transactions",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

module.exports = Transaction;