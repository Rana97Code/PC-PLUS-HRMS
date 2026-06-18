import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../.././context/UserContex';
import { preventDefault } from '@fullcalendar/core/internal';


const EditCurrency = () => {

    const [currencyName, setCurrencyName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [currencyStatus, setStatus] = useState("");

    const params = useParams();
    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl = user.base_url;

    const getCuurencyDetails = async () => {
        if (user.headers) {
            const headers = user.headers;

            await axios.get(`${baseUrl}/currency/get_currency/${params.id}`, { headers })
                .then((response) => {
                    // setInitialRecords(response.data);
                    const data = response.data;
                    //console.log(data);
                    setCurrencyName(data.currency_name)
                    setSymbol(data.display_name)
                    setStatus(data.currency_status)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);

                });
        }
    }
    useEffect(() => {
        getCuurencyDetails();  //create this function
        //handleSubmit;
    }, [user])  //Use array


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const currency = {
            currency_name: currencyName,
            symbol: symbol,
            currency_status: currencyStatus,
            user_id: '1'
        }

        //console.log(currency);
        if (user) {
            const headers = { Authorization: `Bearer ${user.token}` }
            try {

                await axios.put(`${baseUrl}/currency/update_currency/${params.id}`, currency, { headers })
                    .then(function (response) {
                        if (response) {
                            navigate("/pages/settings/currency");
                        }
                    })

            } catch (err) {
                console.log(err);
            }
        }
    };


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold">Currency</h2>
            </div>
            <div className="panel mt-6">
                <div id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-lg dark:text-white-light">Edit Currency</h3>
                    </div>
                    <div className="mb-5">

                        {/*----------------- Edit Currency form start ---------------*/}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid  gap-4">
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="currencyName" className='col-span-1 text-base'>Currency Name</label>
                                    <input id="currencyName" type="text" placeholder="Enter Currency Name" className="form-input py-2.5 text-base col-span-4" name="currency_name" value={currencyName} onChange={(e) => setCurrencyName(e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid  gap-4">
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="symbol" className='col-span-1 text-base'>Symbol</label>
                                    <input id="symbol" type="text" placeholder="Enter symbol" className="form-input py-2.5 text-base col-span-4" name="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="currrencyStatus" className='col-span-1 text-base'>Status</label>
                                    <select className="form-select text-dark col-span-4 text-base" value={currencyStatus} onChange={(e) => setStatus(e.target.value)} name="currency_status" required>
                                        <option >Select Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center  justify-center gap-6 pt-8">
                                <button type="submit" className="btn btn-success gap-2" >
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Submit
                                </button>
                                <Link to={"/pages/settings/currency/index"} >
                                    <button type="button" className="btn btn-danger gap-2" >
                                        <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EditCurrency;