import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Table5: React.FC = () => {

    return (
        <div className="overflow-x-auto mt-8">
            <table className="table-auto min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th
                            colSpan={4}
                            className="whitespace-nowrap text-center border-b border-gray-300 px-6 py-4 bg-blue-500 text-white font-semibold">
                            Part-5: INCREASING ADJUSTMENT (VAT)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-200">
                        <th className="border border-slate-300 p-2">Adjustment Details</th>
                        <th className="border border-slate-300">Note</th>
                        <th className="border border-slate-300">Vat Amount</th>
                        <th className="border border-slate-300"></th>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Due to VAT Deducted at Source by the Supply Receiver</td>
                        <td className="border border-slate-300">24</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_24" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Payment Not Made Through Banking Chanel</td>
                        <td className="border border-slate-300">25</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300"></td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Issues of Debit Note</td>
                        <td className="border border-slate-300">26</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_26" target='_blank'>
                                    Table
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Any Other Adjustment(please specify below)</td>
                        <td className="border border-slate-300">27</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_27" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Total Increasing Adjustment</td>
                        <td className="border border-slate-300">28</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300"></td>
                    </tr>

                </tbody>
            </table>
        </div>

    );
};

export default Table5;


