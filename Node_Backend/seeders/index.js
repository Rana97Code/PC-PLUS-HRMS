
const roleSeeder = require("./roleSeeder");
const permissionSeeder = require("./permissionSeeder");
const rolePermissionSeeder = require("./rolePermissionSeeder");

const seedDatabase = async () => {

    console.log("Running database seeders...");

    await roleSeeder();

    await permissionSeeder();

    await rolePermissionSeeder();

    console.log("Database seed completed.");

};

module.exports = seedDatabase;