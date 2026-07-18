import React, { lazy } from 'react';
import ERPModules from '../pages/ERPModules';

// const file = lazy(() => import('../../public/assets/excel_file/'));
const Index = lazy(() => import('../pages/Index'));
const Profile = lazy(() => import('../pages/Users/Profile'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));

const HRMSDashboard = lazy(() => import('../pages/HRMS/HRMSDashboard'));
const AccountsDashboard = lazy(() => import('../pages/Accounts/AccountsDashboard'));
const SettingsDashboard = lazy(() => import('../pages/Settings/SettingsDashboard'));

const UserRoles = lazy(() => import('../pages/Settings/UserRoles'));
const Roles = lazy(() => import('../pages/Settings/Roles'));
const Permissions = lazy(() => import('../pages/Settings/Permissions'));
const RolePermissions = lazy(() => import('../pages/Settings/RolePermissions'));

const Employee = lazy(() => import('../pages/HRMS/Employee/index'));
const EmployeeAdd = lazy(() => import('../pages/HRMS/Employee/component/addEmployee'));
const AttendanceList = lazy(() => import('../pages/HRMS/Employee/Attendance'));
const ManualAttendance = lazy(() => import('../pages/HRMS/Employee/Attendance/ManualAttendance'));
const EmployeeView = lazy(() => import('../pages/HRMS/Employee/EmployeeView'));

const Department = lazy(() => import('../pages/HRMS/Employee/Department/index'));
const AddDepartment = lazy(() => import('../pages/HRMS/Employee/Department/conponents/addDepartment'));
const EditDepartment = lazy(() => import('../pages/HRMS/Employee/Department/conponents/editDepartment'));
const Designation = lazy(() => import('../pages/HRMS/Employee/Designation/index'));
const DesignationAdd = lazy(() => import('../pages/HRMS/Employee/Designation/components/addDesignation'));
const DesignationEdit = lazy(() => import('../pages/HRMS/Employee/Designation/components/editDesignation'));


const AccountsSummary = lazy(() => import('../pages/Accounts/Balance/AccountsSummary'));

const Transaction = lazy(() => import('../pages/Accounts/Transaction/index'));
const TransactionAdd = lazy(() => import('../pages/Accounts/Transaction/components/AddTransaction'));
const TransactionInvoice = lazy(() => import('../pages/Invoice/AccountsInvoice/TransactionInvoice'));

const Due = lazy(() => import('../pages/Accounts/Due/index'));
const DuePay = lazy(() => import('../pages/Accounts/Due/payDue/PayDue'));
const DueInvoice = lazy(() => import('../pages/Invoice/AccountsInvoice/DueInvoice'));


const Unauthorized = lazy(() => import('./Unauthorized/Unauthorized'));

const routes = [
    {
        path: '/',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/login',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/pages/erp/modules',
        element: <ERPModules />,
        layout: 'blank',
    },

    {
        path: '/index',
        element: <ERPModules />,
        layout: 'blank',
    },

    // HRMS
    // {
    //     path: '/pages/hr/dashboard',
    //     element: <Index />,
    //     module: 'hr',
    //     permission: 'hr_dashboard',
    // },
    {
        path: '/pages/hr/dashboard',
        element: <HRMSDashboard />,
        module: 'hr',
        permission: 'hr_dashboard',
    },

    {
        path: '/pages/employee/attendance',
        element: <AttendanceList />,
        module: 'hr',
        permission: 'employee_attendance_view',
    },
    {
        path: '/pages/employee/attendance/manual',
        element: <ManualAttendance />,
        module: 'hr',
        permission: 'attendance_manual_add',
    },
    {
        path: '/pages/employees',
        element: <Employee />,
        module: 'hr',
        permission: 'employee_view',
    },
    {
        path: '/pages/employee/add',
        element: <EmployeeAdd />,
        module: 'hr',
        permission: 'employee_add',
    },
    {
        path: '/pages/employee/edit/:id',
        element: <EmployeeAdd />,
        module: 'hr',
        permission: 'employee_details',
    },
    {
        path: '/pages/employee/view/:id',
        element: <EmployeeView />,
        module: 'hr',
        permission: 'employee_details',
    },
    {
        path: '/pages/employee/department',
        element: <Department />,
        module: 'hr',
        permission: 'department_view',
    },
    {
        path: '/pages/employee/department/add',
        element: <AddDepartment />,
        module: 'hr',
        permission: 'department_add',
    },
    {
        path: '/pages/employee/department/edit/:id',
        element: <EditDepartment />,
        module: 'hr',
        permission: 'department_edit',
    },
    {
        path: '/pages/employee/designation',
        element: <Designation />,
        module: 'hr',
        permission: 'designation_view',
    },
    {
        path: '/pages/employee/designation/add',
        element: <DesignationAdd />,
        module: 'hr',
        permission: 'designation_add',
    },
    {
        path: '/pages/employee/designation/edit/:id',
        element: <DesignationEdit />,
        module: 'hr',
        permission: 'designation_edit',
    },

    // Accounts
    {
        path: '/pages/accounts/dashboard',
        element: <AccountsDashboard />,
        module: 'accounts',
        permission: 'accounts_dashboard',
    },
    {
        path: '/pages/accounts/summary',
        element: <AccountsSummary />,
        module: 'accounts',
        permission: 'accounts_summary_view',
    },
    {
        path: '/pages/accounts/transaction',
        element: <Transaction />,
        module: 'accounts',
        permission: 'transaction_view',
    },
    {
        path: '/pages/accounts/transaction/add',
        element: <TransactionAdd />,
        module: 'accounts',
        permission: 'transaction_add',
    },
    {
        path: '/pages/accounts/transaction/invoice/:id',
        element: <TransactionInvoice />,
        module: 'accounts',
        permission: 'transaction_invoice_view',
    },
    {
        path: '/pages/accounts/due',
        element: <Due />,
        module: 'accounts',
        permission: 'due_view',
    },
    {
        path: '/pages/accounts/due/payment/:source_type/:source_id/:due_type',
        element: <DuePay />,
        module: 'accounts',
        permission: 'due_payment',
    },
    {
        path: '/pages/accounts/due/invoice/:source_type/:source_id/:due_type',
        element: <DueInvoice />,
        module: 'accounts',
        permission: 'due_invoice_view',
    },

    // Settings
    {
        path: '/pages/settings/dashboard',
        element: <SettingsDashboard />,
        module: 'settings',
        permission: 'settings_dashboard',
    },
    {
        path: '/pages/user/profile',
        element: <Profile />,
        module: 'settings',
    },
    {
        path: '/pages/settings/user-roles',
        element: <UserRoles />,
        module: 'settings',
        permission: 'user_role_manage',
    },
    {
        path: '/pages/settings/roles',
        element: <Roles />,
        module: 'settings',
        permission: 'role_manage',
    },
    {
        path: '/pages/settings/permissions',
        element: <Permissions />,
        module: 'settings',
        permission: 'permission_manage',
    },
    {
        path: '/pages/settings/role-permissions',
        element: <RolePermissions />,
        module: 'settings',
        permission: 'role_permission_manage',
    },
    {
        path: '/pages/settings',
        element: <div>Settings</div>,
        module: 'settings',
    },

    {
        path: '/unauthorized',
        element: <Unauthorized />,
        module: 'settings',
    },
];

export { routes };