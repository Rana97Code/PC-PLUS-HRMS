import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { logout } from '../store/authSlice'; 

const ERPModules = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const auth = useSelector((state: IRootState) => state.auth);
    const permissions = auth?.permissions || [];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    const modules = [
        {
            id: 1,
            name: 'Human Resource',
            code: 'HRMS',
            icon: '👨‍💼',
            description: 'Employee, department, designation, attendance and payroll management.',
            route: '/pages/hr/dashboard',
            permission: 'hr_dashboard',
        },
        {
            id: 2,
            name: 'Accounts',
            code: 'ACC',
            icon: '💰',
            description: 'Transactions, vouchers, due, balance, expenses and income management.',
            route: '/pages/accounts/dashboard',
            permission: 'accounts_dashboard',
        },
        // {
        //     id: 3,
        //     name: 'Inventory',
        //     code: 'INV',
        //     icon: '📦',
        //     description: 'Products, stock, warehouse, purchase and sales inventory.',
        //     route: '/pages/inventory/dashboard',
        //     permission: 'inventory_dashboard',
        // },
        {
            id: 4,
            name: 'Sales',
            code: 'SALE',
            icon: '🛒',
            description: 'Sales invoice, customer, quotation and payment tracking.',
            route: '/pages/sales/dashboard',
            permission: 'ss',
            // permission: 'sales_dashboard',
        },
        {
            id: 5,
            name: 'Purchase',
            code: 'PUR',
            icon: '🧾',
            description: 'Supplier, purchase order, purchase invoice and payment.',
            route: '/pages/purchase/dashboard',
            permission: 'pp',
            // permission: 'purchase_dashboard',
        },
        {
            id: 6,
            name: 'CRM',
            code: 'CRM',
            icon: '📊',
            description: 'Lead, customer follow-up, communication and opportunity tracking.',
            route: '/pages/crm/dashboard',
            permission: 'cc',
            // permission: 'crm_dashboard',
        },
        {
            id: 7,
            name: 'Project',
            code: 'PRJ',
            icon: '📁',
            description: 'Project, task, team, deadline and progress management.',
            route: '/pages/project/dashboard',
            permission: 'pp',
            // permission: 'project_dashboard',
        },
        {
            id: 8,
            name: 'Settings',
            code: 'SET',
            icon: '⚙️',
            description: 'Users, roles, permissions, modules and system configuration.',
            route: '/pages/settings/dashboard',
            permission: 'settings_dashboard',
        },
    ];

    const hasPermission = (permissionKey: string) => {
        return permissions.some((item: any) => {
            if (typeof item === 'string') {
                return item === permissionKey;
            }

            return (
                item?.permission_key === permissionKey ||
                item?.permission === permissionKey ||
                item?.key === permissionKey ||
                item?.name === permissionKey
            );
        });
    };

    const visibleModules = modules.filter((module) =>
        hasPermission(module.permission)
    );

    return (
        <div className="min-h-screen bg-[#f4f7fa] dark:bg-[#060818] text-black dark:text-white-dark">
            <div className="border-b border-gray-200 dark:border-[#1b2e4b] bg-white dark:bg-[#0e1726] shadow-sm">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src="/assets/images/auth/vatfavicon.png"
                            alt="PC PLUS ERP"
                            className="h-12 w-auto"
                        />

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary">
                                PC PLUS ERP
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Choose your permitted module
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="btn btn-outline-danger gap-2"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="min-h-[calc(100vh-90px)] flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-7xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold dark:text-white-light">
                            ERP Modules
                        </h2>
                        <p className="mt-3 text-gray-500 dark:text-gray-400">
                            Select a module and go directly to its dashboard
                        </p>
                    </div>

                    {visibleModules.length === 0 ? (
                        <div className="panel max-w-xl mx-auto text-center">
                            <h3 className="text-xl font-bold text-danger">
                                No Module Permission
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                You do not have permission to access any ERP module.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {visibleModules.map((module) => (
                                <Link
                                    key={module.id}
                                    to={module.route}
                                    className="group relative overflow-visible rounded-2xl border border-gray-200 dark:border-[#253b5c] bg-white dark:bg-[#0e1726] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-4xl group-hover:scale-110 transition">
                                                {module.icon}
                                            </div>

                                            <span className="badge badge-outline-primary">
                                                {module.code}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold dark:text-white-light">
                                            {module.name}
                                        </h3>

                                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 min-h-[60px]">
                                            {module.description}
                                        </p>

                                        <div className="mt-6">
                                            <span className="btn btn-primary w-full">
                                                Open Dashboard
                                            </span>
                                        </div>
                                    </div>

                                    <div className="absolute left-1/2 bottom-full mb-4 w-72 -translate-x-1/2 scale-95 rounded-xl bg-[#0e1726] text-white p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-300 z-50">
                                        <h4 className="font-bold text-white">
                                            {module.name}
                                        </h4>

                                        <p className="mt-2 text-sm text-gray-300">
                                            {module.description}
                                        </p>

                                        <div className="mt-3 text-primary text-sm font-semibold">
                                            Click to open dashboard →
                                        </div>

                                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-[#0e1726]"></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ERPModules;