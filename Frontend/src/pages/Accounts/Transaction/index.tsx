import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDispatch, useSelector } from 'react-redux';

import { setPageTitle } from '../../../store/themeConfigSlice';
import IconPlus from '../../../components/Icon/IconPlus';
import api from '../../../api/axios';
import { IRootState } from '../../../store';

interface TransactionRecord {
    id: number;
    transaction_invoice: string;
    transaction_type: string;
    transaction_title?: string;
    transaction_date: string;
    amount_in: number;
    amount_out: number;
    transaction_by: string;
}

interface TransactionPagination {
    current_page?: number;
    per_page?: number;
    total_records?: number;
    total_pages?: number;
}

interface TransactionApiResponse {
    data?: TransactionRecord[];
    transactions?: TransactionRecord[];
    pagination?: TransactionPagination;
    total_records?: number;
    total?: number;
}

const normalizeTransactionResponse = (payload: unknown) => {
    if (Array.isArray(payload)) {
        return {
            records: payload as TransactionRecord[],
            total: payload.length,
        };
    }

    if (!payload || typeof payload !== 'object') {
        return { records: [] as TransactionRecord[], total: 0 };
    }

    const result = payload as TransactionApiResponse;

    const normalizedRecords = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.transactions)
          ? result.transactions
          : [];

    const normalizedTotal = Number(
        result.pagination?.total_records ??
            result.total_records ??
            result.total ??
            normalizedRecords.length
    );

    return {
        records: normalizedRecords,
        total: Number.isFinite(normalizedTotal)
            ? normalizedTotal
            : normalizedRecords.length,
    };
};

const PAGE_SIZES = [10, 20, 30, 50, 100];

const TransactionIndex = () => {
    const dispatch = useDispatch();

    const auth = useSelector((state: IRootState) => state.auth);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [records, setRecords] = useState<TransactionRecord[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [loading, setLoading] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    const formatTransactionDate = (dateValue?: string) => {
        if (!dateValue) return '';

        const datePart = dateValue.toString().split('T')[0];
        const [year, month, day] = datePart.split('-');

        if (!year || !month || !day) {
            return dateValue.toString();
        }

        const months = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC',
        ];

        const monthIndex = Number(month) - 1;

        if (monthIndex < 0 || monthIndex > 11) {
            return dateValue.toString();
        }

        return `${day}-${months[monthIndex]}-${year}`;
    };

    useEffect(() => {
        dispatch(setPageTitle('Transaction List'));
    }, [dispatch]);

    /*
     * Wait briefly before sending the search request.
     * This prevents an API request on every keystroke.
     */
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 500);

        return () => {
            window.clearTimeout(timer);
        };
    }, [search]);

    const fetchTransactions = useCallback(async () => {
        if (!auth.token) {
            return;
        }

        try {
            setLoading(true);

            const response = await api.get<
                TransactionApiResponse | TransactionRecord[]
            >(
                '/transaction/all_transaction',
                {
                    params: {
                        page,
                        limit: pageSize,
                        search: debouncedSearch,
                        sortBy: sortStatus.columnAccessor,
                        sortDirection: sortStatus.direction,
                    },
                }
            );

            const normalized = normalizeTransactionResponse(
                response.data
            );

            setRecords(normalized.records);
            setTotalRecords(normalized.total);
        } catch (error: any) {
            console.error('Error fetching transactions:', {
                message: error?.message,
                status: error?.response?.status,
                response: error?.response?.data,
            });

            setRecords([]);
            setTotalRecords(0);

            if (error?.response?.status === 401) {
                return;
            }

            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Failed to load transactions';

            console.error(message);
        } finally {
            setLoading(false);
        }
    }, [
        auth.token,
        page,
        pageSize,
        debouncedSearch,
        sortStatus.columnAccessor,
        sortStatus.direction,
    ]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    const handleSortStatusChange = (
        newSortStatus: DataTableSortStatus
    ) => {
        setSortStatus(newSortStatus);
        setPage(1);
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black dark:text-white">
                <h2 className="text-xl font-bold">Transaction</h2>

                <div className="flex items-center flex-wrap gap-3">
                    <Link
                        to="/pages/accounts/transaction/add"
                        className="btn btn-primary gap-1"
                    >
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

            <div className="pt-5">
                <div className="panel col-span-3" id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-lg dark:text-white-light">
                                Transaction List
                            </h5>
                        </div>

                        <input
                            type="text"
                            className="h-12 w-56 border border-slate-300 px-5 rounded focus:shadow focus:outline-none dark:bg-black dark:text-white dark:border-slate-700"
                            placeholder="Search..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={records}
                            fetching={loading}
                            columns={[
                                {
                                    accessor: 'id',
                                    title: 'Serial No',
                                    sortable: true,
                                },
                                {
                                    accessor: 'transaction_invoice',
                                    title: 'Invoice No',
                                    sortable: true,
                                    render: ({
                                        id,
                                        transaction_invoice,
                                    }) => (
                                        <NavLink
                                            to={`/pages/accounts/transaction/invoice/${id}`}
                                            className="text-cyan-500 hover:underline"
                                        >
                                            {transaction_invoice}
                                        </NavLink>
                                    ),
                                },
                                {
                                    accessor: 'transaction_type',
                                    title: 'Type',
                                    sortable: true,
                                },
                                {
                                    accessor: 'transaction_date',
                                    title: 'Date',
                                    sortable: true,
                                    render: ({ transaction_date }) => (
                                        <span>
                                            {formatTransactionDate(
                                                transaction_date
                                            )}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'transaction_by',
                                    title: 'Transaction By',
                                    sortable: true,
                                },
                                {
                                    accessor: 'amount_in',
                                    title: 'Credit',
                                    sortable: true,
                                    render: ({ amount_in }) => (
                                        <span>
                                            {Number(
                                                amount_in || 0
                                            ).toLocaleString()}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'amount_out',
                                    title: 'Debit',
                                    sortable: true,
                                    render: ({ amount_out }) => (
                                        <span>
                                            {Number(
                                                amount_out || 0
                                            ).toLocaleString()}
                                        </span>
                                    ),
                                },
                            ]}
                            totalRecords={totalRecords}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={setPage}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={
                                handlePageSizeChange
                            }
                            sortStatus={sortStatus}
                            onSortStatusChange={
                                handleSortStatusChange
                            }
                            minHeight={250}
                            noRecordsText="No transactions found"
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

export default TransactionIndex;