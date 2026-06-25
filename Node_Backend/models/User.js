const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: DataTypes.STRING,
        user_phone: DataTypes.STRING,
        user_email: DataTypes.STRING,
        user_password: DataTypes.STRING,
        confirm_password: DataTypes.STRING,
        user_role: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        user_img: DataTypes.STRING
    },
    {
        tableName: "users",
        timestamps: false
    }
);

module.exports = User;