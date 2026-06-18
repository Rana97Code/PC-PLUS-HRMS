import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContext from '../../../../context/UserContex';

const AddPayble91 = () => {

    const user = useContext(UserContext);
    const headers = user.headers;
    const navigate = useNavigate();

    // Function to get today's date in the format "YYYY-MM-DD"
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    interface types {
        id: number;
        type_name: string;
        unit_name: string;
    }


    const [allTypes, setGetAllTypes] = useState<types[]>([]);


    const [typeId, setTypeName] = useState("");
    const [amount_code, setAmount] = useState("");
    const [entryDate, setEntrynDate] = useState(getTodayDate());

    useEffect(() => {
        if (user) {

            // for Authorised Person
            axios.get(`${user.base_url}/alltypes`, { headers })
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        setGetAllTypes(response.data);
                    } else {
                        throw new Error('Response data is not an array');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);

                });
        }

        handleSubmit;
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payble = {
            amount_code: amount_code,
        }
        console.log(payble);

        if (user) {

            try {
                await axios.post(`${user.base_url}/payble/add_payble`, payble, { headers })
                    .then(function (response) {
                        if (response) {
                            navigate("/pages/reports/payble");
                        } else {
                            navigate("/pages/reports/payble/add");
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
                <h2 className="text-xl font-bold">Add Payble 9.1</h2>
            </div>
            <div className="panel mt-6">
                <div id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-lg dark:text-white-light">Add New Payble 9.1</h3>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit} >
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="inputPerson" className='col-span-1 text-base'>Type</label>
                                    {/* <select className="form-select text-dark col-span-4 text-base" required onChange={handleChange}> */}
                                    <select className="form-select text-dark col-span-4 text-base" onChange={(e) => setTypeName(e.target.value)} required>
                                        <option >Select Type</option>
                                        {allTypes.map((option, index) => (
                                            <option key={index} value={option.id}>
                                                {option.type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid  gap-4">
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="amountCode" className='col-span-1 text-base'>Amount</label>
                                    <input id="amountCode" type="text" placeholder="Enter Amount" className="form-input py-2.5 text-base col-span-4"
                                        name="amountCode" onChange={(e) => setAmount(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="entryDate" className='col-span-1 text-base'>Entry Date</label>
                                    <input id="entryDate" type="date" className="form-input py-2.5 text-base col-span-4"
                                        name="entryDate" value={entryDate} onChange={(e) => setEntrynDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex items-center  justify-center gap-6 pt-8">
                                <button type="submit" className="btn btn-success gap-2">
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Submit
                                </button>
                                <Link to="/pages/reports/payble91/index"><button type="button" className="btn btn-danger gap-2" >
                                    <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Cancel
                                </button></Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddPayble91;