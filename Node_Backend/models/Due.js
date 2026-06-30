const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Due = sequelize.define("Due", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transaction_id: { type: DataTypes.INTEGER, allowNull: true },
    transaction_invoice: { type: DataTypes.STRING(100), allowNull: false },
    party_name: { type: DataTypes.STRING(150) },
    due_type: { type: DataTypes.ENUM('Credit', 'Debit'), allowNull: false },
    total_due: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    paid_amount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    remaining_due: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    note: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    created_by: { type: DataTypes.INTEGER },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}
, {
    tableName: "due",
    timestamps: false
});

module.exports = Due;
