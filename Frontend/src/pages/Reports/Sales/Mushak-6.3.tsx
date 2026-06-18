import React from 'react';
import { Link, NavLink, useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import IconFile from '../../../components/Icon/IconFile';
// import * as $ from 'jquery';
import { number } from 'yup';


const LocalSalesMushuk: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }
        axios.get(`http://localhost:8080/bmitvat/api/mushak63/viewReport/${params.id}`, { headers })
            .then((response) => {
                setCompanyName(response.data.companyReportModels.companyName);
                setCompanyBin(response.data.companyReportModels.comBin);
                setCompanyAddress(response.data.companyReportModels.street);
                setCompanyPersonName(response.data.companyReportModels.personName);
                setPersonDesignation(response.data.companyReportModels.description);
                setPersonSignature(response.data.companyReportModels.signature);

                setSalesCustomer(response.data.salesDetails.customerName);
                setSalesCustomerBin(response.data.salesDetails.customerBinNid);
                setSalesCustomerAdd(response.data.salesDetails.destination);
                setSalesVehicle(response.data.salesDetails.vehicleInfo);
                setSalesChalan(response.data.salesDetails.salesChallan);
                setSalesChalanDate(response.data.salesDetails.chalanDate);

                setSalesItemDetails(response.data.salesItemDetails);

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }, []);

    interface salesItem {
        id: number;
        itemName: string;
        unitName: string;
        hsCode: string;
        qty: number;
        rate: number;
        amount: number;
        sdAmount: number;
        vatableValue: number;
        vatRate: number;
        vatAmount: number;
        totalAmount: number;
    }

    const [salesItemDetails, setSalesItemDetails] = useState<salesItem[]>([]);
    const [companyName,setCompanyName]=useState("");
    const [companyBin,setCompanyBin]=useState("");
    const [companyAddress,setCompanyAddress]=useState("");
    const [authPersonName,setCompanyPersonName]=useState("");
    const [authPersonDeg,setPersonDesignation]=useState("");
    const [signature,setPersonSignature]=useState("");

    const [customerName,setSalesCustomer]=useState("");
    const [customerBin,setSalesCustomerBin]=useState("");
    const [customerDest,setSalesCustomerAdd]=useState("");
    const [vehicleInfo,setSalesVehicle]=useState("");
    const [salesChallan,setSalesChalan]=useState("");
    const [chalanDate,setSalesChalanDate]=useState("");

    // console.log(salesItemDetails);

    const totalPrice = salesItemDetails.reduce((total, item) => total + item.amount, 0);
    const totalSd = salesItemDetails.reduce((total, item) => total + item.sdAmount, 0);
    const totalVat = salesItemDetails.reduce((total, item) => total + item.vatAmount, 0);
    const totalSalesPrice = salesItemDetails.reduce((total, item) => total + item.totalAmount, 0);

    return (
        <div className='p-1'>
            <div className="items-center justify-between flex-wrap text-black m-6 grid grid-cols-3 gap-4">
                <div>
                    <img className="w-28 ml-[5px] flex-none" src="/assets/images/Govt/govt.png" />
                </div>
                <div className="font-bold text-center grid grid-rows-2 grid-flow-col gap-4 pt-8">
                    <h3 className='text-xl'>গনপ্রজাতন্ত্রী বাংলাদেশ সরকার</h3>
                    <h3>জাতীয় রাজস্ব বোর্ড</h3>
                </div>
                <div>
                    <button type="submit" className="btn btn-success gap-2 float-right" >
                        <IconFile className="w-5 h-5 ltr:mr-1 rtl:ml-1" />
                        PDF Copy
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-right mr-7 ">
                <div></div>
                <div>
                    <button type="submit" className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400" >
                        মূসক- ৬.৩
                    </button>
                </div>
            </div>
            <div className="pt-5 gap-2 m-5">
                <div className="mb-5">
                    <div className="" id="browser_default">
                        <div className="flex flex-col items-center justify-between mb-7">
                            <h5 className="text-base dark:text-white-light">কর চালান পত্র</h5>
                            <h5 className="text-base dark:text-white-light">[বিধি ৪০ উপ-বিধি এর (১) এর দফা (গ) ও দফা (চ) দ্রষ্টব্য]</h5>
                            <div className='flex sm:flex-row flex-row pt-6'>
                                <label className="mr-3 text-base font-normal"> নিবন্ধিত বাক্তির নাম:- </label>
                                <p className="text-base font-medium"> {companyName} </p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> নিবন্ধিত বাক্তির বিআইএন:- </label>
                                <p className="text-base font-medium">{companyBin}</p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> চালানপত্র ইস্যুর ঠিকানা:- </label>
                                <p className="text-base font-medium"> {companyAddress} </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 pb-5">
                            <div className='flex flex-col text-right gap-3'>
                                <div className='flex sm:flex-row flex-row'>
                                    <label className="mr-3 text-sm  font-normal"> ক্রেতার নাম: </label>
                                    <p className="text-sm font-medium"> {customerName} </p>
                                </div>
                                <div className='flex sm:flex-row flex-row'>
                                    <label className="mr-3 text-sm  font-normal"> ক্রেতার বিআইএন: </label>
                                    <p className="text-sm font-medium"> {customerBin} </p>
                                </div>
                                <div className='flex sm:flex-row flex-row'>
                                    <label className="mr-3 text-sm font-normal"> পন্নের গন্তব্বস্থল: </label>
                                    <p className="text-sm font-medium"> {customerDest} </p>
                                </div>
                                <div className='flex sm:flex-row flex-row'>
                                    <label className="mr-3 text-sm font-normal"> যানবাহনের প্রকৃতি ও নম্বর: </label>
                                    <p className="text-sm font-medium"> {vehicleInfo} </p>
                                </div>
                            </div>
                            <div></div>
                            <div className='flex flex-col  gap-3 pl-10'>
                                <div className='flex sm:flex-row flex-row text-right'>
                                    <label className="mr-3 text-sm font-normal text-right"> চালানপত্র নম্বর: </label>
                                    <p className="text-sm font-medium text-right" > {salesChallan} </p>
                                </div>
                                <div className='flex sm:flex-row flex-row text-right'>
                                    <label className="mr-3 text-sm font-normal text-right"> ইস্যুর তারিখ: </label>
                                    <p className="text-sm font-medium text-right" > {chalanDate} </p>
                                </div>
                                <div className='flex sm:flex-row flex-row text-right'>
                                    <label className="mr-3 text-sm font-normal text-right"> ইস্যুর সময়: </label>
                                    <p className="text-sm font-medium text-right" > {chalanDate} </p>
                                </div>
                                {/* <div>চালানপত্র নম্বর: SC-20221222-0001</div>
                                <div>ইস্যুর তারিখ: 22-12-2022</div>
                                <div>ইস্যুর সময়: 10:08:11</div> */}
                            </div>
                        </div>
                        <div className="mb-5">
                            <div className="border-collapse border border-slate-400 overflow-hidden overflow-x-auto">
                                <table className="table table-xs">
                                    <thead>
                                        <tr className="border border-slate-300">
                                            <th >ক্রমিক সংখ্যা</th>
                                            <th>পন্ন্য বা সেবার বর্ণনা( প্রযোজ্য ক্ষেত্রে ব্র্যান্ড নামসহ)</th>
                                            <th>সরবরাহের একক</th>
                                            <th>পরিমান</th>
                                            <th>একক মূল্য (টাকায়)</th>
                                            <th>মোটমূল্য (টাকায়)</th>
                                            <th>সম্পূরক শুল্কের পরিমান (টাকায়)</th>
                                            <th>মূল্য সংযজন করের হার/ সুনিদ্রিসট কর</th>
                                            <th>মূল্য সংযজন কর এর পরিমান(টাকায়)</th>
                                            <th>সরবরাহের একক</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesItemDetails.map((item, index) => (
                                        <tr key={index} className="border border-slate-200">
                                            <td>{index + 1}</td>
                                            <td>{item.itemName} </td>
                                            <td>{item.unitName} </td>
                                            <td>{item.qty} </td>
                                            <td>{item.rate} </td>
                                            <td>{item.amount} </td>
                                            <td>{item.sdAmount} </td>
                                            <td>{item.vatRate} </td>
                                            <td>{item.vatAmount} </td>
                                            <td>{item.totalAmount} </td>
                                        </tr>
                                        ))}
                                        <tr>
                                            <td align="right">সর্বমোট</td>
                                            <td ></td>
                                            <td ></td>
                                            <td ></td>
                                            <td ></td>
                                            <td > {totalPrice} </td>
                                            <td > {totalSd} </td>
                                            <td ></td>
                                            <td > {totalVat} </td>
                                            <td > {totalSalesPrice} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <div className="pb-2">
                                <div className='flex flex-col text-right gap-3'>
                                    <div className='flex sm:flex-row flex-row'>
                                        <label className="mr-3 text-sm font-semibold"> প্রতিষ্ঠান করতিপক্ষের দায়িত্বপ্রাপ্ত বাক্তির নাম: </label>
                                        <p className="text-sm font-medium"> {authPersonName} </p>
                                    </div>
                                    <div className='flex sm:flex-row flex-row'>
                                        <label className="mr-3 text-sm font-semibold"> পদবি: </label>
                                        <p className="text-sm font-medium"> {authPersonDeg} </p>
                                    </div>
                                    <div className='flex sm:flex-row flex-row'>
                                        <label className="mr-3 text-sm font-semibold"> স্বাক্ষর: </label>
                                        <img id="login_file" src={'/assets/images/authorised_person/'+ signature} alt="img" className="w-44 h-10 object-cover" />
                                    </div>
                                    <div className='flex sm:flex-row flex-row'>
                                        <label className="mr-3 text-sm font-semibold"> সিল: </label>
                                        <p className="text-sm font-medium"> </p>
                                    </div>
                                </div>
                                <p className='pt-3 font-semibold'>*উৎসে কর্তনযোগ্য সরবরাহের ক্ষেত্রে ফর্মটি সমন্নিত কর চালানপত্র ও উৎসে কর সনদপত্র হিসাবে বিবেচিত হইবে এবং উৎসে কর্তনযোগ্য সরবরাহের ক্ষেত্রে প্রযোজ্য হইবে</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocalSalesMushuk;


