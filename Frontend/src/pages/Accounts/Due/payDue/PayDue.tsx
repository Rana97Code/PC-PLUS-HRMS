import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserContex from '../../../../context/UserContex';

const PayDue = () => {
    const navigate = useNavigate();
    const { source_type, source_id, due_type } = useParams();

    const user = useContext(UserContex);
    const baseUrl = user.base_url;

    const today = new Date().toISOString().slice(0, 10);

    const [selectedData, setSelectedData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        due_date: today,
        paid_amount: '',
        note: '',
        created_by: user.email,
    });

    const totalDue = Number(selectedData?.remaining_due || selectedData?.due_amount || 0);
    const paidAmount = Number(form.paid_amount || 0);
    const remainingDue = totalDue - paidAmount;

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${baseUrl}/due/payment-invoice/${source_type}/${source_id}/${due_type}`,
                { headers: user.headers }
            );

            setSelectedData(res.data);
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Failed to load due invoice');
            navigate('/pages/accounts/due');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (source_type && source_id && due_type) {
            fetchInvoiceDetails();
        }
    }, [source_type, source_id, due_type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedData) {
            alert('Invoice data not found');
            return;
        }

        if (paidAmount <= 0) {
            alert(`${due_type === 'Credit' ? 'Receive' : 'Pay'} amount must be greater than 0`);
            return;
        }

        if (paidAmount > totalDue) {
            alert(`${due_type === 'Credit' ? 'Receive' : 'Pay'} amount cannot be greater than due amount`);
            return;
        }

        try {
            await axios.post(
                `${baseUrl}/due/process-due`,
                {
                    source_type,
                    source_id,
                    transaction_invoice: selectedData.transaction_invoice,
                    party_name: selectedData.party_name,
                    due_type,
                    total_due: totalDue,
                    paid_amount: paidAmount,
                    remaining_due: remainingDue,
                    note: form.note,
                    created_by: form.created_by,
                    due_date: form.due_date,
                },
                { headers: user.headers }
            );

            navigate('/pages/accounts/due');
        } catch (error: any) {
            alert(error?.response?.data?.detail || 'Something went wrong');
        }
    };

    const actionName = due_type === 'Credit' ? 'Receive' : 'Pay';

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold dark:text-white-light">
                    {actionName} Due
                </h2>

                <Link to="/pages/accounts/due" className="btn btn-secondary gap-2">
                    Back to List
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                <div>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={form.due_date}
                                        onChange={(e) => handleChange('due_date', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Due Type</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={due_type === 'Credit' ? 'Receivable' : 'Payable'}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label>Invoice</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedData?.transaction_invoice || ''}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label>Party Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedData?.party_name || ''}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label>Total Due</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={totalDue}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label>{actionName} Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={form.paid_amount}
                                        onChange={(e) => handleChange('paid_amount', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Remaining Due</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={remainingDue > 0 ? remainingDue : 0}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label>Status</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={remainingDue > 0 ? 'Partial' : 'Paid'}
                                        readOnly
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label>Invoice Details</label>
                                    <div className="border rounded p-4 bg-white dark:bg-black">
                                        {selectedData ? (
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                <p><b>Source:</b> {source_type}</p>
                                                <p><b>Invoice:</b> {selectedData.transaction_invoice}</p>
                                                <p><b>Party:</b> {selectedData.party_name}</p>
                                                <p><b>Due Type:</b> {due_type === 'Credit' ? 'Receivable' : 'Payable'}</p>
                                                <p><b>Total Due:</b> {Number(selectedData.total_due || totalDue).toFixed(2)}</p>
                                                <p><b>Paid:</b> {Number(selectedData.paid_amount || 0).toFixed(2)}</p>
                                                <p><b>Remaining:</b> {Number(selectedData.remaining_due || totalDue).toFixed(2)}</p>
                                                <p><b>Status:</b> {selectedData.status}</p>
                                            </div>
                                        ) : (
                                            <p>Invoice not found</p>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-4">
                                    <label>Note</label>
                                    <textarea
                                        className="form-input py-2.5 text-sm w-full min-h-[100px]"
                                        placeholder={`${actionName} note...`}
                                        value={form.note}
                                        onChange={(e) => handleChange('note', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-4">
                                <button
                                    type="submit"
                                    className={`btn gap-2 ${due_type === 'Credit' ? 'btn-success' : 'btn-danger'}`}
                                >
                                    {actionName}
                                </button>

                                <Link to="/pages/accounts/due">
                                    <button type="button" className="btn btn-secondary gap-2">
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayDue;