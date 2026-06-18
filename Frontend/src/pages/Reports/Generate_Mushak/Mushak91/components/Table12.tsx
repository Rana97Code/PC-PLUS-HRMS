import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Table12: React.FC = () => {

    return (
        <div className="overflow-x-auto mt-8">
            <table className="table-fixed min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th
                            colSpan={2}
                            className="whitespace-nowrap text-center border-r px-6 py-4 bg-blue-500 text-white border-gray-300">
                            Part-12: DECLARATION
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="border border-slate-300 text-left p-2" colSpan={2} >I hereby declare that all information provided
                            in this Return Form are complete, true & accurate. In case of any untrue/incomplete statement, I may be
                            subjected to panel action under The Value Added Tax and Supplementary Duty Act, 2012 or any other
                            applicable Act preventing at present.</th>
                    </tr>
                    <tr>
                        <td className="border border-slate-300">Name</td>
                        <td className="border border-slate-300"></td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300">Designation</td>
                        <td className="border border-slate-300"></td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300">Mobile No</td>
                        <td className="border border-slate-300"></td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300">Email</td>
                        <td className="border border-slate-300"></td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300">Signature [Not required for electronic submission]</td>
                        <td className="border border-slate-300"></td>
                    </tr>
                </tbody>
            </table>
        </div>

    );
};

export default Table12;


