import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import IconPlus from '../../../../components/Icon/IconPlus';
import IconFile from '../../../../components/Icon/IconFile';

import axios from 'axios';


const index = () => {

    const navigate = useNavigate();


    interface suggestItem {
        id: number;
        itemName: string;
    }

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [lcDate, setLcDate] = useState(getTodayDate());
    const [all_suggestitm, setSuggestItem] = useState<suggestItem[]>([]);
    const [itemId, setSelectItemId] = useState("");


    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get('http://localhost:8080/bmitvat/api/mushak61/rawmaterial', { headers })
                .then((response) => {
                    setSuggestItem(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });

        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const month = document.getElementById('selectMonth') as HTMLInputElement;
        const itemId = document.getElementById('itemId') as HTMLSelectElement;

        const data = month.value + '&' + itemId.value;
        if (data) {
            navigate(`/pages/report/mushak61/` + data);
        }


    }

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Generate Mushak 6.1</h2>
            </div>

            <div className="pt-5">
                <div className="panel col-span-3 " id="stack_form">
                    <form onSubmit={handleSubmit} >
                        <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <label htmlFor="selectMonth">Date</label>
                                    <input id="selectMonth" type="date" value={lcDate} onChange={(e) => setLcDate(e.target.value)} className="form-input" required />
                                </div>
                                <div className="ml-16 w-36">
                                    <label htmlFor="itemId">Items</label>
                                    <select id="itemId" onChange={(e) => setSelectItemId(e.target.value)} className="form-select text-dark col-span-2 text-sm" required>
                                        <option>Select Item</option>
                                        {all_suggestitm.map((option, index) => (
                                            <option key={index} value={option.id}>
                                                {option.itemName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center justify-center gap-6 pt-6 ml-16">
                                    <button type="submit" className="btn btn-success gap-2" >
                                        <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="datatables">

                    </div>
                </div>
                {/*-------------- User list end -------------*/}


            </div>
        </div>
    );
};

export default index;