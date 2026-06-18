import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';

const Table3: React.FC = () => {
    return (
        <div className="mt-8">
            <table className="table-auto min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th
                            colSpan={7}
                            className="whitespace-nowrap text-center border-r px-6 py-4 bg-blue-500 text-white border-gray-300">
                            Part-3: SUPPLY OUTPUT TAX
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-200">
                        <th className="border-b border-gray-300 p-2">Nature of Supply</th>
                        <th className=""></th>
                        <th className="border border-gray-300">Note</th>
                        <th className="border border-gray-300">Value (a)</th>
                        <th className="border border-gray-300">SD (b)</th>
                        <th className="border border-gray-300">VAT (c)</th>
                        <th className="border border-gray-300"></th>
                    </tr>

                    <tr>
                        <td className="border border-gray-300 p-2 font-medium" rowSpan={2}>Zero Rated Goods/Service</td>
                        <td className="border border-gray-300 p-2 bg-gray-200">Direct Export</td>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_1" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr className='bg-gray-50'>
                        <td className="border border-gray-300 p-2 bg-gray-200">Deemed Export</td>
                        <td className="border border-gray-300 p-2">2</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_2" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border-b border-gray-300 p-2 font-medium">Exempted Goods/Service</td>
                        <td className="border-b border-gray-300"></td>
                        <td className="border border-gray-300 p-2">3</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_3" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="border-b border-gray-300 p-2 font-medium">Standard Rated Goods/Service</td>
                        <td className="border-b border-gray-300"></td>
                        <td className="border border-gray-300 p-2">4</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_4" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border-b border-gray-300 p-2 font-medium">Goods Based on MRP</td>
                        <td className="border-b border-gray-300"></td>
                        <td className="border border-gray-300 p-2">5</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_5" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="border-b border-gray-300 p-2 font-medium">Goods/Service Based on Specific VAT</td>
                        <td className="border-b border-gray-300"></td>
                        <td className="border border-gray-300 p-2">6</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_6" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border-b border-gray-300 p-2 font-medium">Goods/Service Other Than Standard Rate</td>
                        <td className="border-b border-gray-300"></td>
                        <td className="border border-gray-300 p-2">7</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_7" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="border-b border-gray-300 p-2 font-medium">Retail/Wholesale/Trade Based Supply</td>
                        <td className="border-b border-gray-300"></td>
                        <td className="border border-gray-300 p-2">8</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_8" target="_blank">
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border-b border-gray-300 p-2 font-medium">Total Sales Value & Total Payable Taxes</td>
                        <td className="border-b border-gray-300"></td>
                        <td className="border border-gray-300 p-2">9</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2">0</td>
                        <td className="border border-gray-300 p-2"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table3;
