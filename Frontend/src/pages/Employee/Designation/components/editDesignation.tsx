import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../store';

const EditDesignation = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const auth = useSelector((state: IRootState) => state.auth);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<any[]>([]);

    const [form, setForm] = useState({
        department_id: '',
        designation_name: '',
        designation_code: '',
        description: '',
        status: 1,
        updated_by: auth.user?.user_email || '',
    });

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const fetchDepartments = async () => {
        const res = await axios.get(`${baseUrl}/departments`, { headers });
        setDepartments(res.data || []);
    };

    const fetchDesignation = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${baseUrl}/designations/${id}`, { headers });

            setForm({
                department_id: res.data.department_id || '',
                designation_name: res.data.designation_name || '',
                designation_code: res.data.designation_code || '',
                description: res.data.description || '',
                status: res.data.status,
                updated_by: auth.user?.user_email || '',
            });
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to load designation');
            navigate('/pages/employee/designation');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchDesignation();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.put(`${baseUrl}/designations/${id}`, {
                ...form,
                department_id: Number(form.department_id),
            }, { headers });

            navigate('/pages/employee/designation');
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to update designation');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    Edit Designation
                </h2>

                <Link to="/pages/employee/designation" className="btn btn-secondary gap-2">
                    Back to List
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label>Department</label>
                                    <select
                                        className="form-select"
                                        value={form.department_id}
                                        onChange={(e) => handleChange('department_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Designation Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.designation_name}
                                        onChange={(e) => handleChange('designation_name', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Designation Code</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.designation_code}
                                        onChange={(e) => handleChange('designation_code', e.target.value)}
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
                                    Update Designation
                                </button>

                                <Link to="/pages/employee/designation">
                                    <button type="button" className="btn btn-secondary gap-2">
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditDesignation;