import React from 'react';
import { Link } from 'react-router-dom';

const Table4: React.FC = () => {
    return (
        <div className="mt-8 overflow-x-auto">
            <table className="table-auto min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th colSpan={6} className="whitespace-nowrap text-center border-r px-6 py-4 bg-blue-500 text-white border-gray-300">
                            Part-4: Purchase - INPUT TAX
                        </th>
                    </tr>

                </thead>
                <tbody>
                    <tr className="bg-gray-200">
                        <th className="border-b border-gray-300 p-2">Nature of Supply</th>
                        <th className=""></th>
                        <th className="border border-gray-300">Note</th>
                        <th className="border border-gray-300">Value (a)</th>
                        <th className="border border-gray-300">VAT (c)</th>
                        <th className="border border-gray-300"></th>
                    </tr>
                    <tr>
                        <td className="border border-slate-300" rowSpan={2}>Zero Rated Goods/Service</td>
                        <td className="border border-slate-300 bg-gray-200">Local Purchase</td>
                        <td className="border border-slate-300">10</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_10" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300 bg-gray-200">Import</td>
                        <td className="border border-slate-300">11</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_11" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300" rowSpan={2}>Exempted Goods/Service</td>
                        <td className="border border-slate-300 bg-gray-200">Local Purchase</td>
                        <td className="border border-slate-300">12</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_12" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300 bg-gray-200">Import</td>
                        <td className="border border-slate-300">13</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_13" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300" rowSpan={2}>Standard Rated Goods/Service</td>
                        <td className="border border-slate-300 bg-gray-200">Local Purchase</td>
                        <td className="border border-slate-300">14</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_14" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300 bg-gray-200">Import</td>
                        <td className="border border-slate-300">15</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_15" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300" rowSpan={2}>Goods/Service Other Than Standard Rate</td>
                        <td className="border border-slate-300 bg-gray-200">Local Purchase</td>
                        <td className="border border-slate-300">16</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_16" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300 bg-gray-200">Import</td>
                        <td className="border border-slate-300">17</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_17" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300">Goods/Service Based on Specific VAT</td>
                        <td className="border border-slate-300 bg-gray-200">Local Purchase</td>
                        <td className="border border-slate-300">18</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_18" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300" rowSpan={2}>Goods/Service Not Admissible For Credit <br /> (Local Purchase)</td>
                        <td className="border border-slate-300 bg-gray-200">From Turnover Tax Units</td>
                        <td className="border border-slate-300">19</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_19" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300 bg-gray-200">From Unregistered Entities</td>
                        <td className="border border-slate-300">20</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_20" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300" rowSpan={2}>Goods/Service Not Admissible For Credit<br /> (Taxpayers Who Sell only Exempted/Specific<br /> VAT and Goods/Service Other Than Standard<br /> Rate/Credits not Taken Within Stipulated time)</td>
                        <td className="border border-slate-300 bg-gray-200">Local Purchase</td>
                        <td className="border border-slate-300">21</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_21" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300 bg-gray-200">Import</td>
                        <td className="border border-slate-300">22</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300 px-4 py-2">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4">
                                <Link to="/pages/report/mushak91/subform/note_22" target='_blank'>
                                    Sub Form
                                </Link>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-slate-300" rowSpan={2}>Total Input Tax Credit</td>
                        <td className="border-b border-slate-300"></td>
                        <td className="border border-slate-300">23</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300">0</td>
                        <td className="border border-slate-300"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table4;
