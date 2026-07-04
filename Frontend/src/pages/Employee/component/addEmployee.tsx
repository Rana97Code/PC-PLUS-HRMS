import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';

const AddEmployee = () => {
    const navigate = useNavigate();
    const auth = useSelector((state: IRootState) => state.auth);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

    const today = new Date().toISOString().slice(0, 10);

    const [form, setForm] = useState({
        employee_id: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        joining_date: today,
        salary: '',
        address: '',
        created_by: auth.user?.user_email || '',
    });

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(`${baseUrl}/employees`, {
                ...form,
                salary: Number(form.salary || 0),
            }, { headers });

            navigate('/pages/hrms/employees');
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to create employee');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">Add Employee</h2>

                <Link to="/pages/hrms/employees" className="btn btn-secondary gap-2">
                    Back to List
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
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
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.department}
                                    onChange={(e) => handleChange('department', e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Designation</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.designation}
                                    onChange={(e) => handleChange('designation', e.target.value)}
                                />
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
                                Save Employee
                            </button>

                            <Link to="/pages/hrms/employees">
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

export default AddEmployee;