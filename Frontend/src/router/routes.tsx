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