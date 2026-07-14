import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';

interface Role {
    id: number;
    role_name: string;
    role_key: string;
}

interface Permission {
    id: number;
    permission_name: string;
    permission_key: string;
    module_name: string;
}

const RolePermissions = () => {

    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    const getRoles = async () => {
        const res = await api.get(`/roles`);
        setRoles(res.data);
    };

    const getPermissions = async () => {
        const res = await api.get(`/permissions`);
        setPermissions(res.data);
    };

    const getRolePermissions = async (roleId: string) => {
        const res = await api.get(`/roles/${roleId}/permissions`);
        setSelectedPermissions(res.data);
    };

    useEffect(() => {
        getRoles();
        getPermissions();
    }, []);

    const handleRoleChange = async (roleId: string) => {
        setSelectedRole(roleId);

        if (roleId) {
            await getRolePermissions(roleId);
        } else {
            setSelectedPermissions([]);
        }
    };

    const handlePermissionChange = (permissionId: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleModuleCheck = (moduleName: string) => {
        const modulePermissionIds = permissions
            .filter((item) => item.module_name === moduleName)
            .map((item) => item.id);

        const allSelected = modulePermissionIds.every((id) =>
            selectedPermissions.includes(id)
        );

        if (allSelected) {
            setSelectedPermissions((prev) =>
                prev.filter((id) => !modulePermissionIds.includes(id))
            );
        } else {
            setSelectedPermissions((prev) =>
                Array.from(new Set([...prev, ...modulePermissionIds]))
            );
        }
    };

    const handleSubmit = async () => {
        if (!selectedRole) {
            Swal.fire('Warning', 'Please select a role first', 'warning');
            return;
        }

        try {
            await api.post(
                `/roles/${selectedRole}/permissions`,
                {
                    permission_ids: selectedPermissions
                }
            );

            Swal.fire('Success', 'Role permissions updated successfully', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.detail || 'Something went wrong', 'error');
        }
    };

    const groupedPermissions = permissions.reduce((group: any, permission) => {
        const moduleName = permission.module_name || 'Others';

        if (!group[moduleName]) {
            group[moduleName] = [];
        }

        group[moduleName].push(permission);

        return group;
    }, {});

    return (
        <div className="space-y-6">
            <div className="panel">
                <h5 className="text-lg font-semibold mb-4">Role Permission Setup</h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="form-label">Select Role</label>
                        <select
                            className="form-select"
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedRole && (
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="text-lg font-semibold">Permission List</h5>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Save Permissions
                        </button>
                    </div>

                    <div className="space-y-5">
                        {Object.keys(groupedPermissions).map((moduleName) => {
                            const modulePermissions = groupedPermissions[moduleName];

                            const modulePermissionIds = modulePermissions.map((p: Permission) => p.id);

                            const allSelected = modulePermissionIds.every((id: number) =>
                                selectedPermissions.includes(id)
                            );

                            return (
                                <div key={moduleName} className="border rounded-md p-4">
                                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                                        <h6 className="font-semibold text-primary">
                                            {moduleName}
                                        </h6>

                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                checked={allSelected}
                                                onChange={() => handleModuleCheck(moduleName)}
                                            />
                                            <span>Select All</span>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {modulePermissions.map((permission: Permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                />
                                                <span>{permission.permission_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolePermissions;