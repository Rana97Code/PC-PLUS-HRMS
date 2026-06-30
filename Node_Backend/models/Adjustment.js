const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Adjustment = sequelize.define("Adjustment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transaction_invoice: { type: DataTypes.STRING(100), allowNull: false },
    adjustment_date: { type: DataTypes.DATE, allowNull: false },
    adjustment_type: { type: DataTypes.ENUM('Increase', 'Decrease'), allowNull: false },
    previous_amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    adjustment_amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    reason: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW}
},
{
    tableName: "adjustments",
    timestamps: false
});

module.exports = Adjustment;
