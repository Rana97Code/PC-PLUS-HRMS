import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { DataTable } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { IRootState } from '../../../store';

const Departments = () => {
    const auth = useSelector((state: IRootState) => state.auth);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

    const [departments, setDepartments] = useState<any[]>([]);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [sortStatus, setSortStatus] = useState<any>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseUrl}/departments`, { headers });

            const data = res.data || [];
            setDepartments(data);
            setInitialRecords(sortBy(data, 'id').reverse());
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to load departments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
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
        const keyword = search.toLowerCase();

        const filtered = departments.filter((item: any) =>
            item.department_name?.toLowerCase().includes(keyword) ||
            item.department_code?.toLowerCase().includes(keyword) ||
            item.description?.toLowerCase().includes(keyword)
        );

        setInitialRecords(filtered);
    }, [search, departments]);

    useEffect(() => {
        const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
        setPage(1);
    }, [sortStatus]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this department?')) return;

        try {
            await axios.delete(`${baseUrl}/departments/${id}`, { headers });
            fetchDepartments();
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to delete department');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    Department List
                </h2>

                <Link to="/pages/employee/department/add" className="btn btn-primary gap-2">
                    Add Department
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">
                            Departments
                        </h5>

                        <div className="ltr:ml-auto rtl:mr-auto">
                            <input
                                type="text"
                                className="form-input w-auto"
                                placeholder="Search department..."
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
                                    accessor: 'department_name',
                                    title: 'Department Name',
                                    sortable: true,
                                },
                                {
                                    accessor: 'department_code',
                                    title: 'Code',
                                    sortable: true,
                                },
                                {
                                    accessor: 'description',
                                    title: 'Description',
                                    render: ({ description }) => description || '-',
                                },
                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    render: ({ status }) => (
                                        <span className={`badge ${status === 1 ? 'badge-outline-success' : 'badge-outline-danger'}`}>
                                            {status === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: ({ id }) => (
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                to={`/pages/employee/department/edit/${id}`}
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
                            onPageChange={setPage}
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

export default Departments;