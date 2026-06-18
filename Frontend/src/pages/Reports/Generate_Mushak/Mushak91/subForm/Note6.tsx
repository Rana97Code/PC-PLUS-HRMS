import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Note6: React.FC = () => {

    return (
        <div>
            <div className='border-collapse overflow-hidden overflow-x-auto'>
                <table className="table-auto border-collapse border border-slate-300 mt-8">
                    <thead>
                        <td
                            colSpan={10}
                            className="whitespace-nowrap text-center border-r px-6 py-4 dark:border-neutral-500 bg-blue-300">
                            Sub-form: (For Note-6)
                        </td>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300">Serial No.</td>
                            <td className="border border-slate-300">Goods/Service Commercial Description</td>
                            <td className="border border-slate-300">Goods/Service Code</td>
                            <td className="border border-slate-300">Goods/Service Name</td>
                            <td className="border border-slate-300">Unit of Measure (a)</td>
                            <td className="border border-slate-300">Quantity (b)</td>
                            <td className="border border-slate-300">Actual/Sales/Purchase Value (c)</td>
                            <td className="border border-slate-300">SD (d)</td>
                            <td className="border border-slate-300">VAT (e)</td>
                            <td className="border border-slate-300">Notes</td>
                        </tr>

                        <tr>
                            <td className="border border-slate-300">Total</td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Note6;
