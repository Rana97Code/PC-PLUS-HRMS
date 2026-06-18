
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import IconArrowBackward from "../../../../components/Icon/IconArrowBackward"
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
        transaction_by: '',
        transaction_to: '',
        amount_in: 0,
        amount_out: 0,
        cost: 0,
        due_amount: 0,
        return_amount: 0,
        transaction_notes: '',
        created_by: 1,
    };

    const [form, setForm] = useState(emptyForm);
    const [transactionList, setTransactionList] = useState<any[]>([]);

    const handleChange = (field: string, value: any) => {
        setForm({
            ...form,
            [field]: value,
        });
    };

    const addTransactionRow = () => {
        if (!form.transaction_type) {
            alert('Please enter transaction type');
            return;
        }

        setTransactionList([...transactionList, form]);
        setForm(emptyForm);
    };

    const removeTransactionRow = (index: number) => {
        const updated = transactionList.filter((_, i) => i !== index);
        setTransactionList(updated);
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

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-white text-xl font-bold">Transaction</h2>

                <Link
                    to="/pages/accounts/transaction"
                    className="btn btn-secondary gap-2"
                >
                    <IconArrowBackward className="w-4 h-4" />
                    Back to List
                </Link>
            </div>

            <div className="pt-5">
                <div className="panel">
                    <div className="flex items-center justify-between mb-7">
                        <h5 className="font-semibold text-lg dark:text-white-light">Add Multiple Transactions</h5>
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
                                <label>Transaction Type</label>
                                <select
                                    className="form-select text-dark"
                                    value={form.transaction_type}
                                    onChange={(e) => handleChange('transaction_type', e.target.value)}
                                
                                >
                                    <option value="">Select Transaction Type</option>
                                    <option value="Office">Office</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Bazzar">Bazzar</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Food">Food</option>
                                    <option value="Stationery">Stationery</option>
                                    <option value="Internet Bill">Internet Bill</option>
                                    <option value="Mobile Bill">Mobile Bill</option>
                                    <option value="Electricity Bill">Electricity Bill</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Other Office Cost">Other Office Cost</option>
                                </select>
                            </div>

                            <div>
                                <label>Transaction By</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ifat"
                                    value={form.transaction_by}
                                    onChange={(e) => handleChange('transaction_by', e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Transaction To</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Momin"
                                    value={form.transaction_to}
                                    onChange={(e) => handleChange('transaction_to', e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Amount In</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.amount_in}
                                    onChange={(e) => handleChange('amount_in', Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label>Amount Out</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.amount_out}
                                    onChange={(e) => handleChange('amount_out', Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label>Cost</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.cost}
                                    onChange={(e) => handleChange('cost', Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label>Due Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.due_amount}
                                    onChange={(e) => handleChange('due_amount', Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label>Return Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={form.return_amount}
                                    onChange={(e) => handleChange('return_amount', Number(e.target.value))}
                                />
                            </div>
                 

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
                        <div className="flex justify-end">
                            <button type="button" className="btn btn-primary" onClick={addTransactionRow}>
                                Add Transaction
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
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => removeTransactionRow(index)}
                                                >
                                                    Remove
                                                </button>
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