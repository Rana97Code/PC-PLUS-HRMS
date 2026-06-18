import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';


const AddCurrency = () => {

    const [currencyName, setCurrencyName] = useState("");
    const [symbol, setSymbol] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const currency = {
            currencyName: currencyName,
            symbol: symbol,
            status: true,
            createdBy: '0',
            updatedBy: '0'
        }
        try {
            const data = await axios.post("http://localhost:8080/bmitvat/api/v1/currency", currency)
                .then(function (response) {
                    console.log(response);
                    navigate("/pages/settings/currency");
                })
            // if(response.status==200){
            // }else{
            //   console.warn("Insert Unsuccessfull");
            //   navigate("/pages/settings/unit/add");
            // }
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div>
            <div className="flex items-center justify-between flex-wrap pb-6 gap-4">
                <h2 className="text-lg">Add Currency</h2>
            </div>

            {/*----------------- Add Currency form start ---------------*/}
            <div className="mb-5">
                <form className="space-y-5" onClick={handleSubmit}>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="currencyName" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2" >Currency Name</label>
                        <input id="currencyName" type="text" placeholder="Enter Currency Name" className="form-input flex-1" name="currency_name"
                        onChange={(e) => setCurrencyName(e.target.value)}  required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="symbol" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2" >Symbol</label>
                        <input id="symbol" type="text" placeholder="Enter Symbol" className="form-input flex-1" name="symbol_name"
                        onChange={(e) => setSymbol(e.target.value)}  required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="inputStatus" className="font-semibold sm:w-1/4 sm:ltr:mr-10 rtl:ml-2">Status</label>
                        <select className="form-select text-dark" x-model="form3.select" required>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center gap-6 pt-9">
                        <button type="submit" className="btn btn-success gap-2">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Submit
                        </button>
                        <button type="button" className="btn btn-danger gap-2" >
                            <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            {/*----------------- Add Currency form end ---------------*/}
        </div>
    )
}
export default AddCurrency;