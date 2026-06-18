import React, { ChangeEvent, ChangeEventHandler } from 'react';
import {  useEffect, useState, useRef } from 'react';
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Link, NavLink,useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import sortBy from 'lodash/sortBy';
import axios from 'axios';


const addProductionBOM: React.FC = () => {
    const navigate = useNavigate();


    // Function to get today's date in the format "YYYY-MM-DD"
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };


    interface finishGoods {
        id: number;
        itemName: string;
        unitName: string;
        hsCode: string;
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

    interface suggestCosting {
        id: number;
        costingName: string;
      }
    
    const [all_finishGoods, setAllFinishGoods] = useState<finishGoods[]>([]);
    const [all_suggestitm, setSuggestItem] = useState<suggestItem[]>([]);
    const [all_suggest_costing, setSuggestCosting] = useState<suggestCosting[]>([]);
    const [itemDetails, setItemDetails] = useState<detailsItem[]>([]);


    const [sku, setSKU] = useState("");
    const [submitDate, setSubmitDate] = useState(getTodayDate());
    const [effectiveDate, setEffectiveDate] = useState(getTodayDate());
    const [FGItemId, setFGItem] = useState("");
    const [Unit_name, setItemUnit] = useState("");
    const [HsCode, setItemHSCode] = useState("");
    const [remarks, setRemarks] = useState("");
    const [reference, setReference] = useState("");


    useEffect(() => {

        const token = localStorage.getItem('Token');
  
        if(token){
            const bearer =  token.slice(1,-1); 
  
        const headers= { Authorization: `Bearer ${bearer}` }
  
        axios.get('http://localhost:8080/bmitvat/api/item/all_finish_goods_in',{headers})
            .then((response) => {
                setAllFinishGoods(response.data);
  
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
  
            });
  
        }
    }, []);
  


    const getItemId: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedOptionId = event.target.value;

        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }
  
         axios.get(`http://localhost:8080/bmitvat/api/item/get_item_details/${selectedOptionId}`,{headers})
            .then((response) => {
                const data = response.data;
                setFGItem(data.id)
                setItemUnit(data.unitName)
                setItemHSCode(data.hsCode)
  
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
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }

            const searchTerm = searchInput.value;
            try {
                const response = await axios.post('http://localhost:8080/bmitvat/api/item/getAllRawMaterialsSuggestions', searchTerm,{headers});
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
                    selectedLiElements.forEach(async(liElement) => {

                        liElement.addEventListener('click', () => {
                          const clickedValue = (liElement as HTMLLIElement).value;
                          const liElementTyped = liElement as HTMLElement;
                          liElementTyped.style.backgroundColor = 'green';
                   
                          // Now 'clickedValue' contains the value of the clicked li element
                          console.log('Clicked Item ID:', clickedValue);
                          if (suggestionsList) {
                            suggestionsList.style.display = 'none';
                          }

                          if(clickedValue>0){


                            const token = localStorage.getItem('Token');
                            if(token){
                                const bearer = JSON.parse(token);
                                const headers= { Authorization: `Bearer ${bearer}` }
                    
                            axios.get(`http://localhost:8080/bmitvat/api/production-bom/get_bom_item_details/${clickedValue}`,{headers})
                                .then((response) => {
                                    const data = response.data;
                                    //  console.log(data.itemName);
                                    setItemDetails(data);
                                    addRow(data);
                                })
                                .catch((error) => {
                                    console.error('Error fetching data:', error);
                                });
                            }



                            function addRow(data: any){
                                const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;

                                const arrayData: any[] = [];

                                var id=data.id;
                                    console.log(id);
                                    const inputId = document.createElement('input');
                                    inputId.type = 'hidden';
                                    inputId.name = 'rawMaterialId';
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
                                    input1.name = 'materialQty';
                                    input1.className = '';
                                    input1.value = '';
                                    input1.id = 'qtyId';
                                    input1.autocomplete = 'off';
                                    input1.required = true;
                                    input1.min = '0';
                                    input1.style.cssText = 'border: 1px solid black; width: 100px;';

                                    const input2 = document.createElement('input');
                                    input2.type = 'text';
                                    input2.name = 'unitName';
                                    input2.value = data.unitName;
                                    input2.autocomplete = 'off';
                                    input2.disabled = true;
                                    input2.style.cssText = 'border: 1px solid black; width: 180px;';

                                    const input3 = document.createElement('input');
                                    input3.type = 'number';
                                    input3.name = 'materialRate';
                                    input3.className = 'rateClass';
                                    input3.value = data.rate;
                                    input3.id = 'rateId';
                                    input3.autocomplete = 'off';
                                    input3.min = '0';
                                    input3.style.cssText = 'border: 1px solid black; width: 100px;';

                                    const input4 = document.createElement('input');
                                    input4.type = 'number';
                                    input4.name = 'materialPrice';
                                    input4.className = '';
                                    input4.value = '';
                                    input4.autocomplete = 'off';
                                    input4.disabled = true;
                                    input4.min = '0';
                                    input4.style.cssText = 'border: 1px solid black; width: 150px;';

                                    const input5 = document.createElement('input');
                                    input5.type = 'number';
                                    input5.name = 'wastagePercent';
                                    input5.className = '';
                                    input5.value = '';
                                    input5.autocomplete = 'off';
                                    input5.min = '0';
                                    input5.style.cssText = 'border: 1px solid black; width: 100px;';

                                    input1.addEventListener('keyup', calculateValue);
                                    input5.addEventListener('keyup', calculateValue);
                                   

                                    function calculateValue() {
                                        const value1 = parseFloat(input1.value) || 0;
                                        const value3 = parseFloat(input3.value) || 0;
                                        const value5 = parseFloat(input5.value) || 0;  

                                        const value6 = parseFloat(input6.value) || 0;  
                                        const value7 = parseFloat(input7.value) || 0;  


                                        const onlyValue = value1 * value3;
                                        input4.value = onlyValue.toString();

                                        //wastage qty
                                        const Withqty = (value1 * value5)/100;
                                        input6.value = Withqty.toString();
                                        //wastage value
                                        const WastValue = Withqty * value7; 
                                        input8.value = WastValue.toString();

                                        // Total qty
                                        const vatQty = value1 + Withqty; 
                                        input9.value = vatQty.toString();

                                        // Total amount
                                        const totalAmount = (parseFloat(input9.value) * value3);
                                        input10.value = totalAmount.toString();

                                    }

                                    const input6 = document.createElement('input');
                                    input6.type = 'number';
                                    input6.name = 'wastageQty';
                                    input6.className = '';
                                    input6.value = '';
                                    input6.autocomplete = 'off';
                                    input6.disabled = true;
                                    input6.min = '0';
                                    input6.style.cssText = 'border: 1px solid black; width: 100px;';

                                    const input7 = document.createElement('input');
                                    input7.type = 'number';
                                    input7.name = 'wastageRate';
                                    input7.className = '';
                                    input7.value = data.rate;
                                    input7.autocomplete = 'off';
                                    input7.disabled = true;
                                    input7.min = '0';
                                    input7.style.cssText = 'border: 1px solid black; width: 160px;';

                                    const input8 = document.createElement('input');
                                    input8.type = 'number';
                                    input8.name = 'wastagePrice';
                                    input8.className = '';
                                    input8.value = '';
                                    input8.autocomplete = 'off';
                                    input8.disabled = true;
                                    input8.min = '0';
                                    input8.style.cssText = 'border: 1px solid black; width: 100px; display:block;';

                                    const input9 = document.createElement('input');
                                    input9.type = 'number';
                                    input9.name = 'totalQty';
                                    input9.className = 'total_qty';
                                    input9.value = '';
                                    input9.autocomplete = 'off';
                                    input9.disabled = true;
                                    input9.min = '0';
                                    input9.style.cssText = 'border: 1px solid black; width: 100px;';

                                    const input10 = document.createElement('input');
                                    input10.type = 'number';
                                    input10.name = 'totalPrice';
                                    input10.className = 'total_price';
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
                                    input5.addEventListener('keyup', calculateTotalValue);


                                    function calculateTotalValue(){
                                        // Grand Total VAT Calculation
                                        let grandTotalVat = 0;
                                        const VatInput = document.querySelectorAll(`.total_price`) as NodeListOf<HTMLInputElement>;
                                    
                                        if (VatInput) {                                        
                                            VatInput.forEach((input: HTMLInputElement) => {
                                                const value = parseFloat(input.value) || 0; 
                                                grandTotalVat += value;
                                            });
                                            
                                            const grandTotalPriceId = document.getElementById('priceTotal') as HTMLInputElement | null;
                                            if (grandTotalPriceId !== null) {
                                                grandTotalPriceId.value = grandTotalVat.toString();
                                            }
                                            const grandTotalInput = document.getElementById('grandTotal') as HTMLInputElement | null;
                                            if (grandTotalInput !== null) {
                                            grandTotalInput.value = grandTotalVat.toString();
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
                                const cell11 = newRow.insertCell();
                                cell11.appendChild(removeButton);
                            }

                            }
                        });
                      });
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }
    };

    async function getCostingByKeyUp(event: React.FormEvent<HTMLInputElement>) {

        const searchInput = event.currentTarget as HTMLInputElement;
        const CostingSuggestionsList = document.getElementById('CostingSuggestionsList');

        if (CostingSuggestionsList) {
            CostingSuggestionsList.style.display = 'block';
        }
      
        if (!CostingSuggestionsList) {
          return;
        }
      
        if (searchInput.value.trim() === '') {
            CostingSuggestionsList.innerHTML = '';
          return;
        }
        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }

            const searchTerm = searchInput.value;
            try {
                const response = await axios.post('http://localhost:8080/bmitvat/api/costing/getAllCostingSuggestions', searchTerm,{headers});
                // <string[]>
                const suggestions = response.data;
                setSuggestCosting(suggestions);

                CostingSuggestionsList.innerHTML = '';
                all_suggest_costing.forEach(suggestion => {

                    const listCosting = document.createElement('li');
                    listCosting.style.width = '500px';
                    listCosting.style.padding = '10px';
                    listCosting.className = 'costing-suggestion'; 
                    listCosting.value = suggestion.id;
                    listCosting.textContent = suggestion.costingName;
                    CostingSuggestionsList.appendChild(listCosting);
                    });


                    const selectedLiElements = document.querySelectorAll('.costing-suggestion');
                    selectedLiElements.forEach(async(liElement) => {

                        liElement.addEventListener('click', () => {
                          const clickedValue = (liElement as HTMLLIElement).value;
                          const liElementTyped = liElement as HTMLElement;
                          liElementTyped.style.backgroundColor = 'green';
                   
                          // Now 'clickedValue' contains the value of the clicked li element
                          console.log('Clicked Item ID:', clickedValue);
                          if (CostingSuggestionsList) {
                            CostingSuggestionsList.style.display = 'none';
                          }

                          if(clickedValue>0){

                            const token = localStorage.getItem('Token');
                            if(token){
                                const bearer = JSON.parse(token);
                                const headers= { Authorization: `Bearer ${bearer}` }
                    
                            axios.get(`http://localhost:8080/bmitvat/api/costing/get_costing/${clickedValue}`,{headers})
                                .then((response) => {
                                    const data = response.data;
                                    addCostingRow(data);
                                })
                                .catch((error) => {
                                    console.error('Error fetching data:', error);
                                });
                            }



                            function addCostingRow(data: any){
                                const costingTable = document.querySelector('#costingTable tbody') as HTMLTableElement;

                                const arrayData: any[] = [];

                                var id=data.id;
                                    console.log(id);
                                    const inputId = document.createElement('input');
                                    inputId.type = 'hidden';
                                    inputId.name = 'costingId';
                                    inputId.value = data.id;
                                    inputId.autocomplete = 'off';
                                    inputId.disabled = true;
                                    inputId.style.cssText = 'width: 1px;';

                                    const input = document.createElement('input');
                                    input.type = 'text';
                                    input.name = 'costingName';
                                    input.value = data.costingName;
                                    input.autocomplete = 'off';
                                    input.disabled = true;
                                    input.style.cssText = 'border: 1px solid black; width: 180px;';

                                    const input1 = document.createElement('input');
                                    input1.type = 'number';
                                    input1.name = 'cost';
                                    input1.className = 'total_costing';
                                    input1.value = '';
                                    input1.autocomplete = 'off';
                                    input1.required = true;
                                    input1.min = '0';
                                    input1.style.cssText = 'border: 1px solid black; width: 100px;';

                                    const removeButton = document.createElement('button');
                                    removeButton.textContent = 'Remove';
                                    removeButton.style.cssText = 'border: 1px solid black; background-color:red; width: 100px;';
                                    removeButton.addEventListener('click', () => {
                                        removeCostingRow(newRow);
                                    });
                                    function removeCostingRow(row: HTMLTableRowElement) {
                                        costingTable.removeChild(row);
                                        const index = arrayData.findIndex((item) => item.itemName === data.itemName);
                                        if (index !== -1) {
                                            arrayData.splice(index, 1);
                                        }
                                    }


                                    input1.addEventListener('keyup', calculateTotalCosting);
                                    function calculateTotalCosting(){
                                           // Grand Total Costing Calculation
                                           let grandTotalCosting = 0;
                                           const CostignInput = document.querySelectorAll(`.total_costing`) as NodeListOf<HTMLInputElement>;
                                          
                                           if (CostignInput) {                                        
                                              CostignInput.forEach((input: HTMLInputElement) => {
                                                   const value = parseFloat(input.value) || 0; 
                                                   grandTotalCosting += value;
                                                 });
                                                               
                                               const grandTotalCostInput = document.getElementById('costingTotal') as HTMLInputElement | null;
                                               if (grandTotalCostInput !== null) {
                                                  grandTotalCostInput.value = grandTotalCosting.toString();
                                               }

                                               const priceTotal = document.getElementById('priceTotal') as HTMLInputElement;
                                               const Alltotal = parseFloat(priceTotal.value) + grandTotalCosting;

                                               const grandTotalInput = document.getElementById('grandTotal') as HTMLInputElement | null;
                                               if (grandTotalInput !== null) {
                                               grandTotalInput.value = Alltotal.toString();
                                               }
                                           }
                                    }


                                    const newRow = costingTable.insertRow();

                                    const cellId = newRow.insertCell();
                                    cellId.appendChild(inputId);
                                    const cell = newRow.insertCell();
                                    cell.appendChild(input);
                                    const cell1 = newRow.insertCell();
                                    cell1.appendChild(input1);
                                    const cell11 = newRow.insertCell();
                                    cell11.appendChild(removeButton);
                                }

                            }
                        });
                      });
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }
    };


      
        const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

                const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
                const costingTable = document.querySelector('#costingTable tbody') as HTMLTableElement;
                const arrayData: any[] = [];
                const costignArray: any[] = [];
                if (dataTable) {
                dataTable.querySelectorAll('tr').forEach((row) => {
                    const rowData: any = {};

                    row.querySelectorAll('td input').forEach((input) => {
                        const inputElement = input as HTMLInputElement;
                        rowData[inputElement.name || 'rawMaterialId']  = inputElement.value;
                        rowData[inputElement.name || 'itemName']       = inputElement.value;
                        rowData[inputElement.name || 'materialQty']    = inputElement.value;
                        rowData[inputElement.name || 'unitName']       = inputElement.value;
                        rowData[inputElement.name || 'materialRate']   = inputElement.value;
                        rowData[inputElement.name || 'materialPrice']  = inputElement.value;
                        rowData[inputElement.name || 'wastagePercent'] = inputElement.value;
                        rowData[inputElement.name || 'wastageQty']     = inputElement.value;
                        rowData[inputElement.name || 'wastageRate']    = inputElement.value;
                        rowData[inputElement.name || 'wastagePrice']   = inputElement.value;
                        rowData[inputElement.name || 'totalQty']       = inputElement.value;
                        rowData[inputElement.name || 'totalPrice']     = inputElement.value;
                    });
            
                    arrayData.push(rowData);
                  
                });

            } else {
                console.error("Could not find #dataTable tbody element");
            }

            if(costingTable){
                costingTable.querySelectorAll('tr').forEach((row) => {
                    const rowData: any = {};

                    row.querySelectorAll('td input').forEach((input) => {
                        const inputElement = input as HTMLInputElement;
                        rowData[inputElement.name || 'costingId']      = inputElement.value;
                        rowData[inputElement.name || 'costingName']    = inputElement.value;
                        rowData[inputElement.name || 'cost']           = inputElement.value;
                    });
            
                    costignArray.push(rowData);
                  
                });
            }


            // const jsonAllItemsData = JSON.stringify(arrayData);
            const priceTotal = document.getElementById('priceTotal') as HTMLInputElement;
            const costingTotal = document.getElementById('costingTotal') as HTMLInputElement;
            const AllTotal = document.getElementById('grandTotal') as HTMLInputElement;

            if (priceTotal || costingTotal || AllTotal) {
                const totalPrice = priceTotal.value;
                const totalCosting = costingTotal.value;
                const ALLTotal = AllTotal.value;
             

            const bom = {
                sku: sku,
                submissionDate: submitDate,
                effectiveDate: effectiveDate,
                itemId: FGItemId,
                unitName: Unit_name,
                hsCode: HsCode,
                remarks: remarks,
                reference: reference,
                bomItemsArray: arrayData,
                costingArray: costignArray,
                totalPrice: totalPrice,
                totalCosting: totalCosting,
                totalSalesPrice: ALLTotal,
              }
        
                console.log(bom);

                const token = localStorage.getItem('Token');
                if(token){
                    const bearer = JSON.parse(token);
                    const headers= { Authorization: `Bearer ${bearer}` }
                try {
                   await axios.post("http://localhost:8080/bmitvat/api/production-bom/add-bom", bom, {headers})
                  .then(function (response){
                    navigate("/pages/production_bom/index");
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
                <h2 className="text-xl font-bold">Production BOM</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className="mb-5">
                        <div className="panel" id="browser_default">
                            <div className="flex items-center justify-between mb-7">
                                <h5 className="font-semibold text-lg dark:text-white-light">Production BOM Information</h5>
                            </div>
                            <div className="mb-5">
                                <form className="space-y-5" onSubmit={handleSubmit}>

                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                        <label htmlFor="userEmail" className='col-span-1 text-sm'>SKU</label>
                                        <input id="userEmail" type="text" placeholder="Enter SKU" className="form-input py-2.5 text-sm col-span-3" onChange={(e) => setSKU(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                        <label htmlFor="lastName" className='col-span-1 text-sm'>Submisssion Date</label>
                                        <input id="browserLname" type="date" className="form-input py-2.5 text-sm col-span-3" value={submitDate} onChange={(e) => setSubmitDate(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                        <label htmlFor="lastName" className='col-span-1 text-sm'>Effective Date</label>
                                        <input id="browserLname" type="date" className="form-input py-2.5 text-sm col-span-3" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                        <label htmlFor="inputPerson" className='col-span-1 text-sm '>Finish Goods Name</label>
                                        <select onChange={getItemId} className="form-select text-dark col-span-3 text-sm" required >
                                                <option>Select Item</option>
                                                {all_finishGoods.map((option, index) => ( 
                                                    <option key={index} value={option.id}> 
                                                        {option.itemName} 
                                                    </option> 
                                                ))} 
                                            </select>
                                    </div>
                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                        <label htmlFor="userEmail" className='col-span-1 text-sm'>Units (Units Of Measurement)</label>
                                        <input id="userEmail" type="text" className="form-input py-2.5 text-sm col-span-3" value={Unit_name} onChange={(e) => setItemUnit(e.target.value)} disabled />
                                    </div>
                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                        <label htmlFor="userNid" className='col-span-1 text-sm'>HS-CODE</label>
                                        <input id="userNid" type="tel" className="form-input py-2.5 text-sm col-span-3" value={HsCode} onChange={(e) => setItemHSCode(e.target.value)} disabled />
                                    </div>

                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                        <label htmlFor="userPhone" className='col-span-1 text-sm'>Remarks</label>
                                        <input id="userPhone" type="text" placeholder="Enter Remarks" className="form-input py-2.5 text-sm col-span-3" onChange={(e) => setRemarks(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                        <label htmlFor="password" className='col-span-1 text-sm'>Reference</label>
                                        <input id="password" type="text" placeholder="Enter Reference" className="form-input py-2.5 text-sm col-span-3" onChange={(e) => setReference(e.target.value)} />
                                    </div>
                                    <div >
                                        <label htmlFor="browserLname" className='col-span-1 text-sm'>Items(Raw Materials)</label>
                                        <div className="grid grid-cols-2">
                                        <input id="searchInput" type="text" placeholder="Enter Product Name" className="form-input py-2.5 text-sm col-span-2" onInput={getItemByKeyUp} />
                                        <ul style={{ cursor: 'pointer' }} className="mt-10 ml-20 w-1/2 absolute bg-slate-300" id="suggestionsList"></ul>
                                        </div>
                                    </div>

        
                                    <div className="border overflow-hidden overflow-x-auto">
                                        <table id="dataTable" className="whitespace-nowrap table-hover border dataTable">
                                            <thead>
                                                <tr className="whitespace-nowrap border overflow-x-auto">
                                                    <th className="w-14" >Item's Name</th>
                                                    <th className="w-9 border-x-1 border-black">Quantity</th>
                                                    <th className="w-9" >Unit Name</th>
                                                    <th className="w-10 border-x-1 border-black">Rate</th>
                                                    <th className="w-6" >Amount</th>
                                                    <th className="w-9 border-x-1 border-black">Wastage(%)</th>
                                                    <th className="w-14" >Wastage Quantity</th>
                                                    <th className="w-14 border-x-1 border-black">Wastage Rate</th>
                                                    <th className="w-7" >Wastage Amount</th>
                                                    <th className="w-14 border-x-1 border-black">Total Quantity</th>
                                                    <th className="w-7" >Total Amount</th>
                                                    <th className="w-7 border-x-1 border-black">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                            </tbody>
                                        </table>

                                        <div >
                                            <label htmlFor="browserLname" className='col-span-1 text-sm'>Costing List</label>
                                            <div className="grid grid-cols-2">
                                                <input id="browserLname" type="text" placeholder="Enter Costing List" className="form-input py-2.5 text-sm" onInput={getCostingByKeyUp} />
                                                <ul style={{ cursor: 'pointer' }} className="mt-10 ml-20 w-1/2 absolute bg-slate-300" id="CostingSuggestionsList"></ul>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className='basis-1/2'>
                                                <table id='costingTable' className="table-fixed w-50%">
                                                    <thead>
                                                        <tr className="whitespace-nowrap border overflow-x-auto">
                                                            <th className="w-0"></th>
                                                            <th className="w-2/5 font-bold">Costing Name</th>
                                                            <th className="w-1/4 border border-slate-300 px-4 py-2 font-bold">Costing Amount</th>
                                                            <th className="w-1/10 border border-slate-300 px-4 py-2 font-bold">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <table className='mt-4'>
                                            <tr className="h-10 border border-black form-input">
                                               <td className="border-r-2 w-3/5" align="right"><strong>Total Items Price(BDT)</strong></td>
                                               <td align="left"><strong><input type='number' id='priceTotal' disabled/></strong></td>
                                            </tr>
                                            <tr className="h-10 border border-black form-input">
                                               <td className="border-r-2 w-3/5" align="right"><strong>Total Costign(BDT)</strong></td>
                                               <td align="left"><strong id=""><input type='number' id='costingTotal' disabled/></strong></td>
                                            </tr>
                                            <tr className="h-10 border border-black form-input">
                                               <td className="border-r-2 w-3/5" align="right"><strong>Total Sales Price(BDT)</strong></td>
                                               <td align="left"><strong><input type="number" id="grandTotal" disabled/></strong>
                                                  <p></p>
                                               </td>
                                            </tr>
                                         </table>
                                    </div>

                                    <div className="flex items-center justify-center gap-6 pt-4">
                                        <button type="submit" className="btn btn-success gap-2" >
                                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                            Submit
                                        </button>
                                        <Link to="/pages/production_bom/index"><button type="button" className="btn btn-danger gap-2" >
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

export default addProductionBOM;


