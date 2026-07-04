import React, { lazy } from 'react';

// const file = lazy(() => import('../../public/assets/excel_file/'));
const Index = lazy(() => import('../pages/Index'));
const Profile = lazy(() => import('../pages/GeneralSettings/User/Profile'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));


const UserRoles = lazy(() => import('../pages/Settings/UserRoles'));
const Roles = lazy(() => import('../pages/Settings/Roles'));
const Permissions = lazy(() => import('../pages/Settings/Permissions'));
const RolePermissions = lazy(() => import('../pages/Settings/RolePermissions'));

const Employee = lazy(() => import('../pages/Employee/index'));
const EmployeeAdd = lazy(() => import('../pages/Employee/component/addEmployee'));
const Department = lazy(() => import('../pages/Employee/Department/index'));
const AddDepartment = lazy(() => import('../pages/Employee/Department/conponents/addDepartment'));
const EditDepartment = lazy(() => import('../pages/Employee/Department/conponents/editDepartment'));
const Designation = lazy(() => import('../pages/Employee/Designation/index'));
const DesignationAdd = lazy(() => import('../pages/Employee/Designation/components/addDesignation'));
const DesignationEdit = lazy(() => import('../pages/Employee/Designation/components/editDesignation'));


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
    // {
    //     path: '/index',
    //     element: <Index />,
    // },
    {
        path: '/index',
        element: <Index />,
        permission: 'dashboard_view',
    },
    {
        path: '/pages/user/profile',
        element: <Profile />,
    },
    {
        path: '/pages/settings/user-roles',
        element: <UserRoles />,
        permission: 'user_role_manage',
    },
    {
        path: '/pages/settings/roles',
        element: <Roles />,
        permission: 'role_manage',
    },
    {
        path: '/pages/settings/permissions',
        element: <Permissions />,
        permission: 'permission_manage',
    },
    {
        path: '/pages/settings/role-permissions',
        element: <RolePermissions />,
        permission: 'role_permission_manage',
    },
    {
        path: '/pages/settings',
        element: <div>Settings</div>,
    },

    
    {
        path: '/pages/employee',
        element: <Employee />,
        permission: 'employee_view',
    },
    {
        path: '/pages/employee/add',
        element: <EmployeeAdd />,
        permission: 'employee_add',
    },
    {
        path: '/pages/employee/department',
        element: <Department />,
        permission: 'department_view',
    },
    {
        path: '/pages/employee/department/add',
        element: <AddDepartment />,
        permission: 'department_add',
    },
    {
        path: '/pages/employee/department/edit/:id',
        element: <EditDepartment />,
        permission: 'department_edit',
    },
    {
        path: '/pages/employee/designation',
        element: <Designation />,
        permission: 'designation_view',
    },
    {
        path: '/pages/employee/designation/add',
        element: <DesignationAdd />,
        permission: 'designation_add',
    },
    {
        path: '/pages/employee/designation/edit/:id',
        element: <DesignationEdit />,
        permission: 'designation_edit',
    },


    {
        path: '/pages/accounts/summary',
        element: <AccountsSummary />,
        permission: 'accounts_summary_view',
    },
    {
        path: '/pages/accounts/transaction',
        element: <Transaction />,
        permission: 'transaction_view',
    },
    {
        path: '/pages/accounts/transaction/add',
        element: <TransactionAdd />,
        permission: 'transaction_add',
    },
    {
        path: '/pages/accounts/transaction/invoice/:id',
        element: <TransactionInvoice />,
        permission: 'transaction_invoice_view',
    },
    {
        path: '/pages/accounts/due',
        element: <Due />,
        permission: 'due_view',
    },
    {
        path: '/pages/accounts/due/payment/:source_type/:source_id/:due_type',
        element: <DuePay />,
        permission: 'due_payment',
    },
    {
        path: '/pages/accounts/due/invoice/:source_type/:source_id/:due_type',
        element: <DueInvoice />,
        permission: 'due_invoice_view',
    },

    {
        path: '/unauthorized',
        element: <Unauthorized />,
    }

];
export { routes };