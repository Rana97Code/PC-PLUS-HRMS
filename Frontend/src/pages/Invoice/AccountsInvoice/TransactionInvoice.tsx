import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import axios from 'axios';
import UserContext from '../../../context/UserContex';

const TransactionInvoice = () => {
    const params = useParams();
    const user = useContext(UserContext);
    const headers = user.headers;
    const baseUrl = user.base_url;

    const dispatch = useDispatch();

    interface RecordWithIndex {
        [key: string]: any;
        index: number;
        id: number;
        transaction_date: string;
        transaction_type: string;
        transaction_by: string;
        transaction_to: string;
        amount_in: number;
        amount_out: number;
        cost: number;
        due_amount: number;
        return_amount: number;
        transaction_notes: string;
    }

    const [invoiceNo, setInvoiceNo] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [totalAmountIn, setTotalAmountIn] = useState(0);
    const [totalAmountOut, setTotalAmountOut] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
    const [totalReturn, setTotalReturn] = useState(0);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    useEffect(() => {
        dispatch(setPageTitle('Transaction Invoice'));
    }, [dispatch]);

    useEffect(() => {
        axios
            .get(`${baseUrl}/transaction/transaction_invoice/${params.id}`, { headers })
            .then((response) => {
                const data = response.data;

                setInvoiceNo(data.invoice_no);
                setInvoiceDate(data.invoice_date);
                setCreatedBy(data.created_by);
                setInitialRecords(data.items || []);

                setTotalAmountIn(data.total_amount_in || 0);
                setTotalAmountOut(data.total_amount_out || 0);
                setTotalCost(data.total_cost || 0);
                setTotalDue(data.total_due || 0);
                setTotalReturn(data.total_return || 0);
            })
            .catch((error) => {
                console.error('Error fetching transaction invoice:', error);
            });
    }, []);

    const recordsDataWithIndex: RecordWithIndex[] = recordsData.map((record: RecordWithIndex, index: number) => ({
        ...record,
        index: index + 1,
    }));

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        const sortedData = sortStatus.direction === 'desc' ? data.reverse() : data;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setRecordsData(sortedData.slice(from, to));
    }, [page, pageSize, initialRecords, sortStatus]);

    const handlePrint = () => {
        window.print();
    };

 return (
    <div>
        <div className="panel flex items-center justify-between flex-wrap gap-4 text-black print:hidden">
            <h2 className="text-xl font-bold">Transaction Invoice</h2>

            <div className="flex gap-3">
                <Link to="/pages/accounts/transaction" className="btn btn-secondary">
                    ← Back
                </Link>

                <button type="button" onClick={handlePrint} className="btn btn-primary">
                    Print Invoice
                </button>
            </div>
        </div>

        <div className="pt-5">
            <div className="bg-white text-black p-8 rounded shadow print:shadow-none print:rounded-none print:p-0" id="invoiceArea">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-6 mb-6">
                    <div className="flex items-center gap-4">
                        <img
                            src="/assets/images/auth/logo.jpeg"
                            alt="Company Logo"
                            className="w-40 h-50 object-contain"
                        />

                        <div>
                            <h1 className="text-2xl font-bold">PC PLUS SOLUTION LTD</h1>
                            <p className="text-sm">House-34,Block-A,Road-18,Banani,Dhaka,Bangladesh</p>
                            <p className="text-sm">Email: info@pcplusbd.com</p>
                            <p className="text-sm">Phone: +880 1772-699434</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2
                            className="text-3xl font-bold uppercase"
                            style={{ color: '#0064C8' }}
                        >
                            Transaction Invoice
                        </h2>                        
                        <p className="text-sm mt-2">
                            <strong>Invoice No:</strong> {invoiceNo}
                        </p>
                        <p className="text-sm">
                            <strong>Date:</strong> {invoiceDate}
                        </p>
                    </div>
                </div>

                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border rounded p-4">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2">Transaction Info</h3>

                        <p className="text-sm mb-2">
                            <strong>Invoice No:</strong> {invoiceNo}
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Invoice Date:</strong> {invoiceDate}
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Created By:</strong> {createdBy}
                        </p>
                    </div>

                    <div className="border rounded p-4">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2">Summary</h3>

                        <p className="text-sm mb-2">
                            <strong>Total Amount In:</strong> {totalAmountIn}
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Total Amount Out:</strong> {totalAmountOut}
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Total Cost:</strong> {totalCost}
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Total Due:</strong> {totalDue}
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Total Return:</strong> {totalReturn}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-[#757575] text-sm">
                        <thead>
                             <tr  className="text-[#757575]"
        style={{ backgroundColor: '#0064C8' }}>
                                <th className="border p-2">SL</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">By</th>
                                <th className="border p-2">To</th>
                                <th className="border p-2">Amount In</th>
                                <th className="border p-2">Amount Out</th>
                                <th className="border p-2">Cost</th>
                                <th className="border p-2">Due</th>
                                <th className="border p-2">Return</th>
                                <th className="border p-2">Note</th>
                            </tr>
                        </thead>

                        <tbody>
                            {initialRecords.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className="border p-2 text-center">{index + 1}</td>
                                    <td className="border p-2">{item.transaction_date}</td>
                                    <td className="border p-2">{item.transaction_type}</td>
                                    <td className="border p-2">{item.transaction_by}</td>
                                    <td className="border p-2">{item.transaction_to}</td>
                                    <td className="border p-2 text-right">{item.amount_in}</td>
                                    <td className="border p-2 text-right">{item.amount_out}</td>
                                    <td className="border p-2 text-right">{item.cost}</td>
                                    <td className="border p-2 text-right">{item.due_amount}</td>
                                    <td className="border p-2 text-right">{item.return_amount}</td>
                                    <td className="border p-2">{item.transaction_notes}</td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr  className="text-[#757575]" style={{ backgroundColor: '#0064C8' }}>
                                <td className="border p-2 text-right" colSpan={5}>
                                    Total
                                </td>
                                <td className="border p-2 text-right">{totalAmountIn}</td>
                                <td className="border p-2 text-right">{totalAmountOut}</td>
                                <td className="border p-2 text-right">{totalCost}</td>
                                <td className="border p-2 text-right">{totalDue}</td>
                                <td className="border p-2 text-right">{totalReturn}</td>
                                <td className="border p-2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
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
                @media print {
                    body {
                        background: white !important;
                    }

                    #invoiceArea {
                        background: white !important;
                        color: black !important;
                        width: 100%;
                    }

                    .print\\:hidden {
                        display: none !important;
                    }

                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                }
            `}
        </style>
    </div>
);
};

export default TransactionInvoice;