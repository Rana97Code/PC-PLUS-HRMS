import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Table6: React.FC = () => {

    return (
        <div className="overflow-x-auto mt-8">
            <table className="table-auto min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th
                            colSpan={4}
                            className="whitespace-nowrap text-center border-b border-gray-300 px-6 py-4 bg-blue-500 text-white font-semibold">
                            Part-6: DECREASING ADJUSTMENTS(VAT)
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
                        <td className="border border-slate-300">Due To VAT Deducted at source from the supplies <br />delivered</td>
                        <td className="border border-slate-300">29</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_29" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Advance Tax Paid At Import Stage</td>
                        <td className="border border-slate-300">30</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_30" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Issuance of credit note</td>
                        <td className="border border-slate-300">31</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-2" >
                                <Link to="/pages/report/mushak91/subform/note_31" target='_blank'>
                                    Table
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Any Other Adjustment(please specify below)Due <br />
                            to Export to Export Reabate Not Taken</td>
                        <td className="border border-slate-300">32</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_32" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Total Decreasing Adjustment</td>
                        <td className="border border-slate-300">33</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300"></td>
                    </tr>

                </tbody>
            </table>
        </div>

    );
};

export default Table6;


