import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Roles = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const token = localStorage.getItem('token');

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const [roles, setRoles] = useState<any[]>([]);
    const [roleName, setRoleName] = useState('');
    const [roleKey, setRoleKey] = useState('');

    const getRoles = async () => {
        const res = await axios.get(`${baseUrl}/roles`, { headers });
        setRoles(res.data);
    };

    useEffect(() => {
        getRoles();
    }, []);

    const submitRole = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(
                `${baseUrl}/roles`,
                {
                    role_name: roleName,
                    role_key: roleKey,
                    status: 1
                },
                { headers }
            );

            setRoleName('');
            setRoleKey('');
            getRoles();

            Swal.fire('Success', 'Role created successfully', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.detail || 'Something went wrong', 'error');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="panel">
                <h5 className="text-lg font-semibold mb-4">Add Role</h5>

                <form onSubmit={submitRole} className="space-y-4">
                    <div>
                        <label className="form-label">Role Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Admin"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label">Role Key</label>
                        <input
                            type="text"
                            className="form-input"
                            value={roleKey}
                            onChange={(e) => setRoleKey(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Save Role
                    </button>
                </form>
            </div>

            <div className="panel lg:col-span-2">
                <h5 className="text-lg font-semibold mb-4">Role List</h5>

                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Role Name</th>
                                <th>Role Key</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={role.id}>
                                    <td>{index + 1}</td>
                                    <td>{role.role_name}</td>
                                    <td>{role.role_key}</td>
                                    <td>
                                        {role.status === 1 ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-danger">Inactive</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Roles;