import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const Table7: React.FC = () => {

    return (
        <div className="overflow-x-auto mt-8">
            <table className="table-fixed min-w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr>
                        <th
                            colSpan={4}
                            className="whitespace-nowrap text-center border-b border-gray-300 px-6 py-4 bg-blue-500 text-white font-semibold">
                            Part-7: NET TAX CALCULATION
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-gray-200">
                        <th className="border border-slate-300 p-2">Items</th>
                        <th className="border border-slate-300">Note</th>
                        <th className="border border-slate-300">Amount</th>
                        <th className="border border-slate-300"></th>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Net Payble VAT for the TAX Period(section-45)
                            [9c-23b+28-33]</td>
                        <td className="border border-slate-300">34</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Net Payble VAT for the TAX Period After Adjustment
                            With Closing Balance of Form 18.6[34-(52+56)]</td>
                        <td className="border border-slate-300">35</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Net Payble Spplementary Duty for the TAX Period
                            (Before Adjustment With Clossing Balance [(9b+38)-(39+40)])</td>
                        <td className="border border-slate-300">36</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Net Payble Spplementary Duty for the TAX Period
                            After Adjusted With Closing Balance and Balance of Form 18.6[36-(53+57)]</td>
                        <td className="border border-slate-300">37</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Supplementary Duty Against Debit Note</td>
                        <td className="border border-slate-300">38</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_38" target='_blank'>
                                    Table
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Supplementary Duty Against Credit Note</td>
                        <td className="border border-slate-300">39</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_39" target='_blank'>
                                    Table
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Supplementary Duty Paid On Inputs Against Exports</td>
                        <td className="border border-slate-300">40</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                            <button type="submit" className="btn btn-success gap-2 float-left mr-4" >
                                <Link to="/pages/report/mushak91/subform/note_40" target='_blank'>
                                    Table
                                </Link>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Interest on Overdue VAT(Based on note 35)</td>
                        <td className="border border-slate-300">41</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Interest on Overdue SD(Based on note 37)</td>
                        <td className="border border-slate-300">42</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Fine/Penulty for Non -Submission of Return</td>
                        <td className="border border-slate-300">43</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Other Fine/Penulty/Interest</td>
                        <td className="border border-slate-300">44</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Payble Exise Duty</td>
                        <td className="border border-slate-300">45</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Payble Development Surcharge</td>
                        <td className="border border-slate-300">46</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Payble ICT Development Surcharge</td>
                        <td className="border border-slate-300">47</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Payble Health Care Surcharge</td>
                        <td className="border border-slate-300">48</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Payble Environmental Protection Surcharge</td>
                        <td className="border border-slate-300">49</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Net payble VAT for treasury deposit[35+41+43+44]</td>
                        <td className="border border-slate-300">50</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Net payble SD for treasury deposit[37+42]</td>
                        <td className="border border-slate-300">51</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Closing Balance of Last TAX Period(VAT)</td>
                        <td className="border border-slate-300">52</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-slate-300">Closing Balance of Last TAX Period(SD)</td>
                        <td className="border border-slate-300">53</td>
                        <td className="border border-slate-300">0.00</td>
                        <td className="border border-slate-300">
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    );
};

export default Table7;


