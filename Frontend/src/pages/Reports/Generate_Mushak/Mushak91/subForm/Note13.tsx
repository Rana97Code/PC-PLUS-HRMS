import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Note13: React.FC = () => {

    return (
        <div>
            <div className='border-collapse overflow-hidden overflow-x-auto'>
                <table className="table-auto border-collapse border border-slate-300 mt-8">
                    <thead>
                        <td
                            colSpan={16}
                            className="whitespace-nowrap text-center border-r px-6 py-4 dark:border-neutral-500 bg-blue-300">
                            Sub-form: (For Note-13)
                        </td>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300">Serial No.</td>
                            <td className="border border-slate-300">Data Source</td>
                            <td className="border border-slate-300">BOE No</td>
                            <td className="border border-slate-300">BOE Data</td>
                            <td className="border border-slate-300">BOE Office Code (Custom house/Station code)</td>
                            <td className="border border-slate-300">BOE/Item No</td>
                            <td className="border border-slate-300">CPC Code</td>
                            <td className="border border-slate-300">Goods/Service Commercial Description</td>
                            <td className="border border-slate-300">Good/Service Code</td>
                            <td className="border border-slate-300">Good/Service Name</td>
                            <td className="border border-slate-300">Assessable Value</td>
                            <td className="border border-slate-300">Base Value of VAT</td>
                            <td className="border border-slate-300">SD</td>
                            <td className="border border-slate-300">VAT</td>
                            <td className="border border-slate-300">AT</td>
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

export default Note13;


