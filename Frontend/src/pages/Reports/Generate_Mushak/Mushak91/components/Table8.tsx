import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Table8: React.FC = () => {

    return (
        <div className="overflow-x-auto mt-8">
            <table className="table-fixed min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th
                            colSpan={4}
                            className="whitespace-nowrap text-center border-b border-gray-300 px-6 py-4 bg-blue-500 text-white font-semibold">
                            Part-8: Adjustment for old account current balance
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-200">
                        <th className="border border-slate-300 p-2" colSpan={2}>Items</th>
                        <th className="border border-slate-300">Note</th>
                        <th className="border border-slate-300">Amount</th>
                    </tr>

                    <tr>
                        <td className="border border-slate-300" colSpan={2}>Remaining Balance(VAT) from Mushak-18.6[Rule-118(5)]</td>
                        <td className="border border-slate-300">54</td>
                        <td className="border border-slate-300">0.00</td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300" colSpan={2}>Remaining Balance(SD) from Mushak-18.6[Rule-118(5)]</td>
                        <td className="border border-slate-300">55</td>
                        <td className="border border-slate-300">0.00</td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300" colSpan={2}>Decreasing Adjustment For Note 54(up to 10% of Note-34)</td>
                        <td className="border border-slate-300">56</td>
                        <td className="border border-slate-300">0.00</td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300" colSpan={2}>Decreasing Adjustment For Note 55(up to 10% of Note-36)</td>
                        <td className="border border-slate-300">57</td>
                        <td className="border border-slate-300">0.00</td>
                    </tr>

                </tbody>
            </table>
        </div>

    );
};

export default Table8;


