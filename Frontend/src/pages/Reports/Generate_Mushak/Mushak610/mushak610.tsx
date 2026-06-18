import React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import IconFile from '../../../../components/Icon/IconFile';
import logo from '/assets/images/Govt/govt.png';
import axios from 'axios';
import { number } from 'yup';


const mushak610: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();

    // Function to get today's date in the format "YYYY-MM-DD"
    // const getTodayDate = () => {
    //     const today = new Date();
    //     const year = today.getFullYear();
    //     const month = String(today.getMonth() + 1).padStart(2, '0');
    //     const day = String(today.getDate()).padStart(2, '0');
    //     return `${year}-${month}-${day}`;
    // };

    const handlePrintButtonClick = () => {
        window.print();
    };

    interface openingDetails {
        itemId: number;
        itemType: number;
        openingQuantity: number;
        openingRate: number;
        openingValue: number;
        openingDate: string;
        closingDate: string;
    }

    interface purchaseDetails {
        id: number;
        itemName: string;
        hsCode: string;
        description: string;
        supplierName: string;
        supplierAddress: string;
        supplierTin: string;
        pinvoiceNo: string;
        vendorInvoice: string;
        qty: number;
        rate: number;
        amount: number;
        sdAmount: number;
        cdAmount: number;
        rdAmount: number;
        vatableValue: number;
        vatRate: number;
        taxAmount: number;
        tAmount: number;
        chalanDate: string;
        entryDate: string;
    }

    interface productionDetails {
        id: number;
        proInvoiceId: number;
        usedQty: number;
        rate: number;
        productionDate: string;
    }
    interface debitNoteDetails {
        id: number;
        debitNoteNo: string;
        purchaseAmount: number;
        vatAmount: number;
        sdAmount: number;
        returnQty: number;
        returnAmount: number;
        returnVat: number;
        returnSd: number;
        dnIssueDate: string;
    }

    const [openingDetails, setOpeningDetails] = useState<openingDetails[]>([]);
    const [purchaseItemDetails, setPurchaseDetails] = useState<purchaseDetails[]>([]);
    const [productionDetails, setProductionDetails] = useState<productionDetails[]>([]);
    const [debitNoteDetail, setDebitNoteDetails] = useState<debitNoteDetails[]>([]);

    const [openingDate, setOpeningDate] = useState("");
    const [openingQuantity, setOpeningQty] = useState("");
    const [openingRate, setOpeningRate] = useState("");
    const [openingValue, setOpeningValue] = useState("");

    const [customerName, setSalesCustomer] = useState("");
    const [customerBin, setSalesCustomerBin] = useState("");
    const [signature, setPersonSignature] = useState("");
    const [authPersonName, setCompanyPersonName] = useState("");
    const [date, setDate] = useState("");



    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }
            axios.get(`http://localhost:8080/bmitvat/api/mushak63/viewReport/${params.id}`, { headers })
                .then((response) => {

                    setPersonSignature(response.data.companyReportModels.signature);
                    setSalesCustomer(response.data.salesDetails.customerName);
                    setSalesCustomerBin(response.data.salesDetails.customerBinNid);
                    setDate(response.data.salesDetails.chalanDate);

                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, []);

    const itemName = purchaseItemDetails.reduce((acc, item) => { return item.itemName; }, '');
    const pInvoiceNo = purchaseItemDetails.reduce((acc, item) => { return item.pinvoiceNo; }, '');

    let preQty = openingQuantity;
    let prePrice = openingValue;

    let totalUsedQty = openingQuantity;
    let totalPrice = openingValue;


    return (
        <div>
            <div className="items-center justify-between flex-wrap text-black m-6 grid grid-cols-3 gap-4">
                <div>
                    <img className="h-20 w-20" src={logo} />
                </div>
                <div className="font-bold  grid grid-rows-2 grid-flow-col gap-4 pt-2">
                    <h3 className='text-xl' style={{ textAlign: 'center' }} >গনপ্রজাতন্ত্রী বাংলাদেশ সরকার</h3>
                    <h3 style={{ textAlign: 'center' }} >জাতীয় রাজস্ব বোর্ড</h3>
                </div>
                <div>
                    <button type="submit" className="bg-white text-gray-800 font-semibold py-1 px-1 border border-gray-400 float-right" >
                        মূসক- ৬.১০
                    </button>
                </div>
            </div>

            <div className="m-2">
                <div className="mb-5">
                    <div className="" id="browser_default">
                        <div className="flex flex-col items-center justify-between mb-7">
                            <h5 className="text-base dark:text-white-light font-bold">২ (দুই) লক্ষ টাকার অধিক মুল্যমানের ক্রয়-বিক্রয় চালানপত্রের তথ্য</h5>
                            <h5 className="text-base dark:text-white-light">[বিধি ৪২ এর উপ-বিখি (১) দ্রষ্টব্য]</h5>
                        </div>
                        <div className='flex flex-col text-right gap-3'>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-sm  font-normal"> নিবন্ধিত/তালিকাভুক্ত ব্যক্তির নাম: </label>
                                <p className="text-sm font-medium"> {customerName} </p>
                            </div>
                            <div className='flex sm:flex-row flex-row mb-3'>
                                <label className="mr-3 text-sm font-normal"> বিআইএন: </label>
                                <p className="text-sm font-medium"> {customerBin} </p>
                            </div>
                        </div>
                        <div className="flex flex-col mb-7">
                            <h5 className="text-base dark:text-white-light font-bold">অংশ-ক : ক্রয় হিসাব তথ্য</h5>
                        </div>

                        {/* <div className="mb-5 border border-black"> */}
                        <div className="mb-5">
                            <div className="border-collapse border overflow-hidden overflow-x-auto">
                                <table className="table-auto min-w-full border-collapse border border-black">
                                    <thead>
                                        <tr>
                                            <th className="border border-black p-2 font-medium" rowSpan={3} style={{ textAlign: 'center' }} >ক্রমিক সংখ্যা</th>
                                            <th className="border border-black font-medium" colSpan={6} style={{ textAlign: 'center' }} >ক্রয়</th>
                                        </tr>

                                        <tr>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >চালান পত্র নং</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >ইস্যুর তারিখ</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >মূল্য</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >বিক্রেতার নাম</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >বিক্রেতার ঠিকানা</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >বিক্রেতার বিআইএন/জাতীয় পরিচয়পত্র নং*</th>
                                        </tr>

                                        <tr>
                                        </tr>

                                        <tr>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(২)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৩)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৪)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৫)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৬)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৭)</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {/* {openingDetails.map((item, index) => {
                                            totalUsedQty += item.openingQuantity;
                                            totalPrice += item.openingValue;
                                        return ( */}
                                        <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black overflow-hidden">{openingDate}</td>
                                            <td className="p-0 border border-black">{preQty}</td>
                                            <td className="p-0 border border-black">{prePrice}</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>
                                        {/* );
                                    })}  */}

                                        {purchaseItemDetails.map((item, index) => {
                                            preQty = totalUsedQty;
                                            prePrice = totalPrice;
                                            totalUsedQty += item.qty;
                                            totalPrice += item.qty * item.rate;
                                            return (
                                                <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black overflow-hidden" >{item.chalanDate}</td>
                                                    <td className="p-0 border border-black">{preQty}</td>
                                                    <td className="p-0 border border-black">{prePrice}</td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.pinvoiceNo}</td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black">{item.supplierName}</td>
                                                </tr>
                                            );
                                        })}

                                        {debitNoteDetail.map((item, index) => {
                                            preQty = totalUsedQty;
                                            prePrice = totalPrice;
                                            totalUsedQty += item.returnQty;
                                            totalPrice += item.returnAmount;

                                            return (
                                                <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black overflow-hidden" >{item.dnIssueDate}</td>
                                                    <td className="p-0 border border-black">{preQty}</td>
                                                    <td className="p-0 border border-black">{prePrice}</td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.debitNoteNo}</td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                </tr>
                                            );
                                        })}

                                        {productionDetails.map((item, index) => {
                                            preQty = totalUsedQty;
                                            prePrice = totalPrice;
                                            totalUsedQty += -item.usedQty;
                                            totalPrice += -(item.rate * item.usedQty);
                                            return (
                                                <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.productionDate}</td>
                                                    <td className="p-0 border border-black">{preQty}</td>
                                                    <td className="p-0 border border-black">{prePrice}</td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.proInvoiceId}</td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                </tr>
                                            )
                                        })}

                                        <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                            <td className="p-0 border border-black">Total</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex flex-col mb-7">
                            <h5 className="text-base dark:text-white-light font-bold">অংশ-খ : বিক্রয় হিসাব তথ্য</h5>
                        </div>

                        {/* <div className="mb-5 border border-black"> */}
                        <div className="mb-5">
                            <div className="border-collapse border overflow-hidden overflow-x-auto">
                                <table className="table-auto min-w-full border-collapse border border-black">
                                    <thead>
                                        <tr>
                                            <th className="border border-black p-2 font-medium" rowSpan={3} style={{ textAlign: 'center' }} >ক্রমিক সংখ্যা</th>
                                            <th className="border border-black font-medium" colSpan={6} style={{ textAlign: 'center' }} >বিক্রয়</th>
                                        </tr>

                                        <tr>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >চালান পত্র নং</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >ইস্যুর তারিখ</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >মূল্য</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >ক্রেতার নাম</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >ক্রেতার ঠিকানা</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2} style={{ textAlign: 'center' }} >ক্রেতার বিআইএন/জাতীয় পরিচয়পত্র নং*</th>
                                        </tr>

                                        <tr>
                                        </tr>

                                        <tr>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(২)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৩)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৪)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৫)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৬)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৭)</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {/* {openingDetails.map((item, index) => {
                                            totalUsedQty += item.openingQuantity;
                                            totalPrice += item.openingValue;
                                        return ( */}
                                        <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black overflow-hidden">{openingDate}</td>
                                            <td className="p-0 border border-black">{preQty}</td>
                                            <td className="p-0 border border-black">{prePrice}</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>
                                        {/* );
                                    })}  */}

                                        {purchaseItemDetails.map((item, index) => {
                                            preQty = totalUsedQty;
                                            prePrice = totalPrice;
                                            totalUsedQty += item.qty;
                                            totalPrice += item.qty * item.rate;
                                            return (
                                                <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black overflow-hidden" >{item.chalanDate}</td>
                                                    <td className="p-0 border border-black">{preQty}</td>
                                                    <td className="p-0 border border-black">{prePrice}</td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.pinvoiceNo}</td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black">{item.supplierName}</td>
                                                </tr>
                                            );
                                        })}

                                        {debitNoteDetail.map((item, index) => {
                                            preQty = totalUsedQty;
                                            prePrice = totalPrice;
                                            totalUsedQty += item.returnQty;
                                            totalPrice += item.returnAmount;

                                            return (
                                                <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black overflow-hidden" >{item.dnIssueDate}</td>
                                                    <td className="p-0 border border-black">{preQty}</td>
                                                    <td className="p-0 border border-black">{prePrice}</td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.debitNoteNo}</td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                </tr>
                                            );
                                        })}

                                        {productionDetails.map((item, index) => {
                                            preQty = totalUsedQty;
                                            prePrice = totalPrice;
                                            totalUsedQty += -item.usedQty;
                                            totalPrice += -(item.rate * item.usedQty);
                                            return (
                                                <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.productionDate}</td>
                                                    <td className="p-0 border border-black">{preQty}</td>
                                                    <td className="p-0 border border-black">{prePrice}</td>
                                                    <td className="p-0 border border-black overflow-hidden">{item.proInvoiceId}</td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                </tr>
                                            )
                                        })}

                                        <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                            <td className="p-0 border border-black">Total</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>


                        <div>
                            <div className='flex flex-col gap-3'>
                                <div className='flex sm:flex-row flex-row'>
                                    <label className="mr-3 text-sm font-semibold"> দায়িত্বপ্রাপ্ত ব্যক্তির স্বাক্ষর: </label>
                                    <img id="login_file" src={'/assets/images/authorised_person/' + signature} alt="img" className="w-44 h-10 object-cover" />
                                </div>
                                <div className='flex sm:flex-row flex-row'>
                                    <label className="mr-3 text-sm font-semibold"> নাম: </label>
                                    <p className="text-sm font-medium"> {authPersonName} </p>
                                </div>
                                <div className='flex sm:flex-row flex-row mb-3'>
                                    <label className="mr-3 text-sm font-semibold"> তারিখ: </label>
                                    <p className="text-sm font-medium"> {date} </p>
                                </div>
                                <p className='font-semibold'>* যেইক্ষেত্রে অনিবন্ধিত ব্যক্তির নিকট হইতে পণ্য/সেবা ক্রয় করা হইবে বা অনিবন্ধিত ব্যক্তির নিকট পণ্য/সেবা বিক্রয় করা হইবে,
                                    সেইক্ষেত্রে উক্ত ব্যক্তির পূর্ণাঙ্গ নাম, ঠিকানা ও জাতীয় পরিচয়পত্র নম্বর যথাযথভাবে সংশ্লিষ্ট কলামে [(৭), (৮) ও (৯)] আবশ্যিকভাবে উল্লেখ করিতে হইবে।</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default mushak610;


