import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Note39: React.FC = () => {

    return (
        <div>
            <div className='border-collapse overflow-hidden overflow-x-auto'>
                <table className="table-auto border-collapse border border-slate-300 mt-8">
                    <thead>
                        <td
                            colSpan={12}
                            className="whitespace-nowrap text-center border-r px-4 py-4 dark:border-neutral-500 bg-blue-300">
                            Table for: (For Note-39)
                        </td>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300">Serial No.</td>
                            <td className="border border-slate-300">Item Name</td>
                            <td className="border border-slate-300">Sales QTY</td>
                            <td className="border border-slate-300">Rate</td>
                            <td className="border border-slate-300">Sales Amount</td>
                            <td className="border border-slate-300">VAT Rate</td>
                            <td className="border border-slate-300">VAT Amount</td>
                            <td className="border border-slate-300">SD Amount</td>
                            <td className="border border-slate-300">Return QTY</td>
                            <td className="border border-slate-300">Return Amount</td>
                            <td className="border border-slate-300">Return VAT</td>
                            <td className="border border-slate-300">Return SD</td>
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
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Note39;

