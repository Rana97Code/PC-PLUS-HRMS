import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContext from '../../../../context/UserContex';

const AddTreasuryChallan = () => {

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
    // interface Hscode {
    //     id: number;
    //     hs_code: string;
    //     description: string;
    //     description_bn: string;
    //     calculate_year: string;
    // }

    const [allTypes, setGetAllTypes] = useState<types[]>([]);
    // const [allHscode, setGetAllHscode] = useState<Hscode[]>([]);
    // const [item_name, setName] = useState("");

    const [typeId, setTypeName] = useState("");
    const [challan_no, setChallanNo] = useState("");
    const [account_code, setAccountCode] = useState("");
    const [bank_name, setBankName] = useState("");
    const [branch_name, setBranchName] = useState("");
    const [depositeId, setDeposite] = useState("");
    const [amount_code, setAmount] = useState("");
    const [entryDate, setEntrynDate] = useState(getTodayDate());
    const [executionDate, setExecutionDate] = useState(getTodayDate());

    // const [hsCodeId, setHscodeId] = useState("");
    // const [unit_name, setUnit] = useState("");
    // const [status, setStatus] = useState("");

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
            // axios.get(`${user.base_url}/hs_code/all_hs_code`, { headers })
            //     .then((response) => {
            //         if (Array.isArray(response.data)) {
            //             setGetAllHscode(response.data);
            //         } else {
            //             throw new Error('Response data is not an array');
            //         }
            //     })
            //     .catch((error) => {
            //         console.error('Error fetching data:', error);

            //     });
        }

        handleSubmit;
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const myArray = hsCodeId.split("/");
        // const myArray1 = hsCodeId.split("#");

        // const startIndex = hsCodeId.indexOf('/');
        // const endIndex = hsCodeId.indexOf('#');
        // //before '/'
        // const hs_code_id = myArray[0];
        // //Middle part
        // const year = hsCodeId.substring(startIndex + 1, endIndex);
        // //after '/'
        // const hs_code = myArray1.slice(1).join("#");


        const treasuryChallan = {
            challan_no: challan_no,
            account_code: account_code,
            bank_name: bank_name,
            branch_name: branch_name,
            deposite_id: depositeId,
            amount_code: amount_code,

            // item_name: item_name,
            // hs_code: hs_code,
            // hs_code_id: hs_code_id,
            // type_id: typeId,
            // stock_status: '0',
            // status: status,
            // calculate_year: year,
            // created_by: '0',
            // updated_by: null
        }
        console.log(treasuryChallan);

        if (user) {

            try {
                await axios.post(`${user.base_url}/treasuryChallan/add_treasuryChallan`, treasuryChallan, { headers })
                    .then(function (response) {
                        if (response) {
                            navigate("/pages/reports/treasuryChallan");
                        } else {
                            navigate("/pages/reports/treasuryChallan/add");
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
                <h2 className="text-xl font-bold">Add Treasury Challan</h2>
            </div>
            <div className="panel mt-6">
                <div id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-lg dark:text-white-light">Add New Treasury Challan</h3>
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
                                    <label htmlFor="challanNo" className='col-span-1 text-base'>Challan No</label>
                                    <input id="challanNo" type="text" placeholder="Enter Challan No" className="form-input py-2.5 text-base col-span-4"
                                        name="description_code" onChange={(e) => setChallanNo(e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid  gap-4">
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="accountCode" className='col-span-1 text-base'>Account Code</label>
                                    <input id="accountCode" type="text" placeholder="Enter Account Code" className="form-input py-2.5 text-base col-span-4"
                                        name="description_code" onChange={(e) => setAccountCode(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="bankName" className='col-span-1 text-base'>Bank Name</label>
                                    <input id="bankName" type="text" placeholder="Enter Bank Name" className="form-input py-2.5 text-base col-span-4"
                                        name="bankName" onChange={(e) => setBankName(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="branchName" className='col-span-1 text-base'>Branch Name</label>
                                    <input id="branchName" type="text" placeholder="Enter Branch Name" className="form-input py-2.5 text-base col-span-4"
                                        name="branch" onChange={(e) => setBranchName(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="depositeType" className='col-span-1 text-base'>Deposite Type</label>
                                    <select className="form-select text-dark col-span-4 text-base" onChange={(e) => setDeposite(e.target.value)} required>
                                        <option >Select Deposite Type</option>
                                        <option value="1">General</option>
                                        <option value="2">Import Service</option>
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
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="executionDate" className='col-span-1 text-base'>Execution Date</label>
                                    <input id="executionDate" type="date" className="form-input py-2.5 text-base col-span-4"
                                        name="executionDate" value={executionDate} onChange={(e) => setExecutionDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex items-center  justify-center gap-6 pt-8">
                                <button type="submit" className="btn btn-success gap-2">
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Submit
                                </button>
                                <Link to="/pages/reports/treasuryChallan/index"><button type="button" className="btn btn-danger gap-2" >
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
export default AddTreasuryChallan;