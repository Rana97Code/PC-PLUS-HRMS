const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const SystemSeeder = sequelize.define("SystemSeeder", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    seeder_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {
    tableName: "system_seeders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

module.exports = SystemSeeder;