import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import axios from 'axios';
import UserContext from '../../../context/UserContex';
import { useReactToPrint } from 'react-to-print';

const TransactionInvoice = () => {
    const params = useParams();
    const user = useContext(UserContext);
    const headers = user.headers;
    const baseUrl = user.base_url;
    const dispatch = useDispatch();

    const printRef = useRef<HTMLDivElement>(null);

    const [invoiceNo, setInvoiceNo] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [totalAmountIn, setTotalAmountIn] = useState(0);
    const [totalAmountOut, setTotalAmountOut] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
    const [totalReturn, setTotalReturn] = useState(0);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);

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

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Transaction-Invoice-${invoiceNo}`,
    });

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black no-print">
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
                <div ref={printRef} className="invoice-print-area bg-white text-black p-8 rounded shadow">
                    <div className="flex justify-between items-start border-b pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/images/auth/logo.jpeg"
                                alt="Company Logo"
                                className="w-36 h-24 object-contain"
                            />

                            <div>
                                <h1 className="text-2xl font-bold">PC PLUS SOLUTION LTD</h1>
                                <p className="text-sm">House-34, Block-A, Road-18, Banani, Dhaka, Bangladesh</p>
                                <p className="text-sm">Email: info@pcplusbd.com</p>
                                <p className="text-sm">Phone: +880 1772-699434</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className="text-3xl font-bold uppercase" style={{ color: '#0064C8' }}>
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

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="border rounded p-4">
                            <h3 className="font-bold text-lg mb-3 border-b pb-2" style={{ color: '#0064C8' }}>
                                Transaction Info
                            </h3>
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
                            <h3 className="font-bold text-lg mb-3 border-b pb-2" style={{ color: '#0064C8' }}>
                                Summary
                            </h3>
                            <p className="text-sm mb-2">
                                <strong>Total Amount Credit:</strong> {totalAmountIn}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Total Amount Debit:</strong> {totalAmountOut}
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

                    <div className="overflow-x-auto print-table-wrapper">
                        <table className="invoice-table w-full border border-gray-300 text-sm">
                            <thead>
                                <tr className="invoice-table-head">
                                    <th className="border p-2">SL</th>
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Type</th>
                                    <th className="border p-2">By</th>
                                    <th className="border p-2">To</th>
                                    <th className="border p-2">Amount Credit</th>
                                    <th className="border p-2">Amount Debit</th>
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
                                        <td className="border p-2 text-right">{Number(item.amount_in || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-right">{Number(item.amount_out || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-right">{Number(item.cost || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-right">{Number(item.due_amount || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-right">{Number(item.return_amount || 0).toFixed(2)}</td>
                                        <td className="border p-2 whitespace-normal">{item.transaction_notes}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr className="invoice-table-foot">
                                    <td className="border p-2 text-right" colSpan={5}>
                                        Total
                                    </td>
                                    <td className="border p-2 text-right">{Number(totalAmountIn || 0).toFixed(2)}</td>
                                    <td className="border p-2 text-right">{Number(totalAmountOut || 0).toFixed(2)}</td>
                                    <td className="border p-2 text-right">{Number(totalCost || 0).toFixed(2)}</td>
                                    <td className="border p-2 text-right">{Number(totalDue || 0).toFixed(2)}</td>
                                    <td className="border p-2 text-right">{Number(totalReturn || 0).toFixed(2)}</td>
                                    <td className="border p-2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mt-16">
                        <div>
                            <div className="border-t border-black pt-2 text-center">Prepared By</div>
                        </div>

                        <div>
                            <div className="border-t border-black pt-2 text-center">Authorized Signature</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
            {`
                :root {
                    --invoice-theme-bg: #0064C8;
                    --invoice-theme-text: #ffffff;
                }

                .dark {
                    --invoice-theme-bg: #1E40AF;
                    --invoice-theme-text: #ffffff;
                }

                .invoice-table-head th,
                .invoice-table-foot td {
                    background-color: var(--invoice-theme-bg) !important;
                    color: var(--invoice-theme-text) !important;
                }

                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body {
                        background: white !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .invoice-print-area {
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        background: white !important;
                        color: black !important;
                    }

                    .print-table-wrapper {
                        overflow: visible !important;
                    }

                    .invoice-table {
                        width: 100% !important;
                        table-layout: fixed !important;
                        border-collapse: collapse !important;
                        font-size: 9px !important;
                    }

                    .invoice-table th,
                    .invoice-table td {
                        padding: 4px !important;
                        word-break: break-word !important;
                        white-space: normal !important;
                    }

                    .invoice-table-head th,
                    .invoice-table-foot td {
                        background-color: var(--invoice-theme-bg) !important;
                        color: var(--invoice-theme-text) !important;
                    }

                    @page {
                        size: A4 landscape;
                        margin: 8mm;
                    }
                }
            `}
        </style>
        </div>
    );
};

export default TransactionInvoice;