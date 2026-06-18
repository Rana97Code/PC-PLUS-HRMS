import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useEffect, useState, useRef } from 'react';
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
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

    interface suppliers {
        id: number;
        supplierName: string;
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

    const [all_suppliers, setAllSupplier] = useState<suppliers[]>([]);
    const [all_suggestitm, setSuggestItem] = useState<suggestItem[]>([]);
    const [itemDetails, setItemDetails] = useState<detailsItem[]>([]);
    const [supplierId, setSupplierId] = useState("");

    const [purchaseDetails, setPurchaseDetails] = useState([]);
    const [effectiveDate, setEffectiveDate] = useState(getTodayDate());

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

            axios.get('http://localhost:8080/bmitvat/api/issueVds/issueVdsSupplier', { headers })
                .then((response) => {
                    setAllSupplier(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);

                });

        }
    }, []);



    const getSupplierId: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedOptionId = event.target.value;
        setSupplierId(selectedOptionId);
        const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
        dataTable.innerHTML = '';
        const suggestionsList = document.getElementById('chalanList');


        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get(`http://localhost:8080/bmitvat/api/debit_note/get_supplier_chalan/${selectedOptionId}`, { headers })
                .then((response) => {
                    const data = response.data;

                    if (data) {
                        if (suggestionsList instanceof HTMLSelectElement) {
                            let appendedIds: string[] = [];
                            let optionsHTML = '<option>Please Select</option>';

                            data.forEach((suggestion: any) => {
                                if (!appendedIds.includes(suggestion.id)) {
                                    optionsHTML += `<option value="${suggestion.id}">${suggestion.vendorInvoice}</option>`;
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

            suggestionsList.addEventListener('change', function () {
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

            axios.get(`http://localhost:8080/bmitvat/api/issueVds/get_chalan_purchase/${selectedOptionId}`, { headers })
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

        dataArray.forEach((data: any) => {

            const inputId = document.createElement('input');
            inputId.type = 'hidden';
            inputId.name = 'purchaseId';
            inputId.value = data.id;
            inputId.autocomplete = 'off';
            inputId.disabled = true;
            inputId.style.cssText = 'width: 1px;';

            const invoice = document.createElement('input');
            invoice.type = 'text';
            invoice.name = 'vendorInvoice';
            invoice.value = data.vendorInvoice;
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
            input2.value = data.totalTax;
            input2.autocomplete = 'off';
            input2.disabled = true;
            input2.min = '0';
            input2.style.cssText = 'border: 1px solid black; width: 100px;';

            const input3 = document.createElement('input');
            input3.type = 'number';
            input3.name = 'vds';
            input3.className = 'vds';
            input3.value = data.totalTax;
            input3.autocomplete = 'off';
            input3.disabled = true;
            input3.min = '0';
            input3.style.cssText = 'border: 1px solid black; width: 100px;';

            const input4 = document.createElement('input');
            input4.type = 'number';
            input4.name = 'paymentAmount';
            input4.className = 'payment';
            input4.value = '';
            input4.autocomplete = 'off';
            input4.min = '0';
            input4.step = '0.01';
            input4.style.cssText = 'border: 1px solid black; width: 150px;';

            const input5 = document.createElement('input');
            input5.type = 'date';
            input5.name = 'paymentDate';
            input5.value = effectiveDate;
            input5.autocomplete = 'off';
            input5.style.cssText = 'border: 1px solid black; width: 100px;';

            const input6 = document.createElement('input');
            input6.type = 'text';
            input6.name = 'accountNo';
            input6.value = '';
            input6.autocomplete = 'off';
            input6.style.cssText = 'border: 1px solid black; width: 160px;';

            const input7 = document.createElement('input');
            input7.type = 'text';
            input7.name = 'bankChalanSerial';
            input7.value = '';
            input7.autocomplete = 'off';
            input7.style.cssText = 'border: 1px solid black; width: 160px;';

            const input8 = document.createElement('input');
            input8.type = 'text';
            input8.name = 'bankName';
            input8.value = '';
            input8.autocomplete = 'off';
            input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';

            const input9 = document.createElement('input');
            input9.type = 'text';
            input9.name = 'branchName';
            input9.value = '';
            input9.autocomplete = 'off';
            input9.style.cssText = 'border: 1px solid black; width: 100px;';

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
                const inputs = document.querySelectorAll(`.payment`) as NodeListOf<HTMLInputElement>;

                if (inputs) {
                    inputs.forEach((input: HTMLInputElement) => {
                        const value = parseFloat(input.value) || 0;
                        payAmountTotal += value;
                    });

                    const amountTotalInput = document.getElementById('paymentTotal') as HTMLInputElement | null;
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
            cell10.appendChild(removeButton);

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
                    rowData[inputElement.name || 'purchaseId'] = inputElement.value;
                    rowData[inputElement.name || 'vendorInvoice'] = inputElement.value;
                    rowData[inputElement.name || 'chalanDate'] = inputElement.value;
                    rowData[inputElement.name || 'totalAmount'] = inputElement.value;
                    rowData[inputElement.name || 'vat'] = inputElement.value;
                    rowData[inputElement.name || 'vds'] = inputElement.value;
                    rowData[inputElement.name || 'paymentAmount'] = inputElement.value;
                    rowData[inputElement.name || 'paymentDate'] = inputElement.value;
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
        const AllTotal = document.getElementById('amountTotal') as HTMLInputElement;
        const TotalVat = document.getElementById('vatTotal') as HTMLInputElement;
        const TotalVDS = document.getElementById('vdsTotal') as HTMLInputElement;
        const TotalPayment = document.getElementById('paymentTotal') as HTMLInputElement;


        if (TotalVat || TotalVDS || AllTotal || TotalPayment) {
            const Vat = TotalVat.value;
            const VDS = TotalVDS.value;
            const ALL = AllTotal.value;
            const payTotal = TotalPayment.value;

            const purchase = {
                supplierId: supplierId,
                effectiveDate: effectiveDate,
                vdsItemsArray: arrayData,
                totalVat: Vat,
                totalVds: VDS,
                amountTotal: ALL,
                paymentTotal: payTotal,
                note: note
            }
            console.log(purchase);
            // exit;
            const token = localStorage.getItem('Token');
            if (token) {
                const bearer = JSON.parse(token);
                const headers = { Authorization: `Bearer ${bearer}` }
                try {
                    await axios.post("http://localhost:8080/bmitvat/api/issueVds/add-issue-vds", purchase, { headers })
                        .then(function (response) {
                            navigate("/pages/procurment/issueVds/index");
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
                <h2 className="text-xl font-bold">Issue VDS</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className="mb-5">
                    <div className="panel" id="browser_default">
                        <div className="flex items-center justify-between mb-7">
                            <h5 className="font-semibold text-lg dark:text-white-light">Add New Issue VDS</h5>
                        </div>
                        <div className="mb-5">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                                    <div>
                                        <label htmlFor="getSupplier">Supplier</label>
                                        <select id="getSupplier" onChange={getSupplierId} className="form-select text-dark col-span-4 text-sm" required >
                                            <option>Select Supplier</option>
                                            {all_suppliers.map((option, index) => (
                                                <option key={index} value={option.id}>
                                                    {option.supplierName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="effecDate">Effective Date</label>
                                        <input id="effecDate" type="date" className="form-input" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                                    </div>
                                </div>
                                <div className="border overflow-hidden overflow-x-auto">
                                    <table id="dataTable" className="whitespace-nowrap table-hover border dataTable">
                                        <thead>
                                            <tr className="whitespace-nowrap border overflow-x-auto">
                                            <th className="w-1"></th>
                                                <th className="w-14" >Invoice No</th>
                                                <th className="w-9 border-black" >Challan Date</th>
                                                <th className="w-9" >Amount</th>
                                                <th className="w-10 border-x-1 border-black" >VAT Amount</th>
                                                <th className="w-6" >Deducted VAT</th>
                                                <th className="w-9 border-x-1 border-black" >Payment Amount</th>
                                                <th className="w-14" >Payment Date</th>
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
                                </div>

                                <table className='mt-4'>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5 pr-4" align="right"><strong>Total Amount(BDT)</strong></td>
                                            <td align="left" className='pl-4'><strong><input type="text" id="amountTotal" disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5 pr-4" align="right"><strong>Total VAT(BDT)</strong></td>
                                            <td align="left" className='pl-4'><strong><input type='text' id='vatTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5 pr-4" align="right"><strong>Total VDS(BDT)</strong></td>
                                            <td align="left" className='pl-4'><strong id=""><input type='text' id='vdsTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5 pr-4" align="right"><strong>Total Payment(BDT)</strong></td>
                                            <td align="left" className='pl-4'><strong id=""><input type='text' id='paymentTotal' disabled /></strong></td>
                                        </tr>
                                    </table>

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


