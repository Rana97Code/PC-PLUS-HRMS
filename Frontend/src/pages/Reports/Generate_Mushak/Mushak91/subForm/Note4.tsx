import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Note4: React.FC = () => {

    return (
        <div>
            <div className='border-collapse overflow-hidden overflow-x-auto'>
                <table className="table-auto border-collapse border border-slate-300 mt-8">
                    <thead>
                        <td
                            colSpan={8}
                            className="whitespace-nowrap text-center border-r px-6 py-4 dark:border-neutral-500 bg-blue-300">
                            Sub-form: (For Note-4)
                        </td>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300">Serial No.</td>
                            <td className="border border-slate-300">Goods/Service Commercial Description</td>
                            <td className="border border-slate-300">Goods/Service Code</td>
                            <td className="border border-slate-300">Goods/Service Name</td>
                            <td className="border border-slate-300">Value (a)</td>
                            <td className="border border-slate-300">SD (b)</td>
                            <td className="border border-slate-300">VAT (c)</td>
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
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Note4;


