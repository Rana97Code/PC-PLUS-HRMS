import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useEffect, useState, useRef } from 'react';
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { exists } from 'i18next';


const AddForeignSales: React.FC = () => {
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
        supplierAddress: string;
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
    const [SuppAddress, setAddress] = useState("");

    const [supplier, setSupplier] = useState("");
    const [salesDate, setSalesDate] = useState(getTodayDate());
    const [fiscalYear, setFiscalYear] = useState("");

    const [note, setNote] = useState('');



    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get('http://localhost:8080/bmitvat/api/supplier/all_supplier', { headers })
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

        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get(`http://localhost:8080/bmitvat/api/supplier/get_supplier/${selectedOptionId}`, { headers })
                .then((response) => {
                    const data = response.data;
                    setSupplier(data.id)
                    setAddress(data.supplierAddress)
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

            let selectElement = document.getElementById('fiscalYear') as HTMLSelectElement;
            let fiscalYear = selectElement.value;

            const searchTerm = fiscalYear + '/' + searchInput.value;
            try {
                const response = await axios.post('http://localhost:8080/bmitvat/api/item/getItemSuggestions', searchTerm, { headers });
                // <string[]>
                const suggestions = response.data;
                setSuggestItem(suggestions);
                // console.log(total);

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
                        console.log('Clicked Item ID:', clickedValue);
                        if (suggestionsList) {
                            suggestionsList.style.display = 'none';
                        }

                        if (clickedValue > 0) {


                            const token = localStorage.getItem('Token');
                            if (token) {
                                const bearer = JSON.parse(token);
                                const headers = { Authorization: `Bearer ${bearer}` }

                                axios.get(`http://localhost:8080/bmitvat/api/purchase/get_item_details/${clickedValue}`, { headers })
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
                                input.style.cssText = 'border: 1px solid black; width: 180px;';

                                const input1 = document.createElement('input');
                                input1.type = 'number';
                                input1.name = 'quantity';
                                input1.className = '';
                                input1.value = '';
                                input1.id = 'qtyId';
                                input1.autocomplete = 'off';
                                input1.min = '0';
                                input1.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input2 = document.createElement('input');
                                input2.type = 'number';
                                input2.name = 'rate';
                                input2.className = 'rateClass';
                                input2.value = '';
                                input1.id = 'rateId';
                                input2.autocomplete = 'off';
                                input2.min = '0';
                                input2.style.cssText = 'border: 1px solid black; width: 100px;';

                                input1.addEventListener('keyup', calculateValue);
                                input2.addEventListener('keyup', calculateValue);

                                function calculateValue() {
                                    const value1 = parseFloat(input1.value) || 0;
                                    const value2 = parseFloat(input2.value) || 0;
                                    const value4 = parseFloat(input4.value) || 0;
                                    const value8 = parseFloat(input8.value) || 0;

                                    const onlyValue = value1 * value2;
                                    input3.value = onlyValue.toString();

                                    //sd
                                    const sdWithValue = (onlyValue * value4) / 100;
                                    input5.value = sdWithValue.toString();

                                    const vatAblValue = onlyValue + sdWithValue;
                                    input6.value = vatAblValue.toString();

                                    // vat
                                    const vatAmout = (vatAblValue * value8) / 100;
                                    input9.value = vatAmout.toString();

                                    const totalAmount = (parseFloat(input6.value) + vatAmout);
                                    input10.value = totalAmount.toString();

                                }

                                const input3 = document.createElement('input');
                                input3.type = 'number';
                                input3.name = 'priceValue';
                                input3.className = '';
                                input3.value = '';
                                input3.autocomplete = 'off';
                                input3.disabled = true;
                                input3.min = '0';
                                input3.style.cssText = 'border: 1px solid black; width: 150px;';

                                const input4 = document.createElement('input');
                                input4.type = 'number';
                                input4.name = 'sd';
                                input4.className = '';
                                input4.value = data.sd;
                                input4.autocomplete = 'off';
                                input4.disabled = true;
                                input4.min = '0';
                                input4.style.cssText = 'border: 1px solid black; width: 100px;';


                                const input5 = document.createElement('input');
                                input5.type = 'number';
                                input5.name = 'sdAmount';
                                input5.className = 'total_sd';
                                input5.value = '';
                                input5.autocomplete = 'off';
                                input5.disabled = true;
                                input5.min = '0';
                                input5.style.cssText = 'border: 1px solid black; width: 100px;';

                                const input6 = document.createElement('input');
                                input6.type = 'number';
                                input6.name = 'vatableValue';
                                input6.className = '';
                                input6.value = '';
                                input6.autocomplete = 'off';
                                input6.disabled = true;
                                input6.min = '0';
                                input6.style.cssText = 'border: 1px solid black; width: 160px;';

                                const selectElement = document.createElement('select');
                                selectElement.name = 'vatType';
                                selectElement.className = '';
                                selectElement.style.cssText = 'border: 1px solid black; width: 180px;';

                                const option0 = document.createElement('option');
                                option0.value = '';
                                option0.selected = true;
                                option0.textContent = 'Select Vat %';
                                selectElement.appendChild(option0);

                                const option1 = document.createElement('option');
                                option1.value = '1';
                                option1.textContent = 'Standard Rate(15%)';
                                selectElement.appendChild(option1);

                                const option2 = document.createElement('option');
                                option2.value = '2';
                                option2.textContent = 'Zero Rate(0%)';
                                selectElement.appendChild(option2);

                                const option3 = document.createElement('option');
                                option3.value = '3';
                                option3.textContent = 'Exempted';
                                selectElement.appendChild(option3);

                                const option4 = document.createElement('option');
                                option4.value = '4';
                                option4.textContent = 'Specific';
                                selectElement.appendChild(option4);

                                const option5 = document.createElement('option');
                                option5.value = '5';
                                option5.textContent = 'Other Than Standard Rate';
                                selectElement.appendChild(option5);

                                const option6 = document.createElement('option');
                                option6.value = '6';
                                option6.textContent = 'Unregistered Entities';
                                selectElement.appendChild(option6);

                                const option7 = document.createElement('option');
                                option7.value = '7';
                                option7.textContent = 'Turnover TAX';
                                selectElement.appendChild(option7);

                                selectElement.addEventListener('change', () => {
                                    const selectedValue = selectElement.value;
                                    if (selectedValue == '1') {
                                        input8.value = '15';
                                        input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '2') {
                                        input8.value = '0';
                                        input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '3') {
                                        input8.value = '0';
                                        input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '4') {
                                        input8.value = '';
                                        input8.style.cssText = 'border: 1px solid black; width: 100px; display:block; disabled: false;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '5') {
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        input8.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '6') {
                                        input8.value = '';
                                        input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    } if (selectedValue == '7') {
                                        input8.value = '4';
                                        input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';
                                        selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';
                                    }
                                    console.log('Selected Value:', selectedValue);
                                });

                                const input8 = document.createElement('input');
                                input8.type = 'number';
                                input8.name = 'vatRate';
                                input8.className = '';
                                input8.value = data.vat;
                                input8.autocomplete = 'off';
                                input8.disabled = true;
                                input8.min = '0';
                                input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';

                                const selectStandard = document.createElement('select');
                                selectStandard.name = 'vatStRate';
                                selectStandard.className = '';
                                selectStandard.style.cssText = 'border: 1px solid black; width: 100px; display:none;';

                                const optionSt0 = document.createElement('option');
                                optionSt0.value = '';
                                optionSt0.selected = true;
                                optionSt0.textContent = 'Select Vat';
                                selectStandard.appendChild(optionSt0);

                                const optionSt1 = document.createElement('option');
                                optionSt1.value = '2';
                                optionSt1.textContent = '2';
                                selectStandard.appendChild(optionSt1);

                                const optionSt2 = document.createElement('option');
                                optionSt2.value = '2.4';
                                optionSt2.textContent = '2.4';
                                selectStandard.appendChild(optionSt2);

                                const optionSt3 = document.createElement('option');
                                optionSt3.value = '3';
                                optionSt3.textContent = '3';
                                selectStandard.appendChild(optionSt3);

                                const optionSt4 = document.createElement('option');
                                optionSt4.value = '5';
                                optionSt4.textContent = '5';
                                selectStandard.appendChild(optionSt4);

                                const optionSt5 = document.createElement('option');
                                optionSt5.value = '7.5';
                                optionSt5.textContent = '7.5';
                                selectStandard.appendChild(optionSt5);

                                const optionSt6 = document.createElement('option');
                                optionSt6.value = '10';
                                optionSt6.textContent = '10';
                                selectStandard.appendChild(optionSt6);

                                selectStandard.addEventListener('change', () => {
                                    const selectedValue = selectStandard.value;
                                    if (selectedValue == '2') {
                                        input8.value = '2';
                                    }
                                    if (selectedValue == '2.4') {
                                        input8.value = '2.4';
                                    }
                                    if (selectedValue == '3') {
                                        input8.value = '3';
                                    }
                                    if (selectedValue == '5') {
                                        input8.value = '5';
                                    }
                                    if (selectedValue == '7.5') {
                                        input8.value = '7.5';
                                    }
                                    if (selectedValue == '10') {
                                        input8.value = '10';
                                    }
                                })

                                //Both Select Calculation
                                selectElement.addEventListener('change', calculateVat1);
                                function calculateVat1() {
                                    const value1 = parseFloat(input8.value) || 0;

                                    const vat = (parseFloat(input6.value) * value1) / 100;
                                    input9.value = vat.toString();

                                    const totalAmout = (parseFloat(input6.value) + vat);
                                    input10.value = totalAmout.toString();
                                }

                                selectStandard.addEventListener('change', calculateVat);

                                function calculateVat() {
                                    const value2 = parseFloat(selectStandard.value) || 0;
                                    const vat = (parseFloat(input6.value) * value2) / 100;
                                    input9.value = vat.toString();

                                    const totalAmout = (parseFloat(input6.value) + vat);
                                    input10.value = totalAmout.toString();

                                }

                                const input9 = document.createElement('input');
                                input9.type = 'number';
                                input9.name = 'vatAmount';
                                input9.className = 'total_vat';
                                input9.value = '';
                                input9.autocomplete = 'off';
                                input9.disabled = true;
                                input9.min = '0';
                                input9.style.cssText = 'border: 1px solid black; width: 100px;';


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


                                const selectReb = document.createElement('select');
                                selectReb.name = 'rebate';
                                selectReb.className = '';
                                selectReb.style.cssText = 'border: 1px solid black; width: 180px;';

                                const optionR = document.createElement('option');
                                optionR.value = '1';
                                optionR.textContent = 'Yes';
                                selectReb.appendChild(optionR);

                                const optionR1 = document.createElement('option');
                                optionR1.value = '2';
                                optionR1.textContent = 'No';
                                selectReb.appendChild(optionR1);

                                const optionR2 = document.createElement('option');
                                optionR2.value = '3';
                                optionR2.textContent = 'Zero/Exmptd/Turn/unreg';
                                selectReb.appendChild(optionR2);

                                const input10 = document.createElement('input');
                                input10.type = 'number';
                                input10.name = 'totalAmount';
                                input10.className = 'total_amount';
                                input10.value = '';
                                input10.autocomplete = 'off';
                                input10.disabled = true;
                                input10.min = '0';
                                input10.style.cssText = 'border: 1px solid black; width: 180px;';

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


                                input1.addEventListener('keyup', calculateTotalValue);
                                input2.addEventListener('keyup', calculateTotalValue);
                                selectElement.addEventListener('change', calculateTotalValue);
                                selectStandard.addEventListener('change', calculateTotalValue);

                                function calculateTotalValue() {
                                    // Grand Total VAT Calculation
                                    let grandTotalVat = 0;
                                    const VatInput = document.querySelectorAll(`.total_vat`) as NodeListOf<HTMLInputElement>;

                                    if (VatInput) {
                                        VatInput.forEach((input: HTMLInputElement) => {
                                            const value = parseFloat(input.value) || 0;
                                            grandTotalVat += value;
                                        });

                                        const grandTotalVatId = document.getElementById('vatTotal') as HTMLInputElement | null;
                                        if (grandTotalVatId !== null) {
                                            grandTotalVatId.value = grandTotalVat.toString();
                                        }
                                    }

                                    // Grand Total SD Calculation
                                    let grandTotalSd = 0;
                                    const SdInput = document.querySelectorAll(`.total_sd`) as NodeListOf<HTMLInputElement>;

                                    if (SdInput) {
                                        SdInput.forEach((input: HTMLInputElement) => {
                                            const value = parseFloat(input.value) || 0;
                                            grandTotalSd += value;
                                        });

                                        const grandTotalSdInput = document.getElementById('sdTotal') as HTMLInputElement | null;
                                        if (grandTotalSdInput !== null) {
                                            grandTotalSdInput.value = grandTotalSd.toString();
                                        }
                                    }

                                    // Grand Total Amount Calculation
                                    let grandTotal = 0;
                                    const inputs = document.querySelectorAll(`.total_amount`) as NodeListOf<HTMLInputElement>;

                                    if (inputs) {
                                        inputs.forEach((input: HTMLInputElement) => {
                                            const value = parseFloat(input.value) || 0;
                                            grandTotal += value;
                                        });

                                        const grandTotalInput = document.getElementById('grandTotal') as HTMLInputElement | null;
                                        if (grandTotalInput !== null) {
                                            grandTotalInput.value = grandTotal.toString();
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
                                cell7.appendChild(selectElement);
                                const cell8 = newRow.insertCell();
                                cell8.appendChild(input8);
                                cell8.appendChild(selectStandard);
                                const cell9 = newRow.insertCell();
                                cell9.appendChild(input9);
                                const cell10 = newRow.insertCell();
                                cell10.appendChild(selectVds);
                                const cell11 = newRow.insertCell();
                                cell11.appendChild(selectReb);
                                const cell12 = newRow.insertCell();
                                cell12.appendChild(input10);
                                const cell13 = newRow.insertCell();
                                cell13.appendChild(removeButton);
                            }
                        }
                    });
                });
            }
            catch (error) {
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
                    rowData[inputElement.name || 'itemName'] = inputElement.value;
                    rowData[inputElement.name || 'salesQuantity'] = inputElement.value;
                    rowData[inputElement.name || 'rate'] = inputElement.value;
                    rowData[inputElement.name || 'value'] = inputElement.value;
                    rowData[inputElement.name || 'discountRate'] = inputElement.value;
                    rowData[inputElement.name || 'discountAmount'] = inputElement.value;
                    rowData[inputElement.name || 'afterDiscount'] = inputElement.value;
                    rowData[inputElement.name || 'sd'] = inputElement.value;
                    rowData[inputElement.name || 'sdBdt'] = inputElement.value;
                    rowData[inputElement.name || 'vatableValue'] = inputElement.value;
                    rowData[inputElement.name || 'vatType'] = selectValue;
                    rowData[inputElement.name || 'vat'] = selectValue;
                    rowData[inputElement.name || 'vatBdt'] = selectValue;
                    rowData[inputElement.name || 'vds'] = selectValue;
                    rowData[inputElement.name || 'totalAmount'] = inputElement.value;
                });

                arrayData.push(rowData);
            });

        } else {
            console.error("Could not find #dataTable tbody element");
        }
        console.log(arrayData);
        // const jsonAllItemsData = JSON.stringify(arrayData);
        const TotalVat = document.getElementById('vatTotal') as HTMLInputElement;
        const TotalSD = document.getElementById('sdTotal') as HTMLInputElement;
        const AllTotal = document.getElementById('grandTotal') as HTMLInputElement;

        if (TotalVat || TotalSD || AllTotal) {
            const Vat = TotalVat.value;
            const SD = TotalSD.value;
            const ALL = AllTotal.value;

            const purchase = {
                supplierId: supplier,
                salesDate: salesDate,
                fiscalYear: fiscalYear,
                purchaseItems: arrayData,
                totalTax: Vat,
                totalSd: SD,
                grandTotal: ALL,
                note: note
            }

            console.log(purchase);

            const token = localStorage.getItem('Token');
            if (token) {
                const bearer = JSON.parse(token);
                const headers = { Authorization: `Bearer ${bearer}` }
                try {
                    // process.exit();

                    await axios.post("http://localhost:8080/bmitvat/api/purchase/add-local-purchase", purchase, { headers })
                        .then(function (response) {
                            navigate("/pages/procurment/local_purchase/index");
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
                <h2 className="text-xl font-bold">Foreign Sales</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className="mb-5">
                    <div className="panel" id="browser_default">
                        <div className="flex items-center justify-between mb-7">
                            <h5 className="font-semibold text-lg dark:text-white-light">Add New Foreign Sales</h5>
                        </div>
                        <div className="mb-5">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                                    <div>
                                        <label htmlFor="getCustomer">Customer</label>
                                        <select id="getCustomer" onChange={getSupplierId} className="form-select text-dark col-span-4 text-sm" required >
                                            <option>Select Customer</option>
                                            {all_suppliers.map((option, index) => (
                                                <option key={index} value={option.id}>
                                                    {option.supplierName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="customerAddress">Customer Address</label>
                                        <input id="customerAddress" type="text" value={SuppAddress} className="form-input" required disabled/>
                                    </div>
                                    <div>
                                        <label htmlFor="salesDate">Sales Date</label>
                                        <input id="salesDate" type="date" className="form-input" value={salesDate} onChange={(e) => setSalesDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="fiscalYear">Export</label>
                                        <select id="fiscalYear" className="form-select text-dark col-span-4 text-sm" onChange={(e) => setFiscalYear(e.target.value)} required>
                                            <option >Select Export</option>
                                            <option value={"direct"} >Direct Export</option>
                                            <option value={"deemed"} >Deemed Export</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                                    <label htmlFor="searchInput" className='col-span-1 text-sm'>Add Items</label>
                                    <input id="searchInput" type="text" className="h-12 border border-slate-300 rounded z-0 focus:shadow focus:outline-none form-input text-sm col-span-2"
                                        placeholder="Enter Hs-Code or Product Name" onInput={getItemByKeyUp} >
                                    </input>
                                    {/* <input id="searchInput" type="text" placeholder="Enter Hs-Code or Product Name" className="form-input py-2.5 text-sm col-span-2" onInput={getItemByKeyUp} /> */}
                                    <ul style={{ cursor: 'pointer' }} className="mt-10 ml-20 w-1/2 absolute bg-slate-300" id="suggestionsList"></ul>
                                </div>
                                <div className="border overflow-hidden overflow-x-auto">
                                    <table id="dataTable" className="whitespace-nowrap table-hover border dataTable">
                                        <thead>
                                            <tr className="whitespace-nowrap border overflow-x-auto">
                                                <th className="w-14" >Item Name</th>
                                                <th className="w-9 border-black" >Sales Quantity</th>
                                                <th className="w-9" >Rate(BDT)</th>
                                                <th className="w-10 border-x-1 border-black" >Value</th>
                                                <th className="w-6" >SD (BDT)</th>
                                                <th className="w-9 border-x-1 border-black" >Vatable Value (BDT)</th>
                                                <th className="w-6" >VAT(%)</th>
                                                <th className="w-9 border-x-1 border-black" >VAT(BDT)</th>
                                                <th className="w-14" >Total Amount</th>
                                                <th className="w-7" >Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                                <table className='mt-4'>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5 pr-4" align="right"><strong>Total VAT(BDT)</strong></td>
                                            <td align="left" className='pl-4'><strong><input type='text' id='vatTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5 pr-4" align="right"><strong>Total SD(BDT)</strong></td>
                                            <td align="left" className='pl-4'><strong id=""><input type='text' id='sdTotal' disabled /></strong></td>
                                        </tr>
                                        <tr className="h-10 border border-black form-input">
                                            <td className="border-r-2 w-3/5 pr-4" align="right"><strong>Grand Total(BDT)</strong></td>
                                            <td align="left" className='pl-4'><strong><input type="text" id="grandTotal" disabled /></strong>
                                                <p></p>
                                            </td>
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
                                    <Link to="/pages/procurment/local_purchase/index">
                                        <button type="button" className="btn btn-danger gap-2" >
                                            <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                            Cancel
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddForeignSales;


