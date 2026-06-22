import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import axios from 'axios';
import UserContext from '../../../context/UserContex';
import { useReactToPrint } from 'react-to-print';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                .then((response) => setBalance(response.data || {}))
                .catch((error) => console.error('Error fetching balance:', error));

            axios.get(`${baseUrl}/accounts/investor-contribution`, { headers })
                .then((response) => setInvestors(response.data || []))
                .catch((error) => console.error('Error fetching investor contribution:', error));
        }
    }, [token, baseUrl]);

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
        setInvestorRecords([]);
        setIsModalOpen(true);

        try {
            const safeInvestorName = encodeURIComponent(investorName);
            const response = await axios.get(`${baseUrl}/accounts/investor-contribution/${safeInvestorName}`, { headers });

            setInvestorRecords(response.data || []);
        } catch (error) {
            console.error('Error fetching investor details:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvestor('');
        setInvestorRecords([]);
    };

const investmentPrintRef = useRef<HTMLDivElement>(null);

const printInvestorDetails = useReactToPrint({
    contentRef: investmentPrintRef,
    documentTitle: `Investment-Details-${selectedInvestor}`,
});

    const totalInvestment = investorRecords
        .reduce((sum, item) => sum + Number(item.amount_in || 0), 0)
        .toFixed(2);

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black print:hidden">
                <h2 className="text-xl font-bold">Accounts Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-5 print:hidden">
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

            <div className="pt-5 print:hidden">
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

          {isModalOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
                    <div
                        ref={investmentPrintRef}
                        className="investment-print-area bg-white text-black rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between border-b p-5 no-print">
                            <div>
                                <h5 className="font-semibold text-lg">Investment Details: {selectedInvestor}</h5>
                                <p className="text-sm text-gray-500">All amount-in transactions of this investor</p>
                            </div>

                            <div className="flex gap-2">
                                <button type="button" className="btn btn-primary btn-sm" onClick={printInvestorDetails}>
                                    Print
                                </button>

                                <button type="button" className="btn btn-danger btn-sm" onClick={closeModal}>
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-center border-b pb-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/assets/images/auth/logo.jpeg"
                                        alt="PC Plus Solution"
                                        className="w-24 h-24 object-contain"
                                    />

                                    <div>
                                        <h2 className="text-2xl font-bold text-[#0064C8]">
                                            PC PLUS SOLUTION LTD
                                        </h2>
                                        <p className="text-sm">House-34, Block-A, Road-18, Banani, Dhaka</p>
                                        <p className="text-sm">Email: info@pcplusbd.com</p>
                                        <p className="text-sm">Phone: +8801772699434</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <h3 className="text-xl font-bold text-[#0064C8]">
                                        INVESTMENT DETAILS
                                    </h3>
                                    <p className="text-sm">
                                        Investor: <strong>{selectedInvestor}</strong>
                                    </p>
                                    <p className="text-sm">
                                        Print Date: {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border rounded p-3">
                                    <p className="text-sm text-gray-500">Investor Name</p>
                                    <h4 className="font-bold">{selectedInvestor}</h4>
                                </div>

                                <div className="border rounded p-3">
                                    <p className="text-sm text-gray-500">Total Transaction</p>
                                    <h4 className="font-bold">{investorRecords.length}</h4>
                                </div>

                                <div className="border rounded p-3">
                                    <p className="text-sm text-gray-500">Total Investment</p>
                                    <h4 className="font-bold">{totalInvestment}</h4>
                                </div>
                            </div>

                            <div className="overflow-x-auto investment-table-wrapper">
                                <table className="investment-table w-full table-hover whitespace-nowrap border">
                                    <thead>
                                        <tr className="investment-header">
                                            <th className="p-2 border">SL</th>
                                            <th className="p-2 border">Invoice</th>
                                            <th className="p-2 border">Date</th>
                                            <th className="p-2 border">Type</th>
                                            <th className="p-2 border">Investor</th>
                                            <th className="p-2 border">To</th>
                                            <th className="p-2 border">Amount In</th>
                                            <th className="p-2 border">Note</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {investorRecords.length > 0 ? (
                                            investorRecords.map((item: any, index: number) => (
                                                <tr key={`${item.id}-${index}`}>
                                                    <td className="p-2 border">{index + 1}</td>
                                                    <td className="p-2 border">
                                                        <NavLink
                                                            to={`/pages/accounts/transaction/invoice/${item.id}`}
                                                            className="text-cyan-500 print:text-black"
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
                                                    <td className="p-2 border whitespace-normal">{item.transaction_notes}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="p-4 border text-center" colSpan={8}>
                                                    No investment details found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                    <tfoot>
                                        <tr className="investment-footer">
                                            <td className="p-2 border text-right" colSpan={6}>
                                                Total
                                            </td>
                                            <td className="p-2 border text-right">{totalInvestment}</td>
                                            <td className="p-2 border"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="grid grid-cols-2 gap-10 mt-16">
                                <div>
                                    <div className="border-t border-black pt-2 text-center">
                                        Prepared By
                                    </div>
                                </div>

                                <div>
                                    <div className="border-t border-black pt-2 text-center">
                                        Authorized Signature
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <style>
                        {`
                            .investment-header {
                                background: #0064C8 !important;
                                color: #ffffff !important;
                            }

                            .investment-footer {
                                background: #0064C8 !important;
                                color: #ffffff !important;
                                font-weight: bold;
                            }

                            @media print {
                                body {
                                    background: white !important;
                                }

                                * {
                                    -webkit-print-color-adjust: exact !important;
                                    print-color-adjust: exact !important;
                                }

                                .no-print {
                                    display: none !important;
                                }

                                .investment-print-area {
                                    width: 100% !important;
                                    max-width: 100% !important;
                                    max-height: none !important;
                                    overflow: visible !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                    box-shadow: none !important;
                                    border-radius: 0 !important;
                                    background: white !important;
                                    color: black !important;
                                }

                                .investment-table-wrapper {
                                    overflow: visible !important;
                                }

                                .investment-table {
                                    width: 100% !important;
                                    table-layout: fixed !important;
                                    border-collapse: collapse !important;
                                    font-size: 10px !important;
                                }

                                .investment-table th,
                                .investment-table td {
                                    padding: 5px !important;
                                    word-break: break-word !important;
                                    white-space: normal !important;
                                }

                                .investment-header th {
                                    background: #0064C8 !important;
                                    color: #ffffff !important;
                                    font-weight: bold !important;
                                }

                                .investment-footer td {
                                    background: #0064C8 !important;
                                    color: #ffffff !important;
                                    font-weight: bold !important;
                                }

                                @page {
                                    size: A4 landscape;
                                    margin: 10mm;
                                }
                            }
                        `}
                    </style>
                </div>
            )}
        </div>
    );
};

export default AccountsSummary;