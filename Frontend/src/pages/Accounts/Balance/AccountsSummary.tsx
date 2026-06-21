import React, { useEffect, useMemo, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import axios from 'axios';
import UserContext from '../../../context/UserContex';

const AccountsSummary = () => {
    const dispatch = useDispatch();
    const user = useContext(UserContext);

    const headers = user.headers;
    const baseUrl = user.base_url;
    const token = user.token;

    const PAGE_SIZES = [10, 20, 30, 50, 100];

    const [balance, setBalance] = useState<any>({});
    const [investors, setInvestors] = useState<any[]>([]);
    const [investorRecords, setInvestorRecords] = useState<any[]>([]);
    const [selectedInvestor, setSelectedInvestor] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'total_amount_in',
        direction: 'desc',
    });

    useEffect(() => {
        dispatch(setPageTitle('Accounts Summary'));
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            axios.get(`${baseUrl}/accounts/latest-balance`, { headers })
                .then((response) => {
                    setBalance(response.data || {});
                })
                .catch((error) => {
                    console.error('Error fetching balance:', error);
                });

            axios.get(`${baseUrl}/accounts/investor-contribution`, { headers })
                .then((response) => {
                    setInvestors(response.data || []);
                })
                .catch((error) => {
                    console.error('Error fetching investor contribution:', error);
                });
        }
    }, []);

    const filteredInvestors = useMemo(() => {
        const query = search.toLowerCase();

        return investors.filter((item: any) => {
            return (
                item.investor_name?.toLowerCase().includes(query) ||
                item.total_amount_in?.toString().includes(query) ||
                item.total_transaction?.toString().includes(query)
            );
        });
    }, [investors, search]);

    useEffect(() => {
        const sortedData = sortBy(filteredInvestors, sortStatus.columnAccessor);
        const finalData = sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setRecordsData(finalData.slice(from, to));
    }, [filteredInvestors, sortStatus, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize, search]);

    const openInvestorDetails = async (investorName: string) => {
        setSelectedInvestor(investorName);

        try {
            const response = await axios.get(`${baseUrl}/accounts/investor-contribution/${investorName}`, { headers });
            setInvestorRecords(response.data || []);
        } catch (error) {
            console.error('Error fetching investor details:', error);
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Accounts Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-5">
                <div className="panel bg-white">
                    <h5 className="font-semibold text-sm">Current Balance</h5>
                    <h2 className="text-2xl font-bold text-primary">{balance.current_balance || 0}</h2>
                </div>

                <div className="panel bg-white">
                    <h5 className="font-semibold text-sm">Current Cost</h5>
                    <h2 className="text-2xl font-bold text-danger">{balance.current_cost || 0}</h2>
                </div>

                <div className="panel bg-white">
                    <h5 className="font-semibold text-sm">Current Due</h5>
                    <h2 className="text-2xl font-bold text-warning">{balance.current_due || 0}</h2>
                </div>

                <div className="panel bg-white">
                    <h5 className="font-semibold text-sm">Previous Balance</h5>
                    <h2 className="text-2xl font-bold">{balance.previous_balance || 0}</h2>
                </div>
            </div>

            <div className="pt-5">
                <div className="panel col-span-3">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div>
                            <h5 className="font-semibold text-lg dark:text-white-light">Investor Contribution</h5>
                            <p className="text-sm text-gray-500">Grouped by investor name and total amount in</p>
                        </div>

                        <input
                            type="text"
                            className="h-12 w-56 border border-slate-300 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none"
                            placeholder="Search investor..."
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
                                {
                                    accessor: 'investor_name',
                                    title: 'Investor Name',
                                    sortable: true,
                                    render: ({ investor_name }) => (
                                        <button
                                            type="button"
                                            className="text-cyan-600 font-semibold hover:underline"
                                            onClick={() => openInvestorDetails(investor_name)}
                                        >
                                            {investor_name}
                                        </button>
                                    ),
                                },
                                {
                                    accessor: 'total_amount_in',
                                    title: 'Total Investment',
                                    sortable: true,
                                    render: ({ total_amount_in }) => (
                                        <span className="font-bold">{Number(total_amount_in || 0).toFixed(2)}</span>
                                    ),
                                },
                                {
                                    accessor: 'total_transaction',
                                    title: 'Total Transaction',
                                    sortable: true,
                                },
                            ]}
                            totalRecords={filteredInvestors.length}
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

            {selectedInvestor && (
                <div className="pt-5">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h5 className="font-semibold text-lg dark:text-white-light">
                                    Investment Details: {selectedInvestor}
                                </h5>
                                <p className="text-sm text-gray-500">All amount-in transactions of this investor</p>
                            </div>

                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                    setSelectedInvestor('');
                                    setInvestorRecords([]);
                                }}
                            >
                                Close
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full table-hover whitespace-nowrap">
                                <thead>
                                    <tr style={{ backgroundColor: '#0064C8', color: '#ffffff' }}>
                                        <th className="p-2">SL</th>
                                        <th className="p-2">Invoice</th>
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Type</th>
                                        <th className="p-2">Investor</th>
                                        <th className="p-2">To</th>
                                        <th className="p-2">Amount In</th>
                                        <th className="p-2">Note</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {investorRecords.map((item: any, index: number) => (
                                        <tr key={item.id}>
                                            <td className="p-2 border">{index + 1}</td>
                                            <td className="p-2 border">
                                                <NavLink
                                                    to={`/pages/accounts/transaction/invoice/${item.id}`}
                                                    className="text-cyan-500"
                                                >
                                                    {item.transaction_invoice}
                                                </NavLink>
                                            </td>
                                            <td className="p-2 border">{item.transaction_date}</td>
                                            <td className="p-2 border">{item.transaction_type}</td>
                                            <td className="p-2 border">{item.transaction_by}</td>
                                            <td className="p-2 border">{item.transaction_to}</td>
                                            <td className="p-2 border font-bold text-right">
                                                {Number(item.amount_in || 0).toFixed(2)}
                                            </td>
                                            <td className="p-2 border">{item.transaction_notes}</td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr className="font-bold bg-gray-100">
                                        <td className="p-2 border text-right" colSpan={6}>
                                            Total
                                        </td>
                                        <td className="p-2 border text-right">
                                            {investorRecords
                                                .reduce((sum, item) => sum + Number(item.amount_in || 0), 0)
                                                .toFixed(2)}
                                        </td>
                                        <td className="p-2 border"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsSummary;