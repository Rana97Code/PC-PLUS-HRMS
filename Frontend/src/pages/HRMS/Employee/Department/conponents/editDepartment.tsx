import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../../../api/axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../../store';

const EditDepartment = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const auth = useSelector((state: IRootState) => state.auth);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        department_name: '',
        department_code: '',
        description: '',
        status: 1,
        updated_by: auth.user?.user_email || '',
    });

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const fetchDepartment = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/departments/${id}`);

            setForm({
                department_name: res.data.department_name || '',
                department_code: res.data.department_code || '',
                description: res.data.description || '',
                status: res.data.status,
                updated_by: auth.user?.user_email || '',
            });
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to load department');
            navigate('/pages/employee/department');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.put(`/departments/${id}`, form);
            navigate('/pages/employee/department');
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to update department');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    Edit Department
                </h2>

                <Link to="/pages/employee/department" className="btn btn-secondary gap-2">
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
                                    Update Department
                                </button>

                                <Link to="/pages/employee/department">
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

export default EditDepartment;