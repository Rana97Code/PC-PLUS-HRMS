import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContext from '../../../../context/UserContex';

const AddPaybleVoucher = () => {

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


    // interface types {
    //     id: number;
    //     type_name: string;
    //     unit_name: string;
    // }
    // interface Hscode {
    //     id: number;
    //     hs_code: string;
    //     description: string;
    //     description_bn: string;
    //     calculate_year: string;
    // }

    // const [allTypes, setGetAllTypes] = useState<types[]>([]);
    // const [allHscode, setGetAllHscode] = useState<Hscode[]>([]);
    // const [item_name, setName] = useState("");
    // const [typeId, setTypeName] = useState("");
    //const [account_code, setAccountCode] = useState("");

    const [payble_description, setPaybleDescription] = useState("");
    const [challan_no, setChallanNo] = useState("");
    const [challanDate, setChallanDate] = useState(getTodayDate());
    const [executionDate, setExecutionDate] = useState(getTodayDate());
    const [amount_code, setAmount] = useState("");
    const [vat_amount, setVatAmount] = useState("");


    // const [hsCodeId, setHscodeId] = useState("");
    // const [unit_name, setUnit] = useState("");
    // const [status, setStatus] = useState("");

    useEffect(() => {
        if (user) {

            // for Authorised Person
            // axios.get(`${user.base_url}/alltypes`, { headers })
            //     .then((response) => {
            //         if (Array.isArray(response.data)) {
            //             setGetAllTypes(response.data);
            //         } else {
            //             throw new Error('Response data is not an array');
            //         }
            //     })
            //     .catch((error) => {
            //         console.error('Error fetching data:', error);

            //     });
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


        const paybleVoucher = {
            challan_no: challan_no,
            payble_description: payble_description,
            amount_code: amount_code,
            vat_amount: vat_amount,

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
        console.log(paybleVoucher);

        if (user) {

            try {
                await axios.post(`${user.base_url}/paybleVoucher/add_paybleVoucher`, paybleVoucher, { headers })
                    .then(function (response) {
                        if (response) {
                            navigate("/pages/reports/paybleVoucher");
                        } else {
                            navigate("/pages/reports/paybleVoucher/add");
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
                <h2 className="text-xl font-bold">Add Payble Voucher</h2>
            </div>
            <div className="panel mt-6">
                <div id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-lg dark:text-white-light">Add New Payble Voucher</h3>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit} >
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="paybleDescription" className='col-span-1 text-base'>Payble Description</label>
                                    <input id="paybleDescription" type="text" placeholder="Enter Payble Description" className="form-input py-2.5 text-base col-span-4"
                                        name="paybleDescription" onChange={(e) => setPaybleDescription(e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid  gap-4">
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="challanNo" className='col-span-1 text-base'>Challan No</label>
                                    <input id="challanNo" type="text" placeholder="Enter Challan No" className="form-input py-2.5 text-base col-span-4"
                                        name="description_code" onChange={(e) => setChallanNo(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="challanDate" className='col-span-1 text-base'>Challan Date</label>
                                    <input id="challanDate" type="date" className="form-input py-2.5 text-base col-span-4"
                                        name="challanDate" value={challanDate} onChange={(e) => setChallanDate(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                    <label htmlFor="executionDate" className='col-span-1 text-base'>Execution Date</label>
                                    <input id="executionDate" type="date" className="form-input py-2.5 text-base col-span-4"
                                        name="executionDate" value={executionDate} onChange={(e) => setExecutionDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid  gap-4">
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="amountCode" className='col-span-1 text-base'>Amount</label>
                                    <input id="amountCode" type="text" placeholder="Enter Amount" className="form-input py-2.5 text-base col-span-4"
                                        name="amountCode" onChange={(e) => setAmount(e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid  gap-4">
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="vatAmount" className='col-span-1 text-base'>VAT Amount</label>
                                    <input id="vatAmount" type="text" placeholder="Enter Amount" className="form-input py-2.5 text-base col-span-4"
                                        name="vatAmount" onChange={(e) => setVatAmount(e.target.value)} required />
                                </div>
                            </div>
                            
                            <div className="flex items-center  justify-center gap-6 pt-8">
                                <button type="submit" className="btn btn-success gap-2">
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Submit
                                </button>
                                <Link to="/pages/reports/treasury_challan/index"><button type="button" className="btn btn-danger gap-2" >
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
export default AddPaybleVoucher;