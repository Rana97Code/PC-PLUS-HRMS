import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';

const Table1: React.FC = () => {
    return (
        <div className="">
            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th
                            colSpan={2}
                            className="whitespace-nowrap text-center border-r px-6 py-4 bg-blue-500 text-white border-gray-300">
                            Part-1: TAXPAYER'S INFORMATION
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Name</td>
                        <td className="border border-gray-300 px-4 py-2">John Doe</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Name of taxpayer</td>
                        <td className="border border-gray-300 px-4 py-2">123 Main St</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Address of taxpayer</td>
                        <td className="border border-gray-300 px-4 py-2">123 Main St</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Type of Ownership</td>
                        <td className="border border-gray-300 px-4 py-2">123 Main St</td>
                    </tr>
                    <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Economic Activity</td>
                        <td className="border border-gray-300 px-4 py-2">123 Main St</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table1;
