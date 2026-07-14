import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    email?: string;
    phone?: string;
    joining_date?: string;
    user_img?: string;
    status: number;
    Department?: {
        id: number;
        department_name: string;
    };
    Designation?: {
        id: number;
        designation_name: string;
    };
}

const EmployeesIndex = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [initialRecords, setInitialRecords] = useState<Employee[]>([]);
    const [records, setRecords] = useState<Employee[]>([]);

    const [loading, setLoading] = useState(false);
    const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const response = await api.get('/employees');
            const data: Employee[] = Array.isArray(response.data)
                ? response.data
                : response.data?.employees || [];

            setEmployees(data);
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
    const keyword = search.trim().toLowerCase();

    const filteredRecords = employees.filter((item) => {
        return (
            item.employee_id?.toLowerCase().includes(keyword) ||
            item.name?.toLowerCase().includes(keyword) ||
            item.email?.toLowerCase().includes(keyword) ||
            item.phone?.toLowerCase().includes(keyword) ||
            item.Department?.department_name
                ?.toLowerCase()
                .includes(keyword) ||
            item.Designation?.designation_name
                ?.toLowerCase()
                .includes(keyword)
        );
    });

    const sortedRecords = sortBy(
        filteredRecords,
        sortStatus.columnAccessor
    );

    setInitialRecords(
        sortStatus.direction === 'desc'
            ? sortedRecords.reverse()
            : sortedRecords
    );

    setPage(1);
}, [employees, search, sortStatus]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setRecords(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const handleStatusChange = async (
        id: number,
        currentStatus: number
    ) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const statusText = newStatus === 1 ? 'Active' : 'Inactive';

        const confirmed = window.confirm(
            `Are you sure you want to make this employee ${statusText}?`
        );

        if (!confirmed) return;

        try {
            setStatusLoadingId(id);

            await api.patch(`/employees/${id}/status`, {
                status: newStatus,
            });

            // Update the table without requesting the entire list again.
            setEmployees((previousEmployees) =>
                previousEmployees.map((employee) =>
                    employee.id === id
                        ? {
                              ...employee,
                              status: newStatus,
                          }
                        : employee
                )
            );
        } catch (error: any) {
            alert(
                error?.response?.data?.detail ||
                    'Failed to change employee status'
            );
        } finally {
            setStatusLoadingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this employee?'
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/employees/${id}`);

            setEmployees((previousEmployees) =>
                previousEmployees.filter((employee) => employee.id !== id)
            );
        } catch (error: any) {
            alert(
                error?.response?.data?.detail ||
                    'Failed to delete employee'
            );
        }
    };

    return (
        <div>
            <div className="panel flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    Employee List
                </h2>

                <Link
                    to="/pages/employee/add"
                    className="btn btn-primary gap-2"
                >
                    Add Employee
                </Link>
            </div>

            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="panel">
                        <p className="text-sm text-white-dark">
                            Total Employees
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {employees.length}
                        </h3>
                    </div>

                    <div className="panel">
                        <p className="text-sm text-white-dark">
                            Active Employees
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-success">
                            {
                                employees.filter(
                                    (employee) => employee.status === 1
                                ).length
                            }
                        </h3>
                    </div>

                    <div className="panel">
                        <p className="text-sm text-white-dark">
                            Inactive Employees
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-danger">
                            {
                                employees.filter(
                                    (employee) => employee.status === 0
                                ).length
                            }
                        </h3>
                    </div>

                    <div className="panel">
                        <p className="text-sm text-white-dark">
                            Departments
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {
                                new Set(
                                    employees
                                        .map(
                                            (employee) =>
                                                employee.Department
                                                    ?.department_name
                                        )
                                        .filter(Boolean)
                                ).size
                            }
                        </h3>
                    </div>
                </div>

                <div className="panel">
                    <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light">
                            Employees
                        </h5>

                        <div className="ltr:ml-auto rtl:mr-auto">
                            <input
                                type="text"
                                className="form-input w-auto"
                                placeholder="Search employee..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="table-hover whitespace-nowrap"
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
                                    render: ({ name, user_img }) => (
                                        <div className="flex items-center gap-2">
                                            {user_img ? (
                                                <img
                                                    src={user_img}
                                                    alt={name || 'Employee'}
                                                    className="h-9 w-9 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="grid h-9 w-9 place-content-center rounded-full bg-gray-200 font-semibold text-gray-700 dark:bg-gray-700 dark:text-white">
                                                    {name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
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
                                    render: ({ email }) => email || '-',
                                },
                                {
                                    accessor: 'phone',
                                    title: 'Phone',
                                    sortable: true,
                                    render: ({ phone }) => phone || '-',
                                },
                                {
                                    accessor: 'department',
                                    title: 'Department',
                                    render: (row) =>
                                        row.Department?.department_name ||
                                        '-',
                                },
                                {
                                    accessor: 'designation',
                                    title: 'Designation',
                                    render: (row) =>
                                        row.Designation?.designation_name ||
                                        '-',
                                },
                                {
                                    accessor: 'joining_date',
                                    title: 'Joining Date',
                                    sortable: true,
                                    render: ({ joining_date }) =>
                                        joining_date || '-',
                                },
                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    sortable: true,
                                    render: ({ id, status }) => (
                                        <button
                                            type="button"
                                            disabled={
                                                statusLoadingId === id
                                            }
                                            onClick={() =>
                                                handleStatusChange(
                                                    id,
                                                    status
                                                )
                                            }
                                            className={`badge cursor-pointer border-0 ${
                                                status === 1
                                                    ? 'badge-outline-success'
                                                    : 'badge-outline-danger'
                                            } ${
                                                statusLoadingId === id
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            }`}
                                            title="Click to change status"
                                        >
                                            {statusLoadingId === id
                                                ? 'Updating...'
                                                : status === 1
                                                  ? 'Active'
                                                  : 'Inactive'}
                                        </button>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: ({ id }) => (
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
                                                onClick={() =>
                                                    handleDelete(id)
                                                }
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
                            onPageChange={setPage}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={250}
                            fetching={loading}
                            noRecordsText="No employees found"
                            paginationText={({
                                from,
                                to,
                                totalRecords,
                            }) =>
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