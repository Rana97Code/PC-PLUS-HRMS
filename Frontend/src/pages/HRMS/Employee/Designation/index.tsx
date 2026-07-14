import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../../api/axios';
import { useSelector } from 'react-redux';
import { DataTable } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { IRootState } from '../../../../store';

const Designations = () => {
    const auth = useSelector((state: IRootState) => state.auth);

    const [designations, setDesignations] = useState<any[]>([]);
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

    const fetchDesignations = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/designations`);

            const data = res.data || [];
            setDesignations(data);
            setInitialRecords(sortBy(data, 'id').reverse());
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to load designations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesignations();
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

        const filtered = designations.filter((item: any) =>
            item.designation_name?.toLowerCase().includes(keyword) ||
            item.designation_code?.toLowerCase().includes(keyword) ||
            item.Department?.department_name?.toLowerCase().includes(keyword) ||
            item.description?.toLowerCase().includes(keyword)
        );

        setInitialRecords(filtered);
    }, [search, designations]);

    useEffect(() => {
        const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
        setPage(1);
    }, [sortStatus]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this designation?')) return;

        try {
            await api.delete(`/designations/${id}`);
            fetchDesignations();
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to delete designation');
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    Designation List
                </h2>

                <Link to="/pages/employee/designation/add" className="btn btn-primary gap-2">
                    Add Designation
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">
                            Designations
                        </h5>

                        <div className="ltr:ml-auto rtl:mr-auto">
                            <input
                                type="text"
                                className="form-input w-auto"
                                placeholder="Search designation..."
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
                                    accessor: 'designation_name',
                                    title: 'Designation Name',
                                    sortable: true,
                                },
                                {
                                    accessor: 'designation_code',
                                    title: 'Code',
                                    sortable: true,
                                },
                                {
                                    accessor: 'department',
                                    title: 'Department',
                                    render: (row: any) =>
                                        row.Department?.department_name || '-',
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
                                                to={`/pages/employee/designation/edit/${id}`}
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

export default Designations;