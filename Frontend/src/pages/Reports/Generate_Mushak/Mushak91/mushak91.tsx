import React from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '/assets/images/Govt/govt.png';
import IconFile from '../../../../components/Icon/IconFile';

// import * as $ from 'jquery';
import { number } from 'yup';

import Table1 from './components/Table1';
import Table2 from './components/Table2';
import Table3 from './components/Table3';
import Table4 from './components/Table4';
import Table5 from './components/Table5';
import Table6 from './components/Table6';
import Table7 from './components/Table7';
import Table8 from './components/Table8';
import Table9 from './components/Table9';
import Table10 from './components/Table10';
import Table11 from './components/Table11';
import Table12 from './components/Table12';


const mushak91: React.FC = () => {
    const navigate = useNavigate();


    // interface suggestItem {
    //     id: number;
    //     itemName: string;
    // }

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [lcDate, setLcDate] = useState(getTodayDate());

    // const [all_suggestitm, setSuggestItem] = useState<suggestItem[]>([]);
    // const [itemId, setSelectItemId] = useState("");


    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get('http://localhost:8080/bmitvat/api/mushak91/rawmaterial', { headers })
                .then((response) => {
                    setLcDate(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });

        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const month = document.getElementById('selectMonth') as HTMLInputElement;
        // const itemId = document.getElementById('itemId') as HTMLSelectElement;

        // const data = month.value + '&' + itemId.value;
        const data = month.value;
        console.log(data);
        if (data) {
            navigate(`/pages/report/mushak91/` + data);
        }

    }

    return (
        <div>
            <div className="items-center justify-between flex-wrap text-black grid grid-cols-3">
                <div>
                    <img className="h-20 w-30 pl-6 mt-2" src={logo} />
                </div>
                <div className="font-bold text-center grid grid-rows-3 gap-2 pt-2">
                    <h3 className='text-sm'>GOVERNMENT OF THE PEOPLE,S REPUBLIC BANGLADESH</h3>
                    <h3>NATIONAL BOARD OF REVENUE</h3>
                    <h3>DHAKA</h3>
                </div>
                <div>
                    <button type="submit" className="btn btn-success gap-2 float-right mr-4" >
                        Mushak-9.1
                    </button>
                </div>
            </div>

            <div className="m-2">
                <div className="font-bold text-center grid gap-2 text-sm mb-5">
                    <h3>VALUE ADDED TAX RETURN FORM</h3>
                    <h3>[See rule 47(1)]</h3>
                    <h3>[Please read the instructions before filling up this form]</h3>
                </div>
                <div className="mb-2">
                    <div className="border-collapse overflow-hidden overflow-x-auto">

                        {/*-------------- Tables -------------*/}
                        <Table1 />
                        <Table2 />
                        <Table3 />
                        <Table4 />
                        <Table5 />
                        <Table6 />
                        <Table7 />
                        <Table8 />
                        <Table9 />
                        <Table10 />
                        <Table11 />
                        <Table12 />
                    </div>
                </div>
                <div>
                </div>
            </div>

            <div className="flex mb-3">
                <div className='pt-2 ml-2'>
                    <input id="selectMonth" type="date" value={lcDate} onChange={(e) => setLcDate(e.target.value)} className="form-input" required />
                </div>
                <div className="flex items-center justify-center gap-4 pt-2 ml-8">
                    <button type="submit" className="btn btn-success gap-2" >
                        <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        Generate
                    </button>
                </div>
            </div>
        </div>

    );
};

export default mushak91;


