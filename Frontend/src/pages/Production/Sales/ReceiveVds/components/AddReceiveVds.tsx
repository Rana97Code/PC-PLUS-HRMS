import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useEffect, useState, useRef } from 'react';
import IconFile from '../../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../../components/Icon/IconTrashLines';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';
import { exit } from 'process';


const AddIssueVds: React.FC = () => {
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
    const [customerId, setCustomerId] = useState("");

    const [entryDate, setEntryDate] = useState(getTodayDate());

    const [note, setNote] = useState('');
    const [amountTotal, setTotalAmount] = useState('');
    const [totalVat, setTotalVat] = useState('');
    const [totalSd, setTotalVSD] = useState('');
    const [paymentTotal, setTotalPayment] = useState('');


    useEffect(() => {

        const token = localStorage.getItem('Token');

        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get('http://localhost:8080/bmitvat/api/receiveVds/receiveVdsCustomer', { headers })
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
        const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
        dataTable.innerHTML = '';
        const suggestionsList = document.getElementById('chalanList');


        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get(`http://localhost:8080/bmitvat/api/receiveVds/get_customer_chalan/${selectedOptionId}`, { headers })
                .then((response) => {
                    const data = response.data;

                    if(data){
                    if (suggestionsList instanceof HTMLSelectElement) {
                        let appendedIds: string[] = [];
                        let optionsHTML = '<option>Please Select</option>';
                                    
                        data.forEach((suggestion: any) => {
                            if (!appendedIds.includes(suggestion.id)) {
                                optionsHTML += `<option value="${suggestion.id}">${suggestion.salesInvoice}</option>`;
                            }
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
                                const selectedOptionId = event.target.value;
                                console.log(selectedOptionId);

                                const suggestionsList = document.getElementById('chalanList');
                                if (suggestionsList instanceof HTMLSelectElement) {

                                    suggestionsList.addEventListener('change', function() {
                                        const options = suggestionsList.options;
                                
                                        // Iterate through options to find the one with matching value
                                        for (let i = 0; i < options.length; i++) {
                                            if (options[i].value === selectedOptionId) {
                                                options[i].style.display = 'none'; // Hide the option
                                                break; // Exit loop once the option is found and hidden
                                            }
                                        }
                                    });
                        
                                }


                                const token = localStorage.getItem('Token');
                                if (token) {
                                    const bearer = JSON.parse(token);
                                    const headers = { Authorization: `Bearer ${bearer}` }

                                    axios.get(`http://localhost:8080/bmitvat/api/receiveVds/get_chalan_sales/${selectedOptionId}`, { headers })
                                        .then((response) => {
                                            const data = response.data;
                                            addRow(data);
                                        })
                                        .catch((error) => {
                                            console.error('Error fetching data:', error);
                                        });
                                }
                            };




                            function addRow(dataArray: any) {
                                const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
                                console.log(dataArray);
                                // console.log(dataArray.vendorInvoice);
                                // dataTable.innerHTML = '';
                                const arrayData: any[] = [];

                                        dataArray.forEach((data: any)=> {

                                        const inputId = document.createElement('input');
                                        inputId.type = 'hidden';
                                        inputId.name = 'salesId';
                                        inputId.value = data.id;
                                        inputId.autocomplete = 'off';
                                        inputId.disabled = true;
                                        inputId.style.cssText = 'width: 1px;';
                                                                                
                                        const invoice = document.createElement('input');
                                        invoice.type = 'text';
                                        invoice.name = 'salesInvoice';
                                        invoice.value = data.salesInvoice;
                                        invoice.autocomplete = 'off';
                                        invoice.disabled = true;
                                        invoice.style.cssText = 'border: 1px solid black; width: 180px;';

                                        const input = document.createElement('input');
                                        input.type = 'text';
                                        input.name = 'chalanDate';
                                        const chalanDate = new Date(data.chalanDate);
                                        const formattedDate = chalanDate.toLocaleDateString();
                                        input.value = formattedDate;
                                        input.autocomplete = 'off';
                                        input.disabled = true;
                                        input.style.cssText = 'border: 1px solid black; width: 180px;';

                                        const input1 = document.createElement('input');
                                        input1.type = 'number';
                                        input1.name = 'totalAmount';
                                        input1.className = 'totalAmount';
                                        input1.value = data.grandTotal;
                                        input1.autocomplete = 'off';
                                        input1.disabled = true;
                                        input1.min = '0';
                                        input1.style.cssText = 'border: 1px solid black; width: 100px;';

                                        const input2 = document.createElement('input');
                                        input2.type = 'number';
                                        input2.name = 'vat';
                                        input2.className = 'vat';
                                        input2.value = data.totalVat;
                                        input2.autocomplete = 'off';
                                        input2.disabled = true;
                                        input2.min = '0';
                                        input2.style.cssText = 'border: 1px solid black; width: 100px;';

                                        const input3 = document.createElement('input');
                                        input3.type = 'number';
                                        input3.name = 'vds';
                                        input3.className = 'vds';
                                        input3.value = data.totalVat;
                                        input3.autocomplete = 'off';
                                        input3.disabled = true;
                                        input3.min = '0';
                                        input3.style.cssText = 'border: 1px solid black; width: 100px;';

                                        const input4 = document.createElement('input');
                                        input4.type = 'number';
                                        input4.name = 'receiveQty';
                                        input4.className = 'receiveQty';
                                        input4.value = '';
                                        input4.autocomplete = 'off';
                                        input4.min = '0';
                                        input4.step = '0.01';
                                        input4.style.cssText = 'border: 1px solid black; width: 150px;';

                                        const input5 = document.createElement('input');
                                        input5.type = 'number';
                                        input5.name = 'receiveAmount';
                                        input5.className = 'receiveAmount';
                                        input5.value = '';
                                        input5.autocomplete = 'off';
                                        input5.min = '0';
                                        input5.step = '0.01';
                                        input5.style.cssText = 'border: 1px solid black; width: 150px;';

                                        const input6 = document.createElement('input');
                                        input6.type = 'date';
                                        input6.name = 'receiveDate';
                                        input6.value = entryDate;
                                        input6.autocomplete = 'off';
                                        input6.style.cssText = 'border: 1px solid black; width: 100px;';

                                        const input7 = document.createElement('input');
                                        input7.type = 'text';
                                        input7.name = 'accountNo';
                                        input7.value = '';
                                        input7.autocomplete = 'off';
                                        input7.style.cssText = 'border: 1px solid black; width: 160px;';

                                        const input8 = document.createElement('input');
                                        input8.type = 'text';
                                        input8.name = 'bankChalanSerial';
                                        input8.value = '';
                                        input8.autocomplete = 'off';
                                        input8.style.cssText = 'border: 1px solid black; width: 160px;';

                                        const input9 = document.createElement('input');
                                        input9.type = 'text';
                                        input9.name = 'bankName';
                                        input9.value = '';
                                        input9.autocomplete = 'off';
                                        input9.style.cssText = 'border: 1px solid black; width: 100px; display:block;';

                                        const input10 = document.createElement('input');
                                        input10.type = 'text';
                                        input10.name = 'branchName';
                                        input10.value = '';
                                        input10.autocomplete = 'off';
                                        input10.style.cssText = 'border: 1px solid black; width: 100px;';
                                        
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


                                        input4.addEventListener('keyup', calculateTotalValue);
                                        // input2.addEventListener('keyup', calculateTotalValue);

                                        function calculateTotalValue() {

                                            const value1 = parseFloat(input1.value) || 0;
                                            const value4 = parseFloat(input4.value) || 0;

                                            const returnAmount = value1 * value4;
                                            input5.value = returnAmount.toString();
                                            
                                            // Grand Total VAT Calculation
                                            let amountTotal = 0;
                                            const amountInput = document.querySelectorAll(`.totalAmount`) as NodeListOf<HTMLInputElement>;

                                            if (amountInput) {
                                                amountInput.forEach((input: HTMLInputElement) => {
                                                    const value = parseFloat(input.value) || 0;
                                                    amountTotal += value;
                                                });

                                                const amountTotalId = document.getElementById('amountTotal') as HTMLInputElement | null;
                                                if (amountTotalId !== null) {
                                                    amountTotalId.value = amountTotal.toString();
                                                }
                                            }

                                            // Grand Total VAT Calculation
                                            let amountTotalVat = 0;
                                            const VatInput = document.querySelectorAll(`.vat`) as NodeListOf<HTMLInputElement>;

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

                                            // Grand Total vds Calculation
                                            let amountTotalSd = 0;
                                            const SdInput = document.querySelectorAll(`.vds`) as NodeListOf<HTMLInputElement>;

                                            if (SdInput) {
                                                SdInput.forEach((input: HTMLInputElement) => {
                                                    const value = parseFloat(input.value) || 0;
                                                    amountTotalSd += value;
                                                });

                                                const amountTotalSdInput = document.getElementById('vdsTotal') as HTMLInputElement | null;
                                                if (amountTotalSdInput !== null) {
                                                    amountTotalSdInput.value = amountTotalSd.toString();
                                                }
                                            }

                                            // Grand Total Amount Calculation
                                            let payAmountTotal = 0;
                                            const inputs = document.querySelectorAll(`.receiveAmount`) as NodeListOf<HTMLInputElement>;

                                            if (inputs) {
                                                inputs.forEach((input: HTMLInputElement) => {
                                                    const value = parseFloat(input.value) || 0;
                                                    payAmountTotal += value;
                                                });

                                                const amountTotalInput = document.getElementById('receivedTotal') as HTMLInputElement | null;
                                                if (amountTotalInput !== null) {
                                                    amountTotalInput.value = payAmountTotal.toString();
                                                }
                                            }

                                        }
                                        const newRow = dataTable.insertRow();
                                        
                                        const cellInvoice = newRow.insertCell();
                                        cellInvoice.appendChild(invoice);

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
                                        const cell6 = newRow.insertCell();
                                        cell6.appendChild(input6);
                                        const cell7 = newRow.insertCell();
                                        cell7.appendChild(input7);
                                        const cell8 = newRow.insertCell();
                                        cell8.appendChild(input8);
                                        const cell9 = newRow.insertCell();
                                        cell9.appendChild(input9);
                                        const cell10 = newRow.insertCell();
                                        cell10.appendChild(input10);
                                        const cell11 = newRow.insertCell();
                                        cell11.appendChild(removeButton);
                                    });

                                  
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
                    rowData[inputElement.name || 'customerId'] = inputElement.value;
                    rowData[inputElement.name || 'salesInvoice'] = inputElement.value;
                    rowData[inputElement.name || 'chalanDate'] = inputElement.value;
                    rowData[inputElement.name || 'totalAmount'] = inputElement.value;
                    rowData[inputElement.name || 'vat']         = inputElement.value;
                    rowData[inputElement.name || 'vds']         = inputElement.value;
                    rowData[inputElement.name || 'receiveQty'] = inputElement.value;
                    rowData[inputElement.name || 'receiveAmount'] = inputElement.value;
                    rowData[inputElement.name || 'receiveDate'] = inputElement.value;
                    rowData[inputElement.name || 'accountNo'] = inputElement.value;
                    rowData[inputElement.name || 'bankChalanSerial'] = inputElement.value;
                    rowData[inputElement.name || 'bankName'] = inputElement.value;
                    rowData[inputElement.name || 'branchName'] = inputElement.value;
                });
                arrayData.push(rowData);

            });

        } else {
            console.error("Could not find #dataTable tbody element");
        }
        // const jsonAllItemsData = JSON.stringify(arrayData);
        const vdsCertificateNo = document.getElementById('vdsCertificate') as HTMLInputElement;
        const AllTotal = document.getElementById('amountTotal') as HTMLInputElement;
        const TotalVat = document.getElementById('vatTotal') as HTMLInputElement;
        const TotalVDS = document.getElementById('vdsTotal') as HTMLInputElement;
        const TotalReceive = document.getElementById('receivedTotal') as HTMLInputElement;


        if (vdsCertificateNo || TotalVat || TotalVDS || AllTotal || TotalReceive) {
            const vcNo = vdsCertificateNo.value;
            const Vat = TotalVat.value;
            const VDS = TotalVDS.value;
            const ALL = AllTotal.value;
            const receiveTotal = TotalReceive.value;

            const purchase = {
                customerId: customerId,
                vdsCertificateNo: vcNo,
                entryDate: entryDate,
                vdsItemsArray: arrayData,
                totalVat: Vat,
                totalVds: VDS,
                amountTotal: ALL,
                receiveTotal: receiveTotal,
                note: note
            }
            console.log(purchase);
            // exit;
            const token = localStorage.getItem('Token');
            if (token) {
                const bearer = JSON.parse(token);
                const headers = { Authorization: `Bearer ${bearer}` }
                try {
                    await axios.post("http://localhost:8080/bmitvat/api/receiveVds/add_receive_vds", purchase, { headers })
                        .then(function (response) {
                            navigate("/pages/sales/receiveVds/index");
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
                <h2 className="text-xl font-bold">Receive VDS</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className="mb-5">
                    <div className="panel" id="browser_default">
                        <div className="flex items-center justify-between mb-7">
                            <h5 className="font-semibold text-lg dark:text-white-light">Add New Receive VDS</h5>
                        </div>
                        <div className="mb-5">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                                    <div>
                                        <label htmlFor="getCustomer">Customers</label>
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
                                        <label htmlFor="Certificate">VDS Certificate No</label>
                                        <input id="vdsCertificate" type="text" className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="browserLname">Entry Date</label>
                                        <input id="browserLname" type="date" className="form-input" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
                                    </div>
                                </div>
                                <div className="border overflow-hidden overflow-x-auto">
                                    <table id="dataTable" className="whitespace-nowrap table-hover border dataTable">
                                        <thead>
                                            <tr className="whitespace-nowrap border overflow-x-auto">
                                                <th className="w-14" >Invoice No</th>
                                                <th className="w-0" ></th>
                                                <th className="w-9 border-black" >Challan Date</th>
                                                <th className="w-9" >Amount</th>
                                                <th className="w-10 border-x-1 border-black" >Vat Amount</th>
                                                <th className="w-6" >Deducted Vat</th>
                                                <th className="w-6 border-x-1 border-black" >Receive Quantity</th>
                                                <th className="w-14 border-x-1 border-black" >Receive Value</th>
                                                <th className="w-14" >Receive Date</th>
                                                <th className="w-14 border-x-1 border-black" >Account Code</th>
                                                <th className="w-7" >Bank Challan Serial</th>
                                                <th className="w-14 border-x-1 border-black" >Bank Name</th>
                                                <th className="w-7" >Branch Name</th>
                                                <th className="w-14 border-x-1 border-black" >Action</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        </tbody>
                                    </table>

                                    <table className='mt-4'>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Total Amount(BDT)</strong></td>
                                            <td align="left"><strong><input type="text" id="amountTotal" disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Total Vat(BDT)</strong></td>
                                            <td align="left"><strong><input type='text' id='vatTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Total VDS(BDT)</strong></td>
                                            <td align="left"><strong id=""><input type='text' id='vdsTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Total Received(BDT)</strong></td>
                                            <td align="left"><strong id=""><input type='text' id='receivedTotal' disabled /></strong></td>
                                        </tr>
                                    </table>
                                </div>

                                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                    {/* <input type="hidden" name="allPurchaseItems" id="allPurchaseItems" /> */}
                                    <label htmlFor="userName" className='col-span-1 text-sm'>Note</label>
                                    <textarea id="userName" placeholder="Notes..." className="form-input py-2.5 text-sm col-span-4" onChange={(e) => setNote(e.target.value)} />
                                </div>

                                <div className="flex items-center justify-center gap-6 pt-4">
                                    <button type="submit" className="btn btn-success gap-2" >
                                        <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Submit
                                    </button>
                                    <Link to="/pages/procurment/issueVds/index"><button type="button" className="btn btn-danger gap-2" >
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

export default AddIssueVds;


