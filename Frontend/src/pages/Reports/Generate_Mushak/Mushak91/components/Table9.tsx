import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Table9: React.FC = () => {

    return (
        <div className="overflow-x-auto mt-8">
            <table className="table-auto min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th
                            colSpan={5}
                            className="whitespace-nowrap text-center border-b border-gray-300 px-6 py-4 bg-blue-500 text-white font-semibold">
                            Part-9: ACCOUNTS CODE WISE PAYMENT SCHEDULE (TREASURY DEPOSIT)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-200">
                        <th className="border border-slate-300 p-2">Adjustment Details</th>
                        <th className="border border-slate-300">Note</th>
                        <th className="border border-slate-300">Amount Code</th>
                        <th className="border border-slate-300">Amount</th>
                        <th className="border border-slate-300"></th>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">VAT Deposit for the Current Tax Period</td>
                        <td className="border border-slate-300">58</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_58" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">SD Deposit for the Current Tax Period</td>
                        <td className="border border-slate-300">59</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_59" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Exise Duty</td>
                        <td className="border border-slate-300">60</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-2" >
                                <Link to="/pages/report/mushak91/subform/note_60" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Developement Surcharge</td>
                        <td className="border border-slate-300">61</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_61" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">ICT Developement Surcharge</td>
                        <td className="border border-slate-300">62</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_62" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Health Care Surcharge</td>
                        <td className="border border-slate-300">63</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_63" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Environmental Protection Surcharge</td>
                        <td className="border border-slate-300">64</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_64" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    );
};

export default Table9;


