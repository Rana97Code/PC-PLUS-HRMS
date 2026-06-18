import React, { useState } from 'react';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Table11: React.FC = () => {

    const [isRefundRequested, setIsRefundRequested] = useState(false);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRefundRequested(event.target.value === "yes");
    };

    return (
        <div className="overflow-x-auto mt-8">
            <table className="table-auto min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th
                            colSpan={5}
                            className="whitespace-nowrap text-center border-b border-gray-300 px-6 py-4 bg-blue-500 text-white font-semibold">
                            Part-11: REFUND
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="border border-slate-300 p-2" rowSpan={3}>I am Interested to get refund of my Closing Balance</th>
                        <th className="border border-slate-300">Items</th>
                        <th className="border border-slate-300">Note</th>
                        <td className="flex border border-slate-300">
                            <div className="flex items-center mr-5">
                                <input
                                    id="radio-yes"
                                    type="radio"
                                    value="yes"
                                    name="refund-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    onChange={handleRadioChange}
                                />
                                <label htmlFor="radio-yes" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    id="radio-no"
                                    type="radio"
                                    value="no"
                                    name="refund-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    onChange={handleRadioChange}
                                />
                                <label htmlFor="radio-no" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300 bg-gray-200">Request Amount For Refund(VAT)</td>
                        <td className="border border-slate-300">67</td>
                        <td className="border border-slate-300">
                            <input
                                type="number"
                                id="vat-number-input"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="0"
                                required
                                disabled={!isRefundRequested}
                            />
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300 bg-gray-200">Request Amount For Refund(SD)</td>
                        <td className="border border-slate-300">68</td>
                        <td className="border border-slate-300">
                            <input
                                type="number"
                                id="sd-number-input"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="0"
                                required
                                disabled={!isRefundRequested}
                            />
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
};

export default Table11;
