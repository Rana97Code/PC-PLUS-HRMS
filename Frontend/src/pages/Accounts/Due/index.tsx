import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';

const Index = () => {
    const auth = useSelector((state: IRootState) => state.auth);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

    const [dues, setDues] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [dueType, setDueType] = useState<'Credit' | 'Debit' | 'Completed'>('Credit');
    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 20;

    const fetchDues = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${baseUrl}/due/available-invoices/${dueType}?page=${page}&limit=${limit}&search=${search}`,
                { headers }
            );

            setDues(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.log(error);
            setDues([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDues();
    }, [dueType, page]);

    const handleSearch = () => {
        setPage(1);
        fetchDues();
    };

    const changeTab = (type: 'Credit' | 'Debit' | 'Completed') => {
        setDueType(type);
        setPage(1);
        setSearch('');
    };

    return (
        <div>
            <div className="panel">
                <h2 className="text-xl font-bold dark:text-white-light">Due Management</h2>
            </div>

            <div className="pt-5">
                <div className="panel">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => changeTab('Credit')}
                                className={`btn ${dueType === 'Credit' ? 'btn-success' : 'btn-outline-success'}`}
                            >
                                Receivable
                            </button>

                            <button
                                type="button"
                                onClick={() => changeTab('Debit')}
                                className={`btn ${dueType === 'Debit' ? 'btn-danger' : 'btn-outline-danger'}`}
                            >
                                Payable
                            </button>

                            <button
                                type="button"
                                onClick={() => changeTab('Completed')}
                                className={`btn ${dueType === 'Completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                            >
                                Paid List
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="form-input w-64"
                                placeholder="Search invoice or party..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSearch();
                                }}
                            />

                            <button type="button" onClick={handleSearch} className="btn btn-primary">
                                Search
                            </button>
                        </div>
                    </div>

                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">
                        {dueType === 'Credit'
                            ? 'Receivable Due List'
                            : dueType === 'Debit'
                            ? 'Payable Due List'
                            : 'Paid Due List'}
                    </h5>

                    <div className="border overflow-x-auto">
                        <table className="table-hover whitespace-nowrap w-full">
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Invoice</th>
                                    <th>Party Name</th>
                                    <th>Source</th>
                                    <th>Due Type</th>
                                    <th>Total Due</th>
                                    <th>Paid</th>
                                    <th>Remaining</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-5">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : dues.length > 0 ? (
                                    dues.map((item, index) => {
                                        const isPaid = Number(item.remaining_due) <= 0 || item.status === 'Paid';

                                        return (
                                            <tr key={`${item.source_type}-${item.source_id}`}>
                                                <td>{(page - 1) * limit + index + 1}</td>
                                                <td>{item.transaction_invoice}</td>
                                                <td>{item.party_name}</td>

                                                <td>
                                                    <span className="badge bg-info">
                                                        {item.source_type === 'transaction' ? 'Transaction' : 'Due'}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className={`badge ${item.due_type === 'Credit' ? 'bg-success' : 'bg-danger'}`}>
                                                        {item.due_type === 'Credit' ? 'Receivable' : 'Payable'}
                                                    </span>
                                                </td>

                                                <td>{Number(item.total_due || 0).toFixed(2)}</td>
                                                <td>{Number(item.paid_amount || 0).toFixed(2)}</td>
                                                <td>{Number(item.remaining_due || 0).toFixed(2)}</td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            isPaid
                                                                ? 'bg-success'
                                                                : item.status === 'Partial'
                                                                ? 'bg-warning'
                                                                : 'bg-danger'
                                                        }`}
                                                    >
                                                        {isPaid ? 'Paid' : item.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex gap-2 justify-center">
                                                        {!isPaid && (
                                                            <Link
                                                                to={`/pages/accounts/due/payment/${item.source_type}/${item.source_id}/${item.due_type}`}
                                                                className={`btn btn-sm ${
                                                                    item.due_type === 'Credit' ? 'btn-success' : 'btn-danger'
                                                                }`}
                                                            >
                                                                {item.due_type === 'Credit' ? 'Receive' : 'Pay'}
                                                            </Link>
                                                        )}

                                                        {isPaid && (
                                                            <button className="btn btn-success btn-sm" disabled>
                                                                Paid
                                                            </button>
                                                        )}

                                                        <Link
                                                            to={`/pages/accounts/due/invoice/${item.source_type}/${item.source_id}/${dueType === 'Completed' ? 'Completed' : item.due_type}`}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Invoice
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-center py-5">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end items-center gap-2 mt-5">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="btn btn-outline-primary btn-sm disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="px-3">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="btn btn-outline-primary btn-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;