import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Permissions = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const token = localStorage.getItem('token');

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const [permissions, setPermissions] = useState<any[]>([]);
    const [permissionName, setPermissionName] = useState('');
    const [permissionKey, setPermissionKey] = useState('');
    const [moduleName, setModuleName] = useState('');
    const [routePath, setRoutePath] = useState('');

    const ERP_MODULES = [
    "Dashboard",

    // HRMS
    "Employee",
    "Attendance",
    "Leave",
    "Holiday",
    "Payroll",
    "Department",
    "Designation",
    "Shift",
    "Notice",
    "Recruitment",

    // Accounts
    "Accounts",
    "Transaction",
    "Balance",
    "Due",
    "Adjustment",
    "Income",
    "Expense",
    "Voucher",
    "Bank",
    "Cash",
    "Ledger",
    "Journal",

    // Sales
    "Customer",
    "Quotation",
    "Sales",
    "Invoice",
    "POS",
    "Sales Return",

    // Purchase
    "Supplier",
    "Purchase",
    "Purchase Return",

    // Inventory
    "Product",
    "Category",
    "Brand",
    "Warehouse",
    "Stock",
    "Stock Transfer",
    "Stock Adjustment",

    // CRM
    "Lead",
    "Opportunity",
    "Customer Support",

    // Projects
    "Project",
    "Task",
    "Timesheet",

    // Production
    "Production",
    "Bill of Material",

    // Assets
    "Asset",
    "Asset Maintenance",

    // Reports
    "Reports",

    // Settings
    "User",
    "Role",
    "Permission",
    "Settings"
];

    const getPermissions = async () => {
        const res = await axios.get(`${baseUrl}/permissions`, { headers });
        setPermissions(res.data);
    };

    useEffect(() => {
        getPermissions();
    }, []);

    const submitPermission = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(
                `${baseUrl}/permissions`,
                {
                    permission_name: permissionName,
                    permission_key: permissionKey,
                    module_name: moduleName,
                    route_path: routePath,
                    status: 1
                },
                { headers }
            );

            setPermissionName('');
            setPermissionKey('');
            setModuleName('');
            setRoutePath('');

            getPermissions();

            Swal.fire('Success', 'Permission created successfully', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.detail || 'Something went wrong', 'error');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="panel">
                <h5 className="text-lg font-semibold mb-4">Add Permission</h5>

                <form onSubmit={submitPermission} className="space-y-4">
                    <div>
                        <label className="form-label">Permission Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={permissionName}
                            onChange={(e) => setPermissionName(e.target.value)}
                            placeholder="Transaction View"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label">Permission Key</label>
                        <input
                            type="text"
                            className="form-input"
                            value={permissionKey}
                            onChange={(e) => setPermissionKey(e.target.value)}
                            placeholder="transaction_view"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label">Module Name</label>
                            <select
                                className="form-select"
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                                required
                            >
                                <option value="">Select Module</option>

                                {ERP_MODULES.map((module) => (
                                    <option key={module} value={module}>
                                        {module}
                                    </option>
                                ))}
                            </select>
                    </div>

                    <div>
                        <label className="form-label">Route Path</label>
                        <input
                            type="text"
                            className="form-input"
                            value={routePath}
                            onChange={(e) => setRoutePath(e.target.value)}
                            placeholder="Path-Example: `/pages/accounts/transaction`"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Save Permission
                    </button>
                </form>
            </div>

            <div className="panel lg:col-span-2">
                <h5 className="text-lg font-semibold mb-4">Permission List</h5>

                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Module</th>
                                <th>Name</th>
                                <th>Key</th>
                                <th>Route</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((permission, index) => (
                                <tr key={permission.id}>
                                    <td>{index + 1}</td>
                                    <td>{permission.module_name}</td>
                                    <td>{permission.permission_name}</td>
                                    <td>{permission.permission_key}</td>
                                    <td>{permission.route_path}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Permissions;