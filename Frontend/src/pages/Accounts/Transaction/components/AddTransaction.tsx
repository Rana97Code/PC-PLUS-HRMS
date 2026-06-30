import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import IconArrowBackward from '../../../../components/Icon/IconArrowBackward';
import UserContext from '../../../../context/UserContex';

const AddTransaction: React.FC = () => {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    const headers = user.headers;
    const baseUrl = user.base_url;

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const emptyForm = {
        transaction_date: getTodayDate(),
        transaction_type: '',
        transaction_title: '',
        transaction_by: '',
        transaction_to: '',
        amount_in: '',
        amount_out: '',
        cost: '',
        due_amount: '',
        return_amount: '',
        transaction_notes: '',
        created_by: user?.email || 'office@email.com',
    };

    const debitTransactionTypes = [
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Bazzar', label: 'Bazzar' },
        { value: 'Transport', label: 'Transport' },
        { value: 'Food', label: 'Food' },
        { value: 'Stationery', label: 'Stationery' },
        { value: 'Internet Bill', label: 'Internet Bill' },
        { value: 'Mobile Bill', label: 'Mobile Bill' },
        { value: 'Electricity Bill', label: 'Electricity Bill' },
        { value: 'Rent', label: 'Rent' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Other Office Cost', label: 'Other Office Cost' },
    ];

    const creditTransactionTypes = [
        { value: 'Service_Sales', label: 'Service & Sales' },
        { value: 'Office_Investment', label: 'Office Investment' },
    ];

    const [form, setForm] = useState<any>(emptyForm);
    const [transactionList, setTransactionList] = useState<any[]>([]);
    const [transactionMode, setTransactionMode] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const calculateDebitAmount = (updatedForm: any) => {
        if (transactionMode !== 'Debit') {
            return updatedForm;
        }

        const debitAmount = Number(updatedForm.amount_out || 0);
        const costAmount = Number(updatedForm.cost || 0);

        if (costAmount < debitAmount) {
            updatedForm.return_amount = debitAmount - costAmount;
            updatedForm.due_amount = 0;
        } else if (costAmount > debitAmount) {
            updatedForm.due_amount = costAmount - debitAmount;
            updatedForm.return_amount = 0;
        } else {
            updatedForm.due_amount = 0;
            updatedForm.return_amount = 0;
        }

        return updatedForm;
    };

    const handleChange = (field: string, value: any) => {
        let updatedForm = {
            ...form,
            [field]: value,
        };

        if (transactionMode === 'Debit' && (field === 'amount_out' || field === 'cost')) {
            updatedForm = calculateDebitAmount(updatedForm);
        }

        setForm(updatedForm);
    };

    const handleTransactionModeChange = (value: string) => {
        setTransactionMode(value);

        setForm({
            ...form,
            transaction_type: value,
            amount_in: value === 'Credit' ? 0 : '',
            amount_out: value === 'Debit' ? 0 : '',
            cost: '',
            due_amount: '',
            return_amount: '',
        });
    };

    const addOrUpdateTransactionRow = () => {
        if (!transactionMode) {
            alert('Please select Debit/Credit');
            return;
        }

        if (!form.transaction_title) {
            alert('Please select transaction title');
            return;
        }

        const transaction = {
            ...form,
            amount_in: transactionMode === 'Credit' ? Number(form.amount_in || 0) : 0,
            amount_out: transactionMode === 'Debit' ? Number(form.amount_out || 0) : 0,
            cost: Number(form.cost || 0),
            due_amount: Number(form.due_amount || 0),
            return_amount: Number(form.return_amount || 0),
            created_by: user?.email || 'office@email.com',
        };

        if (editIndex !== null) {
            const updatedList = [...transactionList];
            updatedList[editIndex] = transaction;
            setTransactionList(updatedList);
            setEditIndex(null);
        } else {
            setTransactionList([...transactionList, transaction]);
        }

        setForm(emptyForm);
        setTransactionMode('');
    };

    const editTransactionRow = (index: number) => {
        const selected = transactionList[index];

        setForm({
            ...selected,
            amount_in: selected.amount_in || '',
            amount_out: selected.amount_out || '',
            cost: selected.cost || '',
            due_amount: selected.due_amount || '',
            return_amount: selected.return_amount || '',
        });

        setTransactionMode(Number(selected.amount_in) > 0 ? 'Credit' : 'Debit');
        setEditIndex(index);
    };

    const removeTransactionRow = (index: number) => {
        const updated = transactionList.filter((_, i) => i !== index);
        setTransactionList(updated);

        if (editIndex === index) {
            setEditIndex(null);
            setForm(emptyForm);
            setTransactionMode('');
        }
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setForm(emptyForm);
        setTransactionMode('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (transactionList.length === 0) {
            alert('Please add at least one transaction');
            return;
        }

        try {
            await axios.post(`${baseUrl}/transaction/add-multiple-transaction`, transactionList, { headers });
            navigate('/pages/accounts/transaction');
        } catch (error: any) {
            console.error('Transaction submit error:', error);
            alert(error?.response?.data?.detail || 'Transaction failed');
        }
    };

    const transactionTypes = transactionMode === 'Credit' ? creditTransactionTypes : debitTransactionTypes;

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-white text-xl font-bold">Transaction</h2>

                <Link to="/pages/accounts/transaction" className="btn btn-secondary gap-2">
                    <IconArrowBackward className="w-4 h-4" />
                    Back to List
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    <div className="flex items-center justify-between mb-7">
                        <h5 className="font-semibold text-lg dark:text-white-light">
                            {editIndex !== null ? 'Edit Transaction' : 'Add Multiple Transactions'}
                        </h5>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <div>
                                <label>Transaction Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={form.transaction_date}
                                    onChange={(e) => handleChange('transaction_date', e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Debit/Credit</label>
                                <select
                                    className="form-select text-dark"
                                    value={transactionMode || form.transaction_type}
                                    onChange={(e) => handleTransactionModeChange(e.target.value)}
                                >
                                    <option value="">Select Debit/Credit</option>
                                    <option value="Debit">Debit</option>
                                    <option value="Credit">Credit</option>
                                </select>
                            </div>

                            <div>
                                <label>Transaction Title</label>
                                <select
                                    className="form-select text-dark"
                                    value={form.transaction_title}
                                    onChange={(e) => handleChange('transaction_title', e.target.value)}
                                    disabled={!transactionMode}
                                >
                                    <option value="">Select Transaction</option>
                                    {transactionTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Transaction By</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Name Of Provider"
                                    value={form.transaction_by}
                                    onChange={(e) => handleChange('transaction_by', e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Transaction To</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Name Of Receiver"
                                    value={form.transaction_to}
                                    onChange={(e) => handleChange('transaction_to', e.target.value)}
                                />
                            </div>



                            {transactionMode === 'Credit' && (
                                <div>
                                    <label>Amount Credit</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={form.amount_in}
                                        onChange={(e) => handleChange('amount_in', e.target.value)}
                                    />
                                </div>
                            )}

                            {transactionMode === 'Debit' && (
                                <div>
                                    <label>Amount Debit</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={form.amount_out}
                                        onChange={(e) => handleChange('amount_out', e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                {transactionMode === 'Debit' && (
                                    <label>Cost</label>
                                )}
                                {transactionMode === 'Credit' && (
                                    <label>Price</label>
                                )}
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.cost}
                                    onChange={(e) => handleChange('cost', e.target.value)}
                                />
                            </div>


                            <div>
                                <label>Due Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.due_amount}
                                    onChange={(e) => handleChange('due_amount', e.target.value)}
                                />
                            </div>
                                {transactionMode === 'Debit' && (
                            <div>
                                <label>Return Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.return_amount}
                                    onChange={(e) => handleChange('return_amount', e.target.value)}
                                />
                            </div>
                                )}

                            <div className="md:col-span-3">
                                <label className="text-sm">Note</label>
                                <textarea
                                    placeholder="Transaction notes..."
                                    className="form-input py-2.5 text-sm w-full min-h-[100px]"
                                    value={form.transaction_notes}
                                    onChange={(e) => handleChange('transaction_notes', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            {editIndex !== null && (
                                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                                    Cancel Edit
                                </button>
                            )}

                            <button type="button" className="btn btn-primary" onClick={addOrUpdateTransactionRow}>
                                {editIndex !== null ? 'Update Transaction' : 'Add Transaction'}
                            </button>
                        </div>

                        <div className="border overflow-x-auto">
                            <table className="table-hover whitespace-nowrap w-full">
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>By</th>
                                        <th>To</th>
                                        <th>Amount In</th>
                                        <th>Amount Out</th>
                                        <th>Cost</th>
                                        <th>Due</th>
                                        <th>Return</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactionList.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.transaction_date}</td>
                                            <td>{item.transaction_type}</td>
                                            <td>{item.transaction_by}</td>
                                            <td>{item.transaction_to}</td>
                                            <td>{item.amount_in}</td>
                                            <td>{item.amount_out}</td>
                                            <td>{item.cost}</td>
                                            <td>{item.due_amount}</td>
                                            <td>{item.return_amount}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => editTransactionRow(index)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeTransactionRow(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-4">
                            <button type="submit" className="btn btn-success gap-2">
                                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Submit
                            </button>

                            <Link to="/pages/accounts/transaction">
                                <button type="button" className="btn btn-danger gap-2">
                                    <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;