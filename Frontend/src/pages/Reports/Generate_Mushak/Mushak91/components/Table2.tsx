import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';

const Table2: React.FC = () => {
    return (
        <div className="mt-8">
            <table className="table-fixed min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th
                            colSpan={2}
                            className="whitespace-nowrap text-center border-r px-6 py-4 bg-blue-500 text-white border-gray-300">
                            PART-2: RETURN SUBMISSION DATA
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">(1) Name</td>
                        <td className="border border-gray-300 px-4 py-2">John Doe</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                            (2) Type Of Return
                            <br />
                            <span className="text-sm font-normal">[Please select your desired option]</span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <table className="table-fixed w-full">
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-200 px-4 py-2 flex items-center">
                                            A) Main/Original Return (Section-64)
                                            <input type="checkbox" className="form-checkbox h-4 w-4 ml-2 text-blue-600 border border-gray-400" />
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="border border-gray-200 px-4 py-2 flex items-center">
                                            B) Main/Original Return (Section-64)
                                            <input type="checkbox" className="form-checkbox h-4 w-4 ml-2 text-blue-600 border border-gray-400" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-4 py-2 flex items-center">
                                            C) Main/Original Return (Section-64)
                                            <input type="checkbox" className="form-checkbox h-4 w-4 ml-2 text-blue-600 border border-gray-400" />
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="border border-gray-200 px-4 py-2 flex items-center">
                                            D) Main/Original Return (Section-64)
                                            <input type="checkbox" className="form-checkbox h-4 w-4 ml-2 text-blue-600 border border-gray-400" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-4 py-2 flex items-center">
                                            E) Main/Original Return (Section-64)
                                            <input type="checkbox" className="form-checkbox h-4 w-4 ml-2 text-blue-600 border border-gray-400" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                            (3) Any Activities in this Tax Period?
                            <br />
                            <span className="text-sm font-normal">[If selected 'No' please fill only the relevant Part]</span>
                        </td>
                        <td className="flex">
                            <div className="flex items-center mr-5">
                                <input id="activity-yes" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                <label htmlFor="activity-yes" className="ml-2 text-sm font-medium text-gray-900">Yes</label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input id="activity-no" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                <label htmlFor="activity-no" className="ml-2 text-sm font-medium text-gray-900">No</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">(4) Date of Submission</td>
                        <td className="border border-gray-300 px-4 py-2">06-08-2024</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table2;
