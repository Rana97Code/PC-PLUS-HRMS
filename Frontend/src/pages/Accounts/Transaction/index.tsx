import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconPlus from '../../../components/Icon/IconPlus';
import axios from 'axios';
import UserContext from '../../../context/UserContex';

const TransactionIndex = () => {
    const dispatch = useDispatch();
    const user = useContext(UserContext);
    const headers = user.headers;
    const baseUrl = user.base_url;
    const token = user.token;

    const PAGE_SIZES = [10, 20, 30, 50, 100];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [records, setRecords] = useState<any[]>([]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    useEffect(() => {
        dispatch(setPageTitle('Transaction List'));
    }, [dispatch]);

    useEffect(() => {
        if (token) {

            axios
                .get(`${baseUrl}/transaction/all_transaction`, { headers })
                .then((response) => {
                    setRecords(response.data || []);
                })
                .catch((error) => {
                    console.error('Error fetching transactions:', error);
                });
        }
    }, []);

    const filteredRecords = useMemo(() => {
        const query = search.toLowerCase();

        return records.filter((item: any) => {
            return (
                item.id?.toString().includes(query) ||
                item.transaction_invoice?.toLowerCase().includes(query) ||
                item.transaction_type?.toLowerCase().includes(query) ||
                item.transaction_date?.toString().toLowerCase().includes(query) ||
                item.amount_in?.toString().includes(query) ||
                item.amount_out?.toString().includes(query) ||
                item.transaction_by?.toLowerCase().includes(query)
            );
        });
    }, [records, search]);

    useEffect(() => {
        const sortedData = sortBy(filteredRecords, sortStatus.columnAccessor);
        const finalData = sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setRecordsData(finalData.slice(from, to));
    }, [filteredRecords, sortStatus, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize, search]);

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Transaction</h2>

                <div className="flex items-center flex-wrap gap-3">
                    <Link to="/pages/accounts/transaction/add" className="btn btn-primary gap-1">
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

            <div className="pt-5">
                <div className="panel col-span-3" id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-6">
                            <h5 className="font-semibold text-lg dark:text-white-light">Transaction List</h5>
                        </div>

                        <input
                            type="text"
                            className="h-12 w-56 border border-slate-300 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'id', title: 'Serial No', sortable: true },
                                {
                                    accessor: 'transaction_invoice',
                                    title: 'Invoice No',
                                    sortable: true,
                                    render: ({ id, transaction_invoice }) => (
                                        <NavLink to={`/pages/accounts/transaction/invoice/${id}`} className="text-cyan-500">
                                            {transaction_invoice}
                                        </NavLink>
                                    ),
                                },
                                { accessor: 'transaction_type', title: 'Type', sortable: true },
                                { accessor: 'transaction_date', title: 'Date', sortable: true },
                                { accessor: 'transaction_by', title: 'Transaction By', sortable: true },
                                { accessor: 'amount_in', title: 'Credit', sortable: true },
                                { accessor: 'amount_out', title: 'Debit', sortable: true },
                            ]}
                            totalRecords={filteredRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={setPage}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionIndex;