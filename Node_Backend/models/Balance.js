const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Balance = sequelize.define("Balance", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    previous_cost: { type: DataTypes.FLOAT, defaultValue: 0 },
    current_cost: { type: DataTypes.FLOAT, defaultValue: 0 },
    previous_due: { type: DataTypes.FLOAT, defaultValue: 0 },
    current_due: { type: DataTypes.FLOAT, defaultValue: 0 },
    previous_balance: { type: DataTypes.FLOAT, defaultValue: 0 },
    current_balance: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    created_at: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, {
    tableName: "balance",
    timestamps: false
});

module.exports = Balance;