const RolePermission = require("../models/auth/RolePermission");
const SystemSeeder = require("../models/auth/SystemSeeder");

const rolePermissions = [
    { role_id: 2, permission_id: 1 },
    { role_id: 2, permission_id: 2 },
    { role_id: 2, permission_id: 3 },
    { role_id: 2, permission_id: 4 },
    { role_id: 2, permission_id: 5 },
    { role_id: 2, permission_id: 6 },
    { role_id: 2, permission_id: 7 },
    { role_id: 2, permission_id: 8 },
    { role_id: 2, permission_id: 9 },
    { role_id: 2, permission_id: 10 },
    { role_id: 2, permission_id: 11 },
    { role_id: 2, permission_id: 12 },
];

const rolePermissionSeeder = async () => {
    const seederKey = "role_permission_seed_v1";

    const alreadySeeded = await SystemSeeder.findOne({
        where: { seeder_key: seederKey },
    });

    if (alreadySeeded) {
        console.log("Role permissions already seeded.");
        return;
    }

    for (const item of rolePermissions) {
        await RolePermission.findOrCreate({
            where: {
                role_id: item.role_id,
                permission_id: item.permission_id,
            },
            defaults: item,
        });
    }

    await SystemSeeder.create({
        seeder_key: seederKey,
        status: 1,
    });

    console.log("Role permissions seeded successfully.");
};

module.exports = rolePermissionSeeder;