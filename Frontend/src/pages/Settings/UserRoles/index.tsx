import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';

interface Role {
    id: number;
    role_name: string;
    role_key: string;
}

interface User {
    id: number;
    user_name: string;
    user_phone: string;
    user_email: string;
    user_role: number;
    user_img?: string;
    Role?: Role;
}

const UserRoles = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    const getUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/users-with-roles`);
            setUsers(res.data);
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.detail || 'Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getRoles = async () => {
        try {
            const res = await api.get(`/roles`);
            setRoles(res.data);
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.detail || 'Failed to load roles', 'error');
        }
    };
    const deleteUser = async (userId: number) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This user will be deleted permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/users/${userId}`);

            Swal.fire('Deleted', 'User deleted successfully', 'success');
            getUsers();
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.detail || 'Delete failed', 'error');
        }
    };

    useEffect(() => {
        getUsers();
        getRoles();

    }, []);

    const changeUserRole = async (userId: number, roleId: number) => {
        try {
            await api.put(
                `/users/${userId}/change-role`,
                { user_role: roleId }
            );

            Swal.fire('Success', 'User role updated successfully', 'success');
            getUsers();
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.detail || 'Role update failed', 'error');
        }
    };

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="text-lg font-semibold">User Role Management</h5>
            </div>

            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>SL</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Current Role</th>
                            <th>Change Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_email}</td>
                                    <td>{user.user_phone}</td>
                                    <td>
                                        <span className="badge bg-primary">
                                            {user.Role?.role_name || 'No Role'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select w-48"
                                            value={user.user_role || ''}
                                            onChange={(e) =>
                                                changeUserRole(user.id, Number(e.target.value))
                                            }
                                            disabled={user.user_role === 1}
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.role_name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteUser(user.id)}
                                            disabled={user.user_role === 1}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRoles;