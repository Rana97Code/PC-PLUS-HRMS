import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../../api/axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../store';

const AddEmployee = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const auth = useSelector((state: IRootState) => state.auth);

    const today = new Date().toISOString().slice(0, 10);

    const [departments, setDepartments] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        employee_id: '',
        name: '',
        email: '',
        phone: '',
        department_id: '',
        designation_id: '',
        joining_date: today,
        salary: '',
        address: '',
        created_by: auth.user?.user_email || '',
        updated_by: auth.user?.user_email || '',
    });

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'department_id' ? { designation_id: '' } : {}),
        }));
    };

    const fetchDepartments = async () => {
        const res = await api.get(`/departments`);
        setDepartments(res.data || []);
    };

    const fetchDesignations = async () => {
        const res = await api.get(`/designations`);
        setDesignations(res.data || []);
    };

    const fetchEmployee = async () => {
        if (!isEdit) return;

        try {
            setLoading(true);

            const res = await api.get(`/employee/${id}`);

            setForm({
                employee_id: res.data.employee_id || '',
                name: res.data.name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                department_id: res.data.department_id || '',
                designation_id: res.data.designation_id || '',
                joining_date: res.data.joining_date || today,
                salary: res.data.salary || '',
                address: res.data.address || '',
                created_by: res.data.created_by || auth.user?.user_email || '',
                updated_by: auth.user?.user_email || '',
            });
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to load employee');
            navigate('/pages/employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchDesignations();
        fetchEmployee();
    }, [id]);

    const filteredDesignations = designations.filter(
        (item: any) => Number(item.department_id) === Number(form.department_id)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...form,
            department_id: Number(form.department_id),
            designation_id: Number(form.designation_id),
            salary: Number(form.salary || 0),
        };

        try {
            if (isEdit) {
                await api.put(`/employee/${id}`, payload);
            } else {
                await api.post(`/employee`, payload);
            }

            navigate('/pages/employees');
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to save employee');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    {isEdit ? 'Edit Employee' : 'Add Employee'}
                </h2>

                <Link to="/pages/employees" className="btn btn-secondary gap-2">
                    Back to List
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                <div>
                                    <label>Employee ID</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.employee_id}
                                        onChange={(e) => handleChange('employee_id', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={form.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                    />
                                </div>

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
                                    <label>Designation</label>
                                    <select
                                        className="form-select"
                                        value={form.designation_id}
                                        onChange={(e) => handleChange('designation_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Designation</option>
                                        {filteredDesignations.map((designation) => (
                                            <option key={designation.id} value={designation.id}>
                                                {designation.designation_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Joining Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={form.joining_date}
                                        onChange={(e) => handleChange('joining_date', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Salary</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={form.salary}
                                        onChange={(e) => handleChange('salary', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label>Address</label>
                                    <textarea
                                        className="form-input py-2.5 text-sm w-full min-h-[100px]"
                                        value={form.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-4">
                                <button type="submit" className="btn btn-primary gap-2">
                                    {isEdit ? 'Update Employee' : 'Save Employee'}
                                </button>

                                <Link to="/pages/employees">
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

export default AddEmployee;