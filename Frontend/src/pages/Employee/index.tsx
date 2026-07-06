import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { DataTable } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { IRootState } from '../../store';

const EmployeesIndex = () => {
    const auth = useSelector((state: IRootState) => state.auth);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

    const [employees, setEmployees] = useState<any[]>([]);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    const [records, setRecords] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [sortStatus, setSortStatus] = useState<any>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${baseUrl}/employees`, { headers });

            const data = res.data || [];
            setEmployees(data);
            setInitialRecords(sortBy(data, 'id').reverse());
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const filtered = employees.filter((item: any) => {
            const keyword = search.toLowerCase();

            return (
                item.employee_id?.toLowerCase().includes(keyword) ||
                item.name?.toLowerCase().includes(keyword) ||
                item.email?.toLowerCase().includes(keyword) ||
                item.phone?.toLowerCase().includes(keyword) ||
                item.Department?.department_name?.toLowerCase().includes(keyword) ||
                item.Designation?.designation_name?.toLowerCase().includes(keyword)
            );
        });

        setInitialRecords(filtered);
    }, [search, employees]);

    useEffect(() => {
        const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);

        setInitialRecords(
            sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData
        );

        setPage(1);
    }, [sortStatus]);

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm('Are you sure you want to delete this employee?');

        if (!confirmDelete) return;

        try {
            await axios.delete(`${baseUrl}/employees/${id}`, { headers });
            fetchEmployees();
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to delete employee');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    Employee List
                </h2>

                <Link to="/pages/employee/add" className="btn btn-primary gap-2">
                    Add Employee
                </Link>
            </div>

            <div className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
                    <div className="panel">
                        <p className="text-sm text-white-dark">Total Employees</p>
                        <h3 className="text-2xl font-bold mt-2">{employees.length}</h3>
                    </div>

                    <div className="panel">
                        <p className="text-sm text-white-dark">Active Employees</p>
                        <h3 className="text-2xl font-bold mt-2">
                            {employees.filter((e) => e.status === 1).length}
                        </h3>
                    </div>

                    <div className="panel">
                        <p className="text-sm text-white-dark">Inactive Employees</p>
                        <h3 className="text-2xl font-bold mt-2">
                            {employees.filter((e) => e.status === 0).length}
                        </h3>
                    </div>

                    <div className="panel">
                        <p className="text-sm text-white-dark">Departments</p>
                        <h3 className="text-2xl font-bold mt-2">
                            {
                                new Set(
                                    employees
                                        .map((e) => e.Department?.department_name)
                                        .filter(Boolean)
                                ).size
                            }
                        </h3>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">
                            Employees
                        </h5>

                        <div className="ltr:ml-auto rtl:mr-auto">
                            <input
                                type="text"
                                className="form-input w-auto"
                                placeholder="Search employee..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={records}
                            columns={[
                                {
                                    accessor: 'employee_id',
                                    title: 'Employee ID',
                                    sortable: true,
                                },
                                {
                                    accessor: 'name',
                                    title: 'Name',
                                    sortable: true,
                                    render: ({ name, user_img }: any) => (
                                        <div className="flex items-center gap-2">
                                            {user_img ? (
                                                <img
                                                    src={user_img}
                                                    alt="Employee"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 grid place-content-center">
                                                    {name?.charAt(0)}
                                                </div>
                                            )}
                                            <span>{name}</span>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'email',
                                    title: 'Email',
                                    sortable: true,
                                },
                                {
                                    accessor: 'phone',
                                    title: 'Phone',
                                    sortable: true,
                                },
                                {
                                    accessor: 'department',
                                    title: 'Department',
                                    render: (row: any) =>
                                        row.Department?.department_name || '-',
                                },
                                {
                                    accessor: 'designation',
                                    title: 'Designation',
                                    render: (row: any) =>
                                        row.Designation?.designation_name || '-',
                                },
                                {
                                    accessor: 'joining_date',
                                    title: 'Joining Date',
                                    sortable: true,
                                },
                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    render: ({ status }: any) => (
                                        <span
                                            className={`badge ${
                                                status === 1
                                                    ? 'badge-outline-success'
                                                    : 'badge-outline-danger'
                                            }`}
                                        >
                                            {status === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: ({ id }: any) => (
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                to={`/pages/employee/view/${id}`}
                                                className="btn btn-sm btn-outline-info"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                to={`/pages/employee/edit/${id}`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            fetching={loading}
                            paginationText={({ from, to, totalRecords }) =>
                                `Showing ${from} to ${to} of ${totalRecords} entries`
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeesIndex;