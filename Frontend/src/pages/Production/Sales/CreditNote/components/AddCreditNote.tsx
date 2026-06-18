import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useEffect, useState, useRef } from 'react';
import IconFile from '../../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../../components/Icon/IconTrashLines';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../../store/themeConfigSlice';
import sortBy from 'lodash/sortBy';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const AddDebitNote: React.FC = () => {
    const navigate = useNavigate();


    // Function to get today's date in the format "YYYY-MM-DD"
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    interface customers {
        id: number;
        customerName: string;
        customerAddress: string;
    }

    interface chalanNo {
        id: number;
        chalanNo: string;
    }

    interface suggestItem {
        id: number;
        itemName: string;
    }

    interface detailsItem {
        id: number;
        itemName: string;
        hsCodeId: number;
        hsCode: string;
        sd: number;
        vat: number;
    }

    const [all_customer, setAllCustomer] = useState<customers[]>([]);
    // const [all_purchase_chalan, setSupplierPurchase] = useState<chalanNo[]>([]);


    const [customerId, setCustomerId] = useState("");
    const [salesId, setSalesId] = useState("");
    // const [chalanNo, setChalanNo] = useState("");
    const [entryDate, setEntryDate] = useState(getTodayDate());
    const [vehicleInfo, setVehicleInfo] = useState("");

    const [note, setNote] = useState('');



    useEffect(() => {

        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get('http://localhost:8080/bmitvat/api/credit_note/get_sales_customers', { headers })
                .then((response) => {
                    setAllCustomer(response.data);

                })
                .catch((error) => {
                    console.error('Error fetching data:', error);

                });
        }
    }, []);

    const getCustomerId: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedOptionId = event.target.value;
        setCustomerId(selectedOptionId);
        const suggestionsList = document.getElementById('chalanList');

        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get(`http://localhost:8080/bmitvat/api/credit_note/get_customer_chalan/${selectedOptionId}`, { headers })
                .then((response) => {
                    const data = response.data;
                    // setSupplierPurchase(data)

                    if(data){
                    if (suggestionsList instanceof HTMLSelectElement) {
                        let optionsHTML = '<option>Please Select</option>';
                                    
                        data.forEach((suggestion: any) => {
                            optionsHTML += `<option value="${suggestion.id}">${suggestion.salesInvoice}</option>`;
                        });
                    
                        suggestionsList.innerHTML = optionsHTML;
                    } else {
                        console.error("Element with id 'SelectElement' is not a select element.");
                    }
                }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }

    };

    const getChalanNo: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const salesId = event.target.value;
        setSalesId(salesId);
                        if (salesId) {

                            const token = localStorage.getItem('Token');
                            if (token) {
                                const bearer = JSON.parse(token);
                                const headers = { Authorization: `Bearer ${bearer}` }

                                axios.get(`http://localhost:8080/bmitvat/api/credit_note/get_sales_details/${salesId}`, { headers })
                                    .then((response) => {
                                        const data = response.data;
                                        // setItemDetails(data);
                                        addRow(data);
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching data:', error);
                                    });
                            }


                            function addRow(dataArray: any) {
                                const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;

                                dataTable.innerHTML = '';
                                const arrayData: any[] = [];


                                dataArray.forEach((data: any)=> {

                                const inputId = document.createElement('input');
                                inputId.type = 'hidden';
                                inputId.name = 'itemId';
                                inputId.value = data.id;
                                inputId.autocomplete = 'off';
                                inputId.disabled = true;
                                inputId.style.cssText = 'width: 1px;';

                                const input = document.createElement('input');
                                input.type = 'text';
                                input.name = 'itemName';
                                input.value = data.itemName;
                                input.autocomplete = 'off';
                                input.disabled = true;
                                input.style.cssText = 'width: 150px;';

                                const input1 = document.createElement('input');
                                input1.type = 'number';
                                input1.name = 'qty';
                                input1.className = '';
                                input1.value =data.qty;
                                input1.id = 'qtyId';
                                input1.disabled = true;
                                input1.autocomplete = 'off';
                                input1.min = '0';
                                input1.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input2 = document.createElement('input');
                                input2.type = 'number';
                                input2.name = 'rate';
                                input2.className = 'rateClass';
                                input2.value = data.rate;
                                input2.autocomplete = 'off';
                                input2.disabled = true;
                                input2.min = '0';
                                input2.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input3 = document.createElement('input');
                                input3.type = 'number';
                                input3.name = 'salesPrice';
                                input3.className = '';
                                input3.value = data.salesPrice;
                                input3.autocomplete = 'off';
                                input3.disabled = true;
                                input3.min = '0';
                                input3.style.cssText = 'border: 1px solid black; width: 150px;';

                                const input4 = document.createElement('input');
                                input4.type = 'number';
                                input4.name = 'vatRate';
                                input4.className = '';
                                input4.value = data.vatRate;
                                input4.autocomplete = 'off';
                                input4.disabled = true;
                                input4.min = '0';
                                input4.style.cssText = 'border: 1px solid black; width: 50px;';

                                const input5 = document.createElement('input');
                                input5.type = 'number';
                                input5.name = 'vatAmount';
                                input5.className = 'total_vat';
                                input5.value = data.vatAmount;
                                input5.autocomplete = 'off';
                                input5.disabled = true;
                                input5.min = '0';
                                input5.style.cssText = 'border: 1px solid black; width: 100px;';

                                        
                                const input10 = document.createElement('input');
                                input10.type = 'number';
                                input10.name = 'sdRate';
                                input10.className = '';
                                input10.value = data.sdRate;
                                input10.autocomplete = 'off';
                                input10.disabled = true;
                                input10.min = '0';
                                input10.style.cssText = 'border: 1px solid black; width: 40px;';

                                const input6 = document.createElement('input');
                                input6.type = 'number';
                                input6.name = 'sdAmount';
                                input6.className = '';
                                input6.value = data.sdAmount;
                                input6.autocomplete = 'off';
                                input6.disabled = true;
                                input6.min = '0';
                                input6.style.cssText = 'border: 1px solid black; width: 100px;';
   
                                const input7 = document.createElement('input');
                                input7.type = 'number';
                                input7.name = 'returnQty';
                                input7.className = '';
                                input7.value = '';
                                input7.autocomplete = 'off';
                                input7.min = '0';
                                input7.style.cssText = 'border: 1px solid black; width: 100px;';
   
                                const input8 = document.createElement('input');
                                input8.type = 'number';
                                input8.name = 'returnAmount';
                                input8.className = 'total_amount';
                                input8.value = '';
                                input8.autocomplete = 'off';
                                input8.min = '0';
                                input8.step = '0.01';
                                input8.style.cssText = 'border: 1px solid black; width: 150px;';

                                const input9 = document.createElement('input');
                                input9.type = 'number';
                                input9.name = 'returnVat';
                                input9.className = 'returnVat';
                                input9.value = '';
                                input9.autocomplete = 'off';
                                input9.min = '0';
                                input9.step = '0.01';
                                input9.style.cssText = 'border: 1px solid black; width: 100px;';
                                                                       
                                const input11 = document.createElement('input');
                                input11.type = 'number';
                                input11.name = 'returnSd';
                                input11.className = 'total_sd';
                                input11.value = '';
                                input11.autocomplete = 'off';
                                input11.min = '0';
                                input11.step = '0.01';
                                input11.style.cssText = 'border: 1px solid black; width: 100px;';

                                input7.addEventListener('keyup', calculateValue);

                                function calculateValue() {
                                    const value2 = parseFloat(input2.value) || 0;
                                    const value4 = parseFloat(input4.value) || 0;
                                    const value7 = parseFloat(input7.value) || 0;

                                    const returnAmount = value2 * value7;
                                    input8.value = returnAmount.toString();

                                    //vat
                                    const vatWithValue = (returnAmount * value4) / 100;
                                    input9.value = vatWithValue.toString();

                                    // sd
                                    const vatAmout = (parseFloat(input8.value) * parseFloat(input10.value)) / 100;
                                    input11.value = vatAmout.toString();

                                }


                                const removeButton = document.createElement('button');
                                removeButton.textContent = 'Remove';
                                removeButton.style.cssText = 'border: 1px solid black; background-color:red; width: 100px;';
                                removeButton.addEventListener('click', () => {
                                    removeRow(newRow);
                                });
                                function removeRow(row: HTMLTableRowElement) {
                                    dataTable.removeChild(row);
                                    // Remove the corresponding data from the arrayData array
                                    const index = arrayData.findIndex((item) => item.itemName === data.itemName);
                                    if (index !== -1) {
                                        arrayData.splice(index, 1);
                                    }
                                }

                                input7.addEventListener('keyup', calculateTotalValue);
   

                                function calculateTotalValue() {
                                    // Grand Total VAT Calculation
                                    let amountTotalVat = 0;
                                    const VatInput = document.querySelectorAll(`.total_vat`) as NodeListOf<HTMLInputElement>;

                                    if (VatInput) {
                                        VatInput.forEach((input: HTMLInputElement) => {
                                            const value = parseFloat(input.value) || 0;
                                            amountTotalVat += value;
                                        });

                                        const amountTotalVatId = document.getElementById('vatTotal') as HTMLInputElement | null;
                                        if (amountTotalVatId !== null) {
                                            amountTotalVatId.value = amountTotalVat.toString();
                                        }
                                    }

                                    // Grand Total SD Calculation
                                    let amountTotalSd = 0;
                                    const SdInput = document.querySelectorAll(`.total_sd`) as NodeListOf<HTMLInputElement>;

                                    if (SdInput) {
                                        SdInput.forEach((input: HTMLInputElement) => {
                                            const value = parseFloat(input.value) || 0;
                                            amountTotalSd += value;
                                        });

                                        const amountTotalSdInput = document.getElementById('sdTotal') as HTMLInputElement | null;
                                        if (amountTotalSdInput !== null) {
                                            amountTotalSdInput.value = amountTotalSd.toString();
                                        }
                                    }

                                    // Grand Total Amount Calculation
                                    let amountTotal = 0;
                                    const inputs = document.querySelectorAll(`.total_amount`) as NodeListOf<HTMLInputElement>;

                                    if (inputs) {
                                        inputs.forEach((input: HTMLInputElement) => {
                                            const value = parseFloat(input.value) || 0;
                                            amountTotal += value;
                                        });

                                        const amountTotalInput = document.getElementById('amountTotal') as HTMLInputElement | null;
                                        if (amountTotalInput !== null) {
                                            amountTotalInput.value = amountTotal.toString();
                                        }
                                    }

                                }
                                const newRow = dataTable.insertRow();

                                const cellId = newRow.insertCell();
                                cellId.appendChild(inputId);
                                const cell = newRow.insertCell();
                                cell.appendChild(input);
                                const cell1 = newRow.insertCell();
                                cell1.appendChild(input1);
                                const cell2 = newRow.insertCell();
                                cell2.appendChild(input2);
                                const cell3 = newRow.insertCell();
                                cell3.appendChild(input3);
                                const cell4 = newRow.insertCell();
                                cell4.appendChild(input4);
                                const cell5 = newRow.insertCell();
                                cell5.appendChild(input5);
                                const cell10 = newRow.insertCell();
                                cell10.appendChild(input10);
                                const cell6 = newRow.insertCell();
                                cell6.appendChild(input6);
                                const cell7 = newRow.insertCell();
                                cell7.appendChild(input7);
                                const cell8 = newRow.insertCell();
                                cell8.appendChild(input8);
                                const cell9 = newRow.insertCell();
                                cell9.appendChild(input9);

                                const cell11 = newRow.insertCell();
                                cell11.appendChild(input11);
                                const removeCell = newRow.insertCell();
                                removeCell.appendChild(removeButton);
                            });

                            }

                        }

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
        const arrayData: any[] = [];
        if (dataTable) {
            dataTable.querySelectorAll('tr').forEach((row) => {

                const rowData: any = {};

                row.querySelectorAll('td input').forEach((input) => {
                    const inputElement = input as HTMLInputElement;
                    rowData[inputElement.name || 'itemId'] = inputElement.value;
                    rowData[inputElement.name || 'itemName'] = inputElement.value;
                    rowData[inputElement.name || 'qty'] = inputElement.value;
                    rowData[inputElement.name || 'rate'] = inputElement.value;
                    rowData[inputElement.name || 'salesPrice'] = inputElement.value;
                    rowData[inputElement.name || 'vatRate'] = inputElement.value;
                    rowData[inputElement.name || 'vatAmout'] = inputElement.value;
                    rowData[inputElement.name || 'sdRate'] = inputElement.value;
                    rowData[inputElement.name || 'sdAmount'] = inputElement.value;
                    rowData[inputElement.name || 'returnQty'] = inputElement.value;
                    rowData[inputElement.name || 'returnAmount'] = inputElement.value;
                    rowData[inputElement.name || 'returnVat'] = inputElement.value;
                    rowData[inputElement.name || 'returnSd'] = inputElement.value;
                });
                arrayData.push(rowData);

            });

        } else {
            console.error("Could not find #dataTable tbody element");
        }
        // const jsonAllItemsData = JSON.stringify(arrayData);
        const AllTotal = document.getElementById('amountTotal') as HTMLInputElement;
        const TotalVat = document.getElementById('vatTotal') as HTMLInputElement;
        const TotalSD = document.getElementById('sdTotal') as HTMLInputElement;


        if (TotalVat || TotalSD || AllTotal) {
            const Vat = TotalVat.value;
            const SD = TotalSD.value;
            const ALL = AllTotal.value;

            const creditNote = {
                customerId: customerId,
                salesId: salesId,
                creditNoteType: 1,
                cnIssueDate: entryDate,
                vehicleInfo: vehicleInfo,
                salesItems: arrayData,
                totalVat: Vat,
                totalSd: SD,
                grandTotal: ALL,
                notes: note
            }
            console.log(creditNote);

            const token = localStorage.getItem('Token');
            if (token) {
                const bearer = JSON.parse(token);
                const headers = { Authorization: `Bearer ${bearer}` }
                try {
                    await axios.post("http://localhost:8080/bmitvat/api/credit_note/add_credit_note", creditNote, { headers })
                        .then(function (response) {
                            navigate("/pages/sales/creditNote/index");
                        })
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Credit Note</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className="mb-5">
                    <div className="panel" id="browser_default">
                        <div className="flex items-center justify-between mb-7">
                            <h5 className="font-semibold text-lg dark:text-white-light">Add New Credit Note</h5>
                        </div>
                        <div className="mb-5">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                                <div>
                                        <label htmlFor="getSupplier">Customer</label>
                                        <select id="getCustomer" onChange={getCustomerId} className="form-select text-dark col-span-4 text-sm" required >
                                            <option>Select Customer</option>
                                            {all_customer.map((option, index) => (
                                                <option key={index} value={option.id}>
                                                    {option.customerName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="chalanList">Chalan No</label>
                                        <select id="chalanList" onChange={getChalanNo} className="form-select text-dark col-span-4 text-sm chalanList"  required >
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="browserLname">Entry Date</label>
                                        <input id="browserLname" type="date" placeholder="" className="form-input" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="browserLname">Vehicle Info</label>
                                        <input id="browserLname" type="text" placeholder="" className="form-input" onChange={(e) => setVehicleInfo(e.target.value)} />
                                    </div>
                                </div>
                                <div className="border overflow-hidden overflow-x-auto">
                                    <table id="dataTable" className="whitespace-nowrap table-hover border dataTable">
                                        <thead>
                                            <tr className="whitespace-nowrap border overflow-x-auto">
                                                <th className="w-1" ></th>
                                                <th className="w-14" >Item name</th>
                                                <th className="w-9 border-black" >Quantity</th>
                                                <th className="w-9" >Rate(BDT)</th>
                                                <th className="w-9" >Value</th>
                                                <th className="w-6 border-x-1 border-black" >Vat Rate</th>
                                                <th className="w-6" >VAT</th>
                                                <th className="w-6 border-x-1 border-black" >SD Rate</th>
                                                <th className="w-9 border-x-1 border-black" >SD</th>
                                                <th className="w-14" >Return Qty</th>
                                                <th className="w-14 border-x-1 border-black" >Return Amount</th>
                                                <th className="w-7" >Return Vat</th>
                                                <th className="w-14 border-x-1 border-black" >Return SD</th>
                                                <th className="w-7" >Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>

                                    <table className='mt-4'>

                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Total Vat(BDT)</strong></td>
                                            <td align="left"><strong><input type='text' id='vatTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Total SD(BDT)</strong></td>
                                            <td align="left"><strong id=""><input type='text' id='sdTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Total Amount(BDT)</strong></td>
                                            <td align="left"><strong><input type="text" id="amountTotal" disabled /></strong>
                                                <p></p>
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    <label htmlFor="userName" className='col-span-1 text-sm'>Note</label>
                                    <textarea id="userName" placeholder="Notes..." className="form-input py-2.5 text-sm col-span-4" onChange={(e) => setNote(e.target.value)} />
                                </div>

                                <div className="flex items-center justify-center gap-6 pt-4">
                                    <button type="submit" className="btn btn-success gap-2" >
                                        <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Submit
                                    </button>
                                    <Link to="/pages/sales/creditNote/index"><button type="button" className="btn btn-danger gap-2" >
                                        <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Cancel
                                    </button></Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDebitNote;


