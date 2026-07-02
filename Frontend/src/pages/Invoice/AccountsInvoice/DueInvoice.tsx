import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';

const DueInvoice = () => {
    const { source_type, source_id, due_type } = useParams();
    const auth = useSelector((state: IRootState) => state.auth);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

    const printRef = useRef<HTMLDivElement>(null);

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchInvoice = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${baseUrl}/due/invoice/${source_type}/${source_id}/${due_type}`,
                { headers }
            );

            setInvoice(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [source_type, source_id, due_type]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="panel text-center py-10">Loading invoice...</div>;
    }

    if (!invoice) {
        return <div className="panel text-center py-10">Invoice not found</div>;
    }

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black no-print">
                <h2 className="text-xl font-bold">Due Invoice</h2>

                <div className="flex gap-3">
                    <Link to="/pages/accounts/due" className="btn btn-secondary">
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
                                Due Invoice
                            </h2>
                            <p className="text-sm mt-2">
                                <strong>Invoice No:</strong> {invoice.invoice_no}
                            </p>
                            <p className="text-sm">
                                <strong>Date:</strong> {String(invoice.invoice_date || '').slice(0, 10)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="border rounded p-4">
                            <h3 className="font-bold text-lg mb-3 border-b pb-2" style={{ color: '#0064C8' }}>
                                Due Info
                            </h3>
                            <p className="text-sm mb-2">
                                <strong>Invoice No:</strong> {invoice.invoice_no}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Party Name:</strong> {invoice.party_name}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Due Type:</strong> {invoice.due_label}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Source:</strong> {invoice.source_type}
                            </p>
                        </div>

                        <div className="border rounded p-4">
                            <h3 className="font-bold text-lg mb-3 border-b pb-2" style={{ color: '#0064C8' }}>
                                Summary
                            </h3>
                            <p className="text-sm mb-2">
                                <strong>Total Due:</strong> {Number(invoice.total_due || 0).toFixed(2)}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Total Paid:</strong> {Number(invoice.paid_amount || 0).toFixed(2)}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Remaining Due:</strong> {Number(invoice.remaining_due || 0).toFixed(2)}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Status:</strong> {invoice.status}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto print-table-wrapper">
                        <table className="invoice-table w-full border border-gray-300 text-sm">
                            <thead>
                                <tr className="invoice-table-head">
                                    <th className="border p-2">SL</th>
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Invoice</th>
                                    <th className="border p-2">Type</th>
                                    <th className="border p-2">Total Due</th>
                                    <th className="border p-2">Paid</th>
                                    <th className="border p-2">Remaining</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Note</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoice.details?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="border p-2 text-center">{index + 1}</td>
                                        <td className="border p-2">{String(item.date || '').slice(0, 10)}</td>
                                        <td className="border p-2">{item.invoice}</td>
                                        <td className="border p-2">{item.type}</td>
                                        <td className="border p-2 text-right">{Number(item.total_due || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-right">{Number(item.paid_amount || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-right">{Number(item.remaining_due || 0).toFixed(2)}</td>
                                        <td className="border p-2">{item.status}</td>
                                        <td className="border p-2 whitespace-normal">{item.note}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr className="invoice-table-foot">
                                    <td className="border p-2 text-right" colSpan={4}>
                                        Total
                                    </td>
                                    <td className="border p-2 text-right">{Number(invoice.total_due || 0).toFixed(2)}</td>
                                    <td className="border p-2 text-right">{Number(invoice.paid_amount || 0).toFixed(2)}</td>
                                    <td className="border p-2 text-right">{Number(invoice.remaining_due || 0).toFixed(2)}</td>
                                    <td className="border p-2"></td>
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

export default DueInvoice;