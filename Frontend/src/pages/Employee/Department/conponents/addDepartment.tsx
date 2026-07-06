import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../store';

const AddDepartment = () => {
    const navigate = useNavigate();
    const auth = useSelector((state: IRootState) => state.auth);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

    const [form, setForm] = useState({
        department_name: '',
        department_code: '',
        description: '',
        status: 1,
        created_by: auth.user?.user_email || '',
    });

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(`${baseUrl}/departments`, form, { headers });
            navigate('/pages/employee/department');
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to create department');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    Add Department
                </h2>

                <Link to="/pages/employee/department" className="btn btn-secondary gap-2">
                    Back to List
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label>Department Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.department_name}
                                    onChange={(e) => handleChange('department_name', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Department Code</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.department_code}
                                    onChange={(e) => handleChange('department_code', e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Status</label>
                                <select
                                    className="form-select"
                                    value={form.status}
                                    onChange={(e) => handleChange('status', Number(e.target.value))}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>

                            <div className="md:col-span-3">
                                <label>Description</label>
                                <textarea
                                    className="form-input py-2.5 text-sm w-full min-h-[100px]"
                                    value={form.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-4">
                            <button type="submit" className="btn btn-primary gap-2">
                                Save Department
                            </button>

                            <Link to="/pages/employee/department">
                                <button type="button" className="btn btn-secondary gap-2">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;