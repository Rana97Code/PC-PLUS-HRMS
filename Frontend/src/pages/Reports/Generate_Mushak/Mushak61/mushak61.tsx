import React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import IconFile from '../../../../components/Icon/IconFile';
import logo from '/assets/images/Govt/govt.png';
import axios from 'axios';
import { number } from 'yup';


const mushak61: React.FC = () => {
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
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [companyTin, setCompanyTin] = useState("");
    const [itemDetails, setItemName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get(`http://localhost:8080/bmitvat/api/mushak61/getItemsDetail/${params.data}`, { headers })
                .then((response) => {
                    setCompanyName(response.data.companyReportModels.companyName);
                    setCompanyAddress(response.data.companyReportModels.street);
                    setCompanyTin(response.data.companyReportModels.comTin);

                    setOpeningDetails(response.data.openingAddModel);
                    setOpeningDate(response.data.openingAddModel.openingDate);
                    setOpeningQty(response.data.openingAddModel.openingQuantity);
                    setOpeningRate(response.data.openingAddModel.openingRate);
                    setOpeningValue(response.data.openingAddModel.openingValue);

                    setPurchaseDetails(response.data.purchaseItem61Models);
                    setProductionDetails(response.data.productionItem61Models);
                    setDebitNoteDetails(response.data.debitNoteItem61Models);

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

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
    //     const arrayData: any[] = [];
    //     if (dataTable) {
    //         dataTable.querySelectorAll('tr').forEach((row) => {

    //             const rowData: any = {};

    //             row.querySelectorAll('td input').forEach((input) => {
    //                 const inputElement = input as HTMLInputElement;
    //                 rowData[inputElement.name || 'ক্রমিক সংখ্যা'] = inputElement.value;
    //                 rowData[inputElement.name || 'তারিখ'] = inputElement.value;
    //                 rowData[inputElement.name || 'উৎপাদিত পণ্য /সেবার প্রারম্ভিক জের'] = inputElement.value;
    //                 rowData[inputElement.name || 'উৎপাদন'] = inputElement.value;
    //                 rowData[inputElement.name || 'মোট উৎপাদিত পণ্য /সেবা'] = inputElement.value;
    //                 rowData[inputElement.name || 'ক্রেতা/সরবরাহ গ্রহিতা'] = inputElement.value;
    //                 rowData[inputElement.name || 'চালান পত্রের বিবরন'] = inputElement.value;
    //                 rowData[inputElement.name || 'বিক্রিত /সরবরাহকৃত পণ্যের বিবরন'] = inputElement.value;
    //                 rowData[inputElement.name || 'পণ্যের প্রান্তিক জের'] = inputElement.value;
    //                 rowData[inputElement.name || 'মন্তব্য'] = inputElement.value;
    //             });
    //             arrayData.push(rowData);

    //         });

    //     } else {
    //         console.error("Could not find #dataTable tbody element");
    //     }
    // };

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
                        মূসক- ৬.১
                    </button>
                </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-2 text-right mr-7 ">
                <div></div>
                <div>
                    <button type="submit" className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400" >
                        মূসক- ৬.১
                    </button>
                </div>
            </div> */}
            <div className="m-2">
                <div className="mb-5">
                    <div className="" id="browser_default">
                        <div className="flex flex-col items-center justify-between mb-7">
                            <div className='flex sm:flex-row flex-row pt-4'>
                                <label className="mr-3 text-base font-normal"> প্রতিষ্ঠানের নাম: </label>
                                <p className="text-base font-medium"> {companyName} </p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> ঠিকানা: </label>
                                <p className="text-base font-medium"> {companyAddress} </p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> করদাতার সনাক্তকরণ সংখ্যা: </label>
                                <p className="text-base font-medium"> {companyTin} </p>
                            </div>
                            <div className="font-bold grid grid-rows-2 grid-flow-col pt-2">
                                <h3>ক্রয় হিসাব পুস্তক</h3>
                            </div>
                            <h5 className="text-base dark:text-white-light">(পণ্য বা সেবা প্রক্রিয়াকরনে সম্পৃক্ত এমন নিবন্ধিত বা তালিকাভুক্ত ব্যক্তির জন্য প্রযোজ্য)</h5>
                            <h5 className="text-base dark:text-white-light">[ বিধি ৪০(১) এর দফা (ক) এবং ৪১ এর দফা (ক) দ্রষ্টব্য ]</h5>
                        </div>

                        {/* <div className="mb-5 border border-black"> */}
                        <div className="mb-5">
                            <div className="border-collapse border overflow-hidden overflow-x-auto">
                                <table className="table-auto min-w-full border-collapse border border-black">
                                    <thead>
                                        <tr className="text-black font-bold h-8">
                                            <th colSpan={21} className="text-left p-4 border border-black bg-gray-200">
                                                পণ্য/সেবা: {itemName}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={21} className="text-left p-2 border border-black bg-gray-200">
                                                পণ্য/সেবার উপকরণ ক্রয়
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="border border-black p-2 font-medium" rowSpan={3} >ক্রমিক সংখ্যা</th>
                                            <th className="border border-black font-medium" rowSpan={3} >তারিখ</th>
                                            <th className="border border-black font-medium" colSpan={2} style={{ textAlign: 'center' }} >মজুদ উপকরণের প্রারম্ভিক জের</th>
                                            <th className="border border-black font-medium" colSpan={14} style={{ textAlign: 'center' }} >ক্রয়কৃত উপকরণ</th>
                                            <th className="border border-black font-medium" colSpan={2} style={{ textAlign: 'center' }} >উপকরণের প্রান্তিক জের</th>
                                            <th className="border border-black font-medium" rowSpan={3} >মন্তব্য</th>
                                        </tr>

                                        <tr>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>পরিমাণ(একক)</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>চালানপত্র/বিল অব এন্ট্রি নম্বর</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>তারিখ</th>
                                            <th className="border border-black p-2 font-medium" colSpan={3} style={{ textAlign: 'center' }} >বিক্রেতা/সরবরাহকারী</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>বিবরণ</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>পরিমাণ</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>সম্পূরক (শুল্ক যদি থাকে)</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>মূসক</th>
                                            <th className="border border-black p-2 font-medium" colSpan={2} style={{ textAlign: 'center' }} >মোট উপকরণের পরিমাণ</th>
                                            <th className="border border-black p-2 font-medium" colSpan={2} style={{ textAlign: 'center' }} >পণ্য প্রস্তুত/প্রক্রিয়াকরণে উপকরণের ব্যাবহার</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>পরিমাণ (একক)</th>
                                            <th className="border border-black p-2 font-medium" rowSpan={2}>মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                        </tr>

                                        <tr>
                                            <th className='border border-black p-2 font-medium' style={{ textAlign: 'center' }} >নাম</th>
                                            <th className='border border-black p-2 font-medium' style={{ textAlign: 'center' }} >ঠিকানা</th>
                                            <th className='border border-black p-2 font-medium' style={{ textAlign: 'center' }} >নিবন্ধন/তালিকাভুক্তি/জাতীয় পরিচয় পত্র নং</th>
                                            <th className='border border-black p-2 font-medium' style={{ textAlign: 'center' }} >পরিমাণ<br />(একক)</th>
                                            <th className='border border-black p-2 font-medium' style={{ textAlign: 'center' }} >মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                            <th className='border border-black p-2 font-medium' style={{ textAlign: 'center' }} >পরিমান<br />(একক)</th>
                                            <th className='border border-black p-2 font-medium' style={{ textAlign: 'center' }} >মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                        </tr>

                                        <tr>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(২)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৩)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৪)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৫)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৬)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৭)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৮)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(৯)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১০)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১১)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১২)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১৩)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১৪)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১৫)=(৩+১১)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১৬)=(৪+১২)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১৭)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১৮)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(১৯)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(২০)</th>
                                            <th className="border border-black" style={{ textAlign: 'center' }} >(২১)</th>
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
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black">{openingQuantity}</td>
                                            <td className="p-0 border border-black">{openingValue}</td>
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
                                                    <td className="p-0 border border-black">{item.supplierAddress}</td>
                                                    <td className="p-0 border border-black">{item.supplierTin}</td>
                                                    <td className="p-0 border border-black">{item.itemName}</td>
                                                    <td className="p-0 border border-black">{item.qty}</td>
                                                    <td className="p-0 border border-black">{item.qty * item.rate}</td>
                                                    <td className="p-0 border border-black">{item.sdAmount}</td>
                                                    <td className="p-0 border border-black">{item.taxAmount}</td>
                                                    <td className="p-0 border border-black">{totalUsedQty}</td>
                                                    <td className="p-0 border border-black">{totalPrice}</td>
                                                    <td className="p-0 border border-black">{totalUsedQty}</td>
                                                    <td className="p-0 border border-black">{totalPrice}</td>
                                                    <td className="p-0 border border-black">{totalUsedQty}</td>
                                                    <td className="p-0 border border-black">{totalPrice}</td>
                                                    <td className="p-0 border border-black"></td>
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
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black">{item.returnQty}</td>
                                                    <td className="p-0 border border-black">{item.returnAmount}</td>
                                                    <td className="p-0 border border-black">{item.sdAmount}</td>
                                                    <td className="p-0 border border-black">{item.vatAmount}</td>
                                                    <td className="p-0 border border-black">{totalUsedQty}</td>
                                                    <td className="p-0 border border-black">{totalPrice}</td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black">{totalUsedQty}</td>
                                                    <td className="p-0 border border-black">{totalPrice}</td>
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
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black"></td>
                                                    <td className="p-0 border border-black">{item.usedQty}</td>
                                                    <td className="p-0 border border-black">{item.rate * item.usedQty}</td>
                                                    <td className="p-0 border border-black">{totalUsedQty}</td>
                                                    <td className="p-0 border border-black">{totalPrice}</td>
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
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black">{totalUsedQty}</td>
                                            <td className="p-0 border border-black">{totalPrice}</td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <div className="pb-1">
                                <p className='pt-3 font-semibold text-xl'>বিশেষ দ্রষ্টব্য:</p>
                                <p className='pt-3'>১। অর্থনৈতিক কার্যক্রম সংশ্লিষ্ট সকল প্রকার ক্রয়ের তথ্য এই ফরমে অন্তর্ভুক্ত করিতে হইবে।</p>
                                <p className='pt-3'>২। যে ক্ষেত্রে অনিবন্ধিত ব্যক্তির নিকট হইতে পণ্য ক্রয় করা হইবে সেই ক্ষেত্রে উক্ত ব্যক্তির পূর্ণাঙ্গ নাম,
                                    ঠিকানা ও জাতীয় পরিচয়পত্র নম্বর যথাযথভাবে সংশ্লিষ্ট কলাম [(৭), (৮) ও (৯)] এ আবশ্যিকভাবে উল্লেখ করিতে হইবে।</p>
                                <p className='pt-3'>৩। উপকরণ ক্রয়ের স্বপক্ষে প্রামাণিক দলিল হিসাবে বিল অব এন্ট্রি বা চালানপত্রের কপি সংরক্ষণ করিতে হইবে।</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default mushak61;


