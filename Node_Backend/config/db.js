// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//     process.env.DATABASE_NAME,
//     process.env.DATABASE_USER,
//     process.env.DATABASE_PASSWORD,
//     {
//         host: process.env.DATABASE_HOST,
//         dialect: "mysql",
//         port: 3306,
//         logging: false
//     }
// );

// module.exports = sequelize;

// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//     process.env.DATABASE_NAME,
//     process.env.DATABASE_USER,
//     process.env.DATABASE_PASSWORD,
//     {
//         host: process.env.DATABASE_HOST,
//         dialect: "mysql",
//         port: 3306,
//         logging: false,

//         pool: {
//             max: 5,
//             min: 0,
//             acquire: 30000,
//             idle: 5000,
//             evict: 10000,
//         },

//         dialectOptions: {
//             connectTimeout: 60000,
//         },
//     }
// );

// module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        port: 3306,
        logging: false,

        dialectOptions: {
            charset: "utf8mb4",
        },

        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
            timestamps: false,
        },

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

module.exports = sequelize;