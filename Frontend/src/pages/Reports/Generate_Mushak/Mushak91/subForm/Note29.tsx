import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Note29: React.FC = () => {

    return (
        <div>
            <div className='border-collapse overflow-hidden overflow-x-auto'>
                <table className="table-auto border-collapse border border-slate-300 mt-8">
                    <thead>
                        <td
                            colSpan={14}
                            className="whitespace-nowrap text-center border-r px-4 py-4 dark:border-neutral-500 bg-blue-300">
                            Table for: (For Note-29)
                        </td>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300">Serial No.</td>
                            <td className="border border-slate-300">Buyer's BIN</td>
                            <td className="border border-slate-300">Buyer's Name</td>
                            <td className="border border-slate-300">Buyer's Address</td>
                            <td className="border border-slate-300">Value</td>
                            <td className="border border-slate-300">Deducted VAT</td>
                            <td className="border border-slate-300">Invoice No/Challan/Bill No</td>
                            <td className="border border-slate-300">Invoice No/Challan/Bill Date</td>
                            <td className="border border-slate-300">VAT Deducation at Source, Certificate Number</td>
                            <td className="border border-slate-300">VAT Deducation at Source, Certificate Date</td>
                            <td className="border border-slate-300">TAX Deposite Account Code</td>
                            <td className="border border-slate-300">TAX Deposite Serial Number of Book Transfer</td>
                            <td className="border border-slate-300">TAX Deposite Date</td>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Note29;


