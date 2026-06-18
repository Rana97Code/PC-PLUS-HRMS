import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useEffect, useState, useRef } from 'react';
import IconFile from '../../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../../components/Icon/IconTrashLines';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import * as $ from 'jquery';
import { number } from 'yup';


const AddLocalSales: React.FC = () => {
    const navigate = useNavigate();


    // Function to get today's date in the format "YYYY-MM-DD"
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [dateValue, setDateValue] = useState(getTodayDate());

    interface customers {
        id: number;
        customerName: string;
        customerAddress: string;
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

    const [all_customers, setAllCustomer] = useState<customers[]>([]);
    const [all_suggestitm, setSuggestItem] = useState<suggestItem[]>([]);
    const [itemDetails, setItemDetails] = useState<detailsItem[]>([]);
    const [customerAddress, setAddress] = useState("");

    const [customer, setCustomer] = useState("");
    const [vehicleInfo, setvehicleInfo] = useState("");
    const [destination, setDestination] = useState("");


    const [note, setNote] = useState('');
    // const [totalVat, setTotalVat] = useState('');
    // const [totalSd, setTotalSD] = useState('');
    // const [amountTotal, setTotalAmount] = useState('');
    // const [discountGrand, setGrandDiscount] = useState('');
    // const [totalGrand, setGrandTotal] = useState('');


    useEffect(() => {

        const token = localStorage.getItem('Token');

        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get('http://localhost:8080/bmitvat/api/customer/all_customer', { headers })
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

        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get(`http://localhost:8080/bmitvat/api/customer/get_customer/${selectedOptionId}`, { headers })
                .then((response) => {
                    const data = response.data;
                    setCustomer(data.id)
                    setAddress(data.customerAddress)

                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    };



    async function getItemByKeyUp(event: React.FormEvent<HTMLInputElement>) {


        const searchInput = event.currentTarget as HTMLInputElement;
        const suggestionsList = document.getElementById('suggestionsList');

        if (suggestionsList) {
            suggestionsList.style.display = 'block';
        }

        if (!suggestionsList) {
            return;
        }

        if (searchInput.value.trim() === '') {
            suggestionsList.innerHTML = '';
            return;
        }
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }

            const searchTerm = searchInput.value;
            try {
                const response = await axios.post('http://localhost:8080/bmitvat/api/item/getLocalSalesItemSuggestions', searchTerm, { headers });
                const suggestions = response.data;
                setSuggestItem(suggestions);

                suggestionsList.innerHTML = '';
                all_suggestitm.forEach(suggestion => {

                    const listItem = document.createElement('li');
                    listItem.style.width = '500px';
                    listItem.style.padding = '10px';
                    listItem.className = 'suggestion-item';
                    listItem.value = suggestion.id;
                    listItem.textContent = suggestion.itemName;
                    suggestionsList.appendChild(listItem);
                });


                const selectedLiElements = document.querySelectorAll('.suggestion-item');
                selectedLiElements.forEach(async (liElement) => {

                    liElement.addEventListener('click', () => {
                        const clickedValue = (liElement as HTMLLIElement).value;
                        const liElementTyped = liElement as HTMLElement;
                        liElementTyped.style.backgroundColor = 'green';

                        // Now 'clickedValue' contains the value of the clicked li element
                        // console.log('Clicked Item ID:', clickedValue);
                        if (suggestionsList) {
                            suggestionsList.style.display = 'none';
                        }

                        if (clickedValue > 0) {


                            const token = localStorage.getItem('Token');
                            if (token) {
                                const bearer = JSON.parse(token);
                                const headers = { Authorization: `Bearer ${bearer}` }

                                axios.get(`http://localhost:8080/bmitvat/api/sales/get_item_details/${clickedValue}`, { headers })
                                    .then((response) => {
                                        const data = response.data;
                                        setItemDetails(data);
                                        addRow(data);
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching data:', error);
                                    });
                            }



                            function addRow(data: any) {
                                const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;

                                const arrayData: any[] = [];

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
                                input.style.cssText = 'width: 180px;';

                                const input1 = document.createElement('input');
                                input1.type = 'number';
                                input1.name = 'availableQty';
                                input1.className = '';
                                input1.value = data.qty;
                                input1.id = 'qtyId';
                                input1.disabled = true;
                                input1.autocomplete = 'off';
                                input1.min = '0';
                                input1.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input2 = document.createElement('input');
                                input2.type = 'number';
                                input2.name = 'salesQty';
                                input2.className = 'salesQtyClass';
                                input2.value = '';
                                input1.id = 'salesQty';
                                input2.autocomplete = 'off';
                                input2.min = '0';
                                input2.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input3 = document.createElement('input');
                                input3.type = 'number';
                                input3.name = 'salesRate';
                                input3.className = '';
                                input3.value = data.salesPrice;
                                input3.autocomplete = 'off';
                                input3.disabled = true;
                                input3.min = '0';
                                input3.style.cssText = 'border: 1px solid black; width: 150px;';

                                const input4 = document.createElement('input');
                                input4.type = 'number';
                                input4.name = 'primaryValue';
                                input4.className = '';
                                input4.value = '';
                                input4.autocomplete = 'off';
                                input4.disabled = true;
                                input4.min = '0';
                                input4.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input5 = document.createElement('input');
                                input5.type = 'number';
                                input5.name = 'discountRate';
                                input5.className = 'discount';
                                input5.value = '';
                                input5.autocomplete = 'off';
                                input5.min = '0';
                                input5.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input6 = document.createElement('input');
                                input6.type = 'number';
                                input6.name = 'discountAmount';
                                input6.className = 'discount_amount';
                                input6.value = '';
                                input6.autocomplete = 'off';
                                input6.disabled = true;
                                input6.min = '0';
                                input6.style.cssText = 'border: 1px solid black; width: 160px;';

                                const input7 = document.createElement('input');
                                input7.type = 'number';
                                input7.name = 'valueAfterDiscount';
                                input7.className = '';
                                input7.value = '';
                                input7.autocomplete = 'off';
                                input7.disabled = true;
                                input7.min = '0';
                                input7.style.cssText = 'border: 1px solid black; width: 160px;';
                                
                                const input8 = document.createElement('input');
                                input8.type = 'number';
                                input8.name = 'sdRate';
                                input8.className = '';
                                input8.value = data.sd;
                                input8.autocomplete = 'off';
                                input8.disabled = true;
                                input8.min = '0';
                                input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';

                                const input9 = document.createElement('input');
                                input9.type = 'number';
                                input9.name = 'sdValue';
                                input9.className = 'sd_amount';
                                input9.value = '';
                                input9.autocomplete = 'off';
                                input9.disabled = true;
                                input9.min = '0';
                                input9.style.cssText = 'border: 1px solid black; width: 100px;';

                                
                                const input10 = document.createElement('input');
                                input10.type = 'number';
                                input10.name = 'vatableValue';
                                input10.className = 'vatableValue';
                                input10.value = '';
                                input10.autocomplete = 'off';
                                input10.disabled = true;
                                input10.min = '0';
                                input10.style.cssText = 'border: 1px solid black; width: 100px;';
                                                        

                                const selectElement = document.createElement('select');
                                selectElement.name = 'selectedVat';
                                selectElement.className = '';
                                selectElement.style.cssText = 'border: 1px solid black; width: 180px;';

                                const option0 = document.createElement('option');
                                option0.value = 'null';
                                option0.selected = true;
                                option0.textContent = 'Select Vat %';
                                selectElement.appendChild(option0);

                                const option1 = document.createElement('option');
                                option1.value = '1';
                                option1.textContent = 'Standard Rate(15%)';
                                selectElement.appendChild(option1);

                                const option2 = document.createElement('option');
                                option2.value = '2';
                                option2.textContent = 'Exempted';
                                selectElement.appendChild(option2);

                                const option3 = document.createElement('option');
                                option3.value = '3';
                                option3.textContent = 'Specific';
                                selectElement.appendChild(option3);

                                const option4 = document.createElement('option');
                                option4.value = '4';
                                option4.textContent = 'Other Than Standard Rate';
                                selectElement.appendChild(option4);

                                const option5 = document.createElement('option');
                                option5.value = '5';
                                option5.textContent = 'MRP';
                                selectElement.appendChild(option5);

                                const option6 = document.createElement('option');
                                option6.value = '6';
                                option6.textContent = 'Retail/Whole Sale/Trade Base';
                                selectElement.appendChild(option6);

                                selectElement.addEventListener('change', () => {
                                    const selectedValue = selectElement.value;
                                    if (selectedValue == '1') {
                                        inputVatRate.value = '15';
                                        inputVatRate.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '2') {
                                        inputVatRate.value = '0';
                                        inputVatRate.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '3') {
                                        inputVatRate.value = '0';
                                        inputVatRate.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '4') {
                                        inputVat.style.cssText = 'display:none;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        inputVatRate.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                    } if (selectedValue == '5') {
                                        inputVatRate.value = '';
                                        inputVatRate.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '6') {
                                        inputVatRate.value = '4';
                                        inputVatRate.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    }
                                    console.log('Selected Value:', selectedValue);
                                });


                                const selectStandard = document.createElement('select');
                                selectStandard.name = 'tradingType';
                                selectStandard.className = '';
                                selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';

                                const optionSt0 = document.createElement('option');
                                optionSt0.value = 'null';
                                optionSt0.selected = true;
                                optionSt0.textContent = 'Select Vat';
                                selectStandard.appendChild(optionSt0);

                                const optionSt1 = document.createElement('option');
                                optionSt1.value = '1';
                                optionSt1.textContent = 'COMMERCIAL IMPORT(5%)';
                                selectStandard.appendChild(optionSt1);

                                const optionSt2 = document.createElement('option');
                                optionSt2.value = '2';
                                optionSt2.textContent = 'Petrolium/Lpg/Others(2%)';
                                selectStandard.appendChild(optionSt2);

                                const optionSt3 = document.createElement('option');
                                optionSt3.value = '3';
                                optionSt3.textContent = 'Super Shop(5%)';
                                selectStandard.appendChild(optionSt3);

                                const optionSt4 = document.createElement('option');
                                optionSt4.value = '4';
                                optionSt4.textContent = 'Medicine Related(2.4%)';
                                selectStandard.appendChild(optionSt4);

                                const optionSt5 = document.createElement('option');
                                optionSt5.value = '5';
                                optionSt5.textContent = 'Gas Supply & Distribution(2.4%)';
                                selectStandard.appendChild(optionSt5);


                                selectStandard.addEventListener('change', () => {
                                    const selectStand = selectStandard.value;
                                    if (selectStand == '1') {
                                        inputVatRate.value = '5';
                                    } if (selectStand == '2') {
                                        inputVatRate.value = '2';
                                    } if (selectStand == '3') {
                                        inputVatRate.value = '5';
                                    } if (selectStand == '4') {
                                        inputVatRate.value = '2.4';
                                    } if (selectStand == '5') {
                                        inputVatRate.value = '2.4';
                                    }

                                })

                                const inputVat = document.createElement('input');
                                inputVat.type = 'number';
                                inputVat.name = 'tType';
                                inputVat.className = '';
                                inputVat.value = '';
                                inputVat.autocomplete = 'off';
                                inputVat.disabled = true;
                                inputVat.min = '0';
                                inputVat.style.cssText = 'border: 1px solid black; width: 100px; display:block;';

                                const inputVatRate = document.createElement('input');
                                inputVatRate.type = 'number';
                                inputVatRate.name = 'vatRate';
                                inputVatRate.className = 'vatRate';
                                inputVatRate.value = data.vat;
                                inputVatRate.autocomplete = 'off';
                                inputVatRate.disabled = true;
                                inputVatRate.min = '0';
                                inputVatRate.style.cssText = 'border: 1px solid black; width: 100px;';

                                const inputVatAmount = document.createElement('input');
                                inputVatAmount.type = 'number';
                                inputVatAmount.name = 'vatAmount';
                                inputVatAmount.className = 'vat_amount';
                                inputVatAmount.value = '';
                                inputVatAmount.autocomplete = 'off';
                                inputVatAmount.disabled = true;
                                inputVatAmount.min = '0';
                                inputVatAmount.style.cssText = 'border: 1px solid black; width: 180px;';

                                const selectVds = document.createElement('select');
                                selectVds.name = 'vds';
                                selectVds.className = '';
                                selectVds.style.cssText = 'border: 1px solid black; width: 180px;';

                                const optionV = document.createElement('option');
                                optionV.value = '1';
                                optionV.textContent = 'Yes';
                                selectVds.appendChild(optionV);

                                const optionV1 = document.createElement('option');
                                optionV1.value = '2';
                                optionV1.textContent = 'No';
                                selectVds.appendChild(optionV1);

                                const inputTotalAmount = document.createElement('input');
                                inputTotalAmount.type = 'number';
                                inputTotalAmount.name = 'totalSalesPrice';
                                inputTotalAmount.className = 'total_amount';
                                inputTotalAmount.value = '';
                                inputTotalAmount.autocomplete = 'off';
                                inputTotalAmount.disabled = true;
                                inputTotalAmount.min = '0';
                                inputTotalAmount.style.cssText = 'border: 1px solid black; width: 180px;';

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


                                //Calculations
                                                               
                                input2.addEventListener('keyup', calculateValue);
                                input5.addEventListener('keyup', calculateValue);

                                function calculateValue() {
                                    const value2 = parseFloat(input2.value) || 0;
                                    const value3 = parseFloat(input3.value) || 0;
                                    const value5 = parseFloat(input5.value) || 0;
                                    const value8 = parseFloat(input8.value) || 0;

                                    const onlyValue =value2 * value3;
                                    input4.value = onlyValue.toString();

                                    const discount = (onlyValue * value5) / 100
                                    input6.value = discount.toString();

                                    const afterDiscount = (onlyValue - discount)
                                    input7.value = afterDiscount.toString();

                                    //sd
                                    const sdWithValue = (afterDiscount * value8) / 100;
                                    input9.value = sdWithValue.toString();

                                    const vatAblValue = afterDiscount + sdWithValue;
                                    input10.value = vatAblValue.toString();

                                    // vat
                                    const vatAmout = (vatAblValue * parseFloat(inputVatRate.value)) / 100;
                                    inputVatAmount.value = vatAmout.toString();

                                    const totalAmount = (parseFloat(input10.value) + vatAmout);
                                    inputTotalAmount.value = totalAmount.toString();
                                }

                                
                                // //Both Select Calculation
                                selectElement.addEventListener('change', calculateVat1);
                                selectStandard.addEventListener('change', calculateVat1);
                                function calculateVat1() {
                                    const value1 = parseFloat(input10.value) || 0;

                                    const vat = (value1 * parseFloat(inputVatRate.value)) / 100;
                                    inputVatAmount.value = vat.toString();

                                    const totalAmout = (value1 + vat);
                                    inputTotalAmount.value = totalAmout.toString();
                                }

                                
                                input2.addEventListener('keyup', calculateTotalValue);
                                input5.addEventListener('keyup', calculateTotalValue);
                                selectElement.addEventListener('change', calculateTotalValue);
                                selectStandard.addEventListener('change', calculateTotalValue);

                                function calculateTotalValue() {
                                    // Grand Total VAT Calculation
                                    let amountTotalVat = 0;
                                    const VatInput = document.querySelectorAll(`.vat_amount`) as NodeListOf<HTMLInputElement>;

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
                                    const SdInput = document.querySelectorAll(`.sd_amount`) as NodeListOf<HTMLInputElement>;

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

                                    // Grand Total Discount Calculation
                                    let amountTotaldiscount = 0;
                                    const discountInput = document.querySelectorAll(`.discount_amount`) as NodeListOf<HTMLInputElement>;
                                     if (discountInput) {
                                        discountInput.forEach((input: HTMLInputElement) => {
                                            const value = parseFloat(input.value) || 0;
                                            amountTotaldiscount += value;
                                        });
                                         const amountTotalDiscount = document.getElementById('discountTotal') as HTMLInputElement | null;
                                        if (amountTotalDiscount !== null) {
                                            amountTotalDiscount.value = amountTotaldiscount.toString();
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

                                        const amountTotalInput = document.getElementById('grandTotal') as HTMLInputElement | null;
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
                                const cellVat = newRow.insertCell();
                                cellVat.appendChild(selectElement);
                                const cellVat1 = newRow.insertCell();
                                cellVat1.appendChild(inputVat);
                                cellVat1.appendChild(selectStandard);
                                const cellVatRate = newRow.insertCell();
                                cellVatRate.appendChild(inputVatRate);
                                const cellVatAmount = newRow.insertCell();
                                cellVatAmount.appendChild(inputVatAmount);
                                const cellVds = newRow.insertCell();
                                cellVds.appendChild(selectVds);
                                const cellTotal = newRow.insertCell();
                                cellTotal.appendChild(inputTotalAmount);
                                const cellRemove = newRow.insertCell();
                                cellRemove.appendChild(removeButton);
                            }

                        }
                    });
                });
            } catch (error) {
                console.error('Error fetching suggestions:', error);
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

                row.querySelectorAll('td input, td select').forEach((input) => {
                    const inputElement = input as HTMLInputElement;
                    const inputElementSelect = input as HTMLSelectElement;
                    const selectValue = inputElement.type === 'select-one' ? inputElementSelect.value : inputElement.value;
                    rowData[inputElement.name || 'itemId']             = inputElement.value;
                    rowData[inputElement.name || 'itemName']           = inputElement.value;
                    rowData[inputElement.name || 'availableQty']       = inputElement.value;
                    rowData[inputElement.name || 'salesQty']           = inputElement.value;
                    rowData[inputElement.name || 'salesRate']          = inputElement.value;
                    rowData[inputElement.name || 'primaryValue']       = inputElement.value;
                    rowData[inputElement.name || 'discountRate']       = inputElement.value;
                    rowData[inputElement.name || 'discountAmount']     = inputElement.value;
                    rowData[inputElement.name || 'valueAfterDiscount'] = inputElement.value;
                    rowData[inputElement.name || 'sdRate']             = inputElement.value;
                    rowData[inputElement.name || 'sdValue']            = inputElement.value;
                    rowData[inputElement.name || 'vatableValue']       = inputElement.value;
                    rowData[inputElement.name || 'selectedVat']        = selectValue;
                    rowData[inputElement.name || 'tradingType']        = selectValue;
                    rowData[inputElement.name || 'vatType']            = inputElement.value;
                    rowData[inputElement.name || 'vatRate']            = inputElement.value;
                    rowData[inputElement.name || 'vatAmount']          = inputElement.value;
                    rowData[inputElement.name || 'vds']                = selectValue;
                    rowData[inputElement.name || 'totalSalesPrice']    = inputElement.value;
                });
                arrayData.push(rowData);
            });

        } else {
            console.error("Could not find #dataTable tbody element");
        }
        // const jsonAllItemsData = JSON.stringify(arrayData);
        const TotalVat = document.getElementById('vatTotal') as HTMLInputElement;
        const TotalSD = document.getElementById('sdTotal') as HTMLInputElement;
        const TotalDiscount = document.getElementById('discountTotal') as HTMLInputElement;
        const GrandTotal = document.getElementById('grandTotal') as HTMLInputElement;


        if (TotalVat || TotalSD || TotalDiscount || GrandTotal) {
            const Vat = TotalVat.value;
            const SD = TotalSD.value;
            const Discount = TotalDiscount.value;
            const AllTotal = GrandTotal.value;

            const sales = {
                customerId: customer,
                customerAddress: customerAddress,
                salesDate: dateValue,
                vehicleInfo: vehicleInfo,
                destination: destination,
                salesItems: arrayData,
                totalTax: Vat,
                totalSd: SD,
                totalDiscount: Discount,
                grandTotal: AllTotal,
                note: note
            }
            console.log(sales);

            const token = localStorage.getItem('Token');
            if (token) {
                const bearer = JSON.parse(token);
                const headers = { Authorization: `Bearer ${bearer}` }
                try {
                    await axios.post("http://localhost:8080/bmitvat/api/sales/add_local_sales", sales, { headers })
                        .then(function (response) {
                            navigate("/pages/sales/local_sales/index");
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
                <h2 className="text-xl font-bold">Local Sales</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className="mb-5">
                    <div className="panel" id="browser_default">
                        <div className="flex items-center justify-between mb-7">
                            <h5 className="font-semibold text-lg dark:text-white-light">Add New Local Sales</h5>
                        </div>
                        <div className="mb-5">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                                    <div>
                                        <label htmlFor="getCustomer">Customer</label>
                                        <select id="getCustomer" onChange={getCustomerId} className="form-select text-dark col-span-4 text-sm" required >
                                            <option>Select Customer</option>
                                            {all_customers.map((option, index) => (
                                                <option key={index} value={option.id}>
                                                    {option.customerName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="browserLname">Customer Address</label>
                                        <input id="browserLname" type="text" value={customerAddress} className="form-input" onChange={(e) => setAddress(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="browserLname">Sales Date</label>
                                        <input id="browserLname" type="date" placeholder="" className="form-input" value ={dateValue} onChange={(e) => setDateValue(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="browserLname">Vehicle Info</label>
                                        <input id="browserLname" type="text" placeholder="" className="form-input" onChange={(e) => setvehicleInfo(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="browserLname">Destination</label>
                                        <input id="browserLname" type="text" placeholder="" className="form-input" onChange={(e) => setDestination(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap--x-2 gap-y-3">
                                    <label htmlFor="searchInput" className='col-span-1 text-sm'>Add Items</label>
                                    <input id="searchInput" type="text" placeholder="Enter Product Name" className="form-input py-2.5 text-sm col-span-2" onInput={getItemByKeyUp} />
                                    <ul style={{ cursor: 'pointer' }} className="mt-10 ml-20 w-1/2 absolute bg-slate-300" id="suggestionsList"></ul>
                                </div>
                                <div className="border overflow-hidden overflow-x-auto">
                                    <table id="dataTable" className="whitespace-nowrap table-hover border dataTable">
                                        <thead>
                                            <tr className="whitespace-nowrap border overflow-x-auto">
                                                <th className="w-1" ></th>
                                                <th className="w-14" >Item name</th>
                                                <th className="w-9 border-black" >Available Qty</th>
                                                <th className="w-9" >Sales Quantity</th>
                                                <th className="w-10 border-x-1 border-black" >Rate (BDT)</th>
                                                <th className="w-6" >Value</th>
                                                <th className="w-9 border-x-1 border-black" >Discount Rate (%)</th>
                                                <th className="w-14" >Discount Amount (BDT)</th>
                                                <th className="w-14 border-x-1 border-black" >After Discount Amount (BDT)</th>
                                                <th className="w-7" >SD(%)</th>
                                                <th className="w-14 border-x-1 border-black" >SD (BDT)</th>
                                                <th className="w-7" >Vatable Value</th>
                                                <th className="w-14 border-x-1 border-black" >VAT Type</th>
                                                <th className="w-7" >Trading Type</th>
                                                <th className="w-14 border-x-1 border-black" >VAT% </th>
                                                <th className="w-7" >VAT (BDT)</th>
                                                <th className="w-14 border-x-1 border-black" >Vds</th>
                                                <th className="w-7" >Total Amount</th>
                                                <th className="w-14 border-x-1 border-black" >Action</th>
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
                                            <td className="border-r-2 w-3/5" align="right"><strong>Discount Total(BDT)</strong></td>
                                            <td align="left"><strong id=""><input type='text' id='discountTotal'disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5" align="right"><strong>Grand Total(BDT)</strong></td>
                                            <td align="left"><strong id=""><input type='text' id='grandTotal' disabled /></strong></td>
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
                                    <Link to="/pages/sales/local_sales/index"><button type="button" className="btn btn-danger gap-2" >
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

export default AddLocalSales;


