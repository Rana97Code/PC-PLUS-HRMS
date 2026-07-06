
const Permission = require("../models/auth/Permission");
const SystemSeeder = require("../models/auth/SystemSeeder");

const permissions = [
    {
        permission_name: "HR Dashboard View",
        permission_key: "hr_dashboard",
        module_name: "Dashboard",
        route_path: "/index",
        status: 1,
    },
    {
        permission_name: "Accounts Summary View",
        permission_key: "accounts_summary_view",
        module_name: "Accounts",
        route_path: "/pages/accounts/summary",
        status: 1,
    },
    {
        permission_name: "Transaction View",
        permission_key: "transaction_view",
        module_name: "Accounts",
        route_path: "/pages/accounts/transaction",
        status: 1,
    },
    {
        permission_name: "Transaction Add",
        permission_key: "transaction_add",
        module_name: "Accounts",
        route_path: "/pages/accounts/transaction/add",
        status: 1,
    },
    {
        permission_name: "Due View",
        permission_key: "due_view",
        module_name: "Accounts",
        route_path: "/pages/accounts/due",
        status: 1,
    },
    {
        permission_name: "Due Payment",
        permission_key: "due_payment",
        module_name: "Accounts",
        route_path: "/pages/accounts/due/payment",
        status: 1,
    },
    {
        permission_name: "Role Manage",
        permission_key: "role_manage",
        module_name: "Settings",
        route_path: "/pages/settings/roles",
        status: 1,
    },
    {
        permission_name: "Due Invoice",
        permission_key: "due_invoice_view",
        module_name: "Accounts",
        route_path: "/pages/accounts/due/invoice",
        status: 1,
    },
    {
        permission_name: "Permission Manage",
        permission_key: "permission_manage",
        module_name: "Settings",
        route_path: "/pages/settings/permissions",
        status: 1,
    },
    {
        permission_name: "Role Permission Manage",
        permission_key: "role_permission_manage",
        module_name: "Settings",
        route_path: "/pages/settings/role-permissions",
        status: 1,
    },
    {
        permission_name: "User Role Manage",
        permission_key: "user_role_manage",
        module_name: "Settings",
        route_path: "/pages/settings/user-roles",
        status: 1,
    },
    {
        permission_name: "User Delete",
        permission_key: "user_delete",
        module_name: "Settings",
        route_path: "/pages/settings/user-roles",
        status: 1,
    },
    {
        permission_name: "Transaction Invoice",
        permission_key: "transaction_invoice_view",
        module_name: "Accounts",
        route_path: "/pages/accounts/transaction/invoice",
        status: 1,
    },
    {
        permission_name: "Employee View",
        permission_key: "employee_view",
        module_name: "Employee",
        route_path: "/pages/employee",
        status: 1,
    },
    {
        permission_name: "Employee Add",
        permission_key: "employee_add",
        module_name: "Employee",
        route_path: "/pages/employee/add",
        status: 1,
    },
    {
        permission_name: "Department View",
        permission_key: "department_view",
        module_name: "Department",
        route_path: "/pages/employee/department",
        status: 1,
    },
    {
        permission_name: "Department Add",
        permission_key: "department_create",
        module_name: "Department",
        route_path: "/pages/employee/department/add",
        status: 1,
    },
    {
        permission_name: "Department Edit",
        permission_key: "department_edit",
        module_name: "Department",
        route_path: "/pages/employee/department/edit",
        status: 1,
    },
    {
        permission_name: "Designation View",
        permission_key: "designation_view",
        module_name: "Designation",
        route_path: "/pages/employee/designation",
        status: 1,
    },
    {
        permission_name: "Designation Add",
        permission_key: "designation_create",
        module_name: "Designation",
        route_path: "/pages/employee/designation/add",
        status: 1,
    },
    {
        permission_name: "Designation Edit",
        permission_key: "designation_edit",
        module_name: "Designation",
        route_path: "/pages/employee/designation/edit",
        status: 1,
    },
    {
        permission_name: "Department View Details",
        permission_key: "department_view_details",
        module_name: "Department",
        route_path: "/pages/employee/department/edit",
        status: 1,
    },
    {
        permission_name: "Designation View Details",
        permission_key: "designation_view_details",
        module_name: "Designation",
        route_path: "/pages/employee/designation/edit",
        status: 1,
    },
    {
        permission_name: "Designation Delete",
        permission_key: "designation_delete",
        module_name: "Designation",
        route_path: "/designations",
        status: 1,
    },
    {
        permission_name: "Department Delete",
        permission_key: "department_delete",
        module_name: "Department",
        route_path: "/department",
        status: 1,
    },
    {
        permission_name: "Employee Edit",
        permission_key: "employee_edit",
        module_name: "Employee",
        route_path: "/pages/employees/edit",
        status: 1,
    },
    {
        permission_name: "Employee Details",
        permission_key: "employee_details",
        module_name: "Employee",
        route_path: "/pages/employees/edit",
        status: 1,
    },
    {
        permission_name: "Employee Delete",
        permission_key: "employee_delete",
        module_name: "Employee",
        route_path: "/pages/employees",
        status: 1,
    },
    {
        permission_name: "Accounts Dashboard",
        permission_key: "accounts_dashboard",
        module_name: "Dashboard",
        route_path: "pages/hr/dashboard",
        status: 1,
    },
    {
        permission_name: "Inventory Dashboard",
        permission_key: "inventory_dashboard",
        module_name: "Dashboard",
        route_path: "/pages/inventory/dashboard",
        status: 1,
    },
    {
        permission_name: "Sales Dashboard",
        permission_key: "sales_dashboard",
        module_name: "Dashboard",
        route_path: "/pages/sales/dashboard",
        status: 1,
    },
    {
        permission_name: "Purchase Dashboard",
        permission_key: "purchase_dashboard",
        module_name: "Dashboard",
        route_path: "/pages/purchase/dashboard",
        status: 1,
    },
    {
        permission_name: "CRM Dashboard",
        permission_key: "crm_dashboard",
        module_name: "Dashboard",
        route_path: "/pages/crm/dashboard",
        status: 1,
    },
    {
        permission_name: "Project Dashboard",
        permission_key: "project_dashboard",
        module_name: "Dashboard",
        route_path: "/pages/project/dashboard",
        status: 1,
    },
    {
        permission_name: "Settings Dashboard",
        permission_key: "settings_dashboard",
        module_name: "Dashboard",
        route_path: "/pages/settings/dashboard",
        status: 1,
    },
];

const permissionSeeder = async () => {
    const seederKey = "permission_default_seed_v1";

    const alreadySeeded = await SystemSeeder.findOne({
        where: { seeder_key: seederKey },
    });

    if (alreadySeeded) {
        console.log("Permissions already seeded. Skipping...");
        return;
    }

    await Permission.bulkCreate(permissions);

    await SystemSeeder.create({
        seeder_key: seederKey,
        status: 1,
    });

    console.log("Permissions seeded successfully.");
};

module.exports = permissionSeeder;