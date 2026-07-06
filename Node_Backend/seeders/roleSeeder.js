const Role = require("../models/auth/Role");
const SystemSeeder = require("../models/auth/SystemSeeder");

const roleSeeder = async () => {
    const seederKey = "role_default_seed_v1";

    const alreadySeeded = await SystemSeeder.findOne({
        where: { seeder_key: seederKey },
    });

    if (alreadySeeded) {
        console.log("Roles already seeded. Skipping...");
        return;
    }

    await Role.findOrCreate({
        where: { role_key: "super_admin" },
        defaults: {
            id: 1,
            role_name: "Super Admin",
            role_key: "super_admin",
            status: 1,
        },
    });

    await Role.findOrCreate({
        where: { role_key: "admin" },
        defaults: {
            id: 2,
            role_name: "Admin",
            role_key: "admin",
            status: 1,
        },
    });

    await SystemSeeder.create({
        seeder_key: seederKey,
        status: 1,
    });

    console.log("Roles seeded successfully.");
};

module.exports = roleSeeder;