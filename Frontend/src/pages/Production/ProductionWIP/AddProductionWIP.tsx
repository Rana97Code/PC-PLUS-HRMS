import React, { ChangeEvent, ChangeEventHandler } from 'react';
import {  useEffect, useState, useRef } from 'react';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Link, NavLink,useNavigate } from 'react-router-dom';
import axios from 'axios';


const AddProductionWIP: React.FC = () => {

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

    interface items {
        id: number;
        itemId: number;
        itemName: string;
    }

    interface suggestItem {
        id: number;
        itemName: string;
    }

    // interface detailsItem {
    //     id: number;
    //     itemName: string;
    //     hsCodeId: number;
    //     hsCode: string;
    //     sd: number;
    //     vat: number;
    // }

    const [all_bom_item, setAllBomItem] = useState<items[]>([]);
    const [all_suggestitm, setSuggestItem] = useState<suggestItem[]>([]);
    // const [itemDetails, setItemDetails] = useState<detailsItem[]>([]);
    const [product_qty, setProductionQty] = useState("");

    const [itemId, setFinishGoodId] = useState("");
    const [note, setNote] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('Token');

        if (token) {
            const bearer = token.slice(1, -1);

            const headers = { Authorization: `Bearer ${bearer}` }

            axios.get('http://localhost:8080/bmitvat/api/production-bom/all_bom_item', { headers })
                .then((response) => {
                    setAllBomItem(response.data);

                })
                .catch((error) => {
                    console.error('Error fetching data:', error);

                });

        }
    }, []);


    const getBomId: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedOptionId = event.target.value;
        const allId = selectedOptionId.split("/");
        // console.log("All id:", allId);

        const bomId = allId[0];
        const finishGoodsId = allId[1];
            setFinishGoodId(finishGoodsId);
        console.log("bom-id:", bomId);
        console.log("Item-id:", itemId);

             if (bomId) {
                const token = localStorage.getItem('Token');
                if (token) {
                    const bearer = JSON.parse(token);
                    const headers = { Authorization: `Bearer ${bearer}` }

                    axios.get(`http://localhost:8080/bmitvat/api/production-bom/bom_all_item_details/${bomId}`, { headers })
                        .then((response) => {
                            const dataArray = response.data;
                            // setItemDetails(dataArray);
                            addRow(dataArray);
                        })
                        .catch((error) => {
                            console.error('Error fetching data:', error);
                        });
                }

                function addRow(dataArray: any) {
                    const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;

                    dataTable.innerHTML = '';

                    dataArray.forEach((data: any)=> {

                        const inputh = document.createElement('input');
                        inputh.type = 'hidden';
                        inputh.name = 'rawMaterialId';
                        inputh.value = data.rawMaterialId;
                        inputh.autocomplete = 'off';
                        inputh.disabled = true;

                        const input = document.createElement('input');
                        input.type = 'text';
                        input.name = 'itemName';
                        input.value = data.itemName;
                        input.autocomplete = 'off';
                        input.disabled = true;
                        input.style.cssText = 'width: 180px;';

                        const input1 = document.createElement('input');
                        input1.type = 'number';
                        input1.name = 'stockQty';
                        input1.className = '';
                        input1.value = data.qty;
                        input1.autocomplete = 'off';
                        input1.disabled = true;
                        input1.min = '0';
                        input1.style.cssText = 'border: 1px solid black; width: 100px;';

                        const pqtyInput = document.getElementById('pqty') as HTMLInputElement;

                        pqtyInput.addEventListener('keyup', (event) => {
                            const inputValue: any = pqtyInput.value;

                            setProductionQty(inputValue);

                            const value1 = parseFloat(input1.value) || 0;
                            const value2 = parseFloat(input2.value) || 0;
                            const value4 = parseFloat(input4.value) || 0;

                            const onlyValue = value2 * inputValue;
                            input3.value = onlyValue.toString();

                            const wastageQty = value4 * onlyValue;
                            input5.value = wastageQty.toString();

                            // const totalQty = onlyValue + wastageQty;
                            input6.value = onlyValue.toString();

                            const remainQty = value1 - onlyValue;
                            input7.value = remainQty.toString();

                            if(remainQty<0){
                                input8.style.cssText = 'border: 1px solid black; background-color:red; width: 100px; display: block;';
                                const btn = document.getElementById('submitButton') as HTMLElement;
                                btn.style.cssText = 'display: none;';
                            }else{
                                input8.style.cssText = 'border: 1px solid black; background-color:red; width: 100px; display: none;';
                                const btn = document.getElementById('submitButton') as HTMLElement;
                                btn.style.cssText = 'display: block; width: 100px';
                            }

                            // Add your logic here based on the input value
                        });


                        const input2 = document.createElement('input');
                        input2.type = 'number';
                        input2.name = 'materialQtyRate';
                        input2.className = '';
                        input2.value = data.materialQty;
                        input2.autocomplete = 'off';
                        input2.disabled = true;
                        input2.min = '0';
                        input2.style.cssText = 'border: 1px solid black; width: 100px;';

                        const input3 = document.createElement('input');
                        input3.type = 'number';
                        input3.name = 'totalQty';
                        input3.className = '';
                        input3.value = '';
                        input3.autocomplete = 'off';
                        input3.disabled = true;
                        input3.min = '0';
                        input3.style.cssText = 'border: 1px solid black; width: 150px;';

                        const input4 = document.createElement('input');
                        input4.type = 'number';
                        input4.name = 'wastageQtyRate';
                        input4.className = '';
                        input4.value = data.wastageQty;
                        input4.autocomplete = 'off';
                        input4.disabled = true;
                        input4.min = '0';
                        input4.style.cssText = 'border: 1px solid black; width: 100px;';

                        const input5 = document.createElement('input');
                        input5.type = 'number';
                        input5.name = 'totalWastage';
                        input5.className = '';
                        input5.value = '';
                        input5.autocomplete = 'off';
                        input5.disabled = true;
                        input5.min = '0';
                        input5.style.cssText = 'border: 1px solid black; width: 100px;';

                        const input6 = document.createElement('input');
                        input6.type = 'number';
                        input6.name = 'totalRawMaterials';
                        input6.className = '';
                        input6.value = '';
                        input6.autocomplete = 'off';
                        input6.disabled = true;
                        input6.min = '0';
                        input6.style.cssText = 'border: 1px solid black; width: 160px;';

                        const input7 = document.createElement('input');
                        input7.type = 'number';
                        input7.name = 'remainStockQty';
                        input7.className = '';
                        input7.value = '';
                        input7.autocomplete = 'off';
                        input7.disabled = true;
                        input7.min = '0';
                        input7.style.cssText = 'border: 1px solid black; width: 100px;';

                        const input8 = document.createElement('input');
                        input8.type = 'text';
                        input8.name = name + '[]';
                        input8.className = '';
                        input8.value = 'Material Required';
                        input8.autocomplete = 'off';
                        input8.disabled = true;
                        input8.min = '0';
                        input8.style.cssText = 'border: 1px solid black; background-color:red; width: 100px; display: none;';

                        const input9 = document.createElement('input');
                        input9.type = 'hidden';
                        input9.name = 'productionDate';
                        input9.className = '';
                        input9.value = dateValue;
                        input9.autocomplete = 'off';
                        input9.disabled = true;
                
                        

                        // const trtd= row.appendChild(col);

                        const newRow = dataTable.insertRow();

                        const cellh = newRow.insertCell();
                        cellh.appendChild(inputh);
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

                    });
                }
            }
                    
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // alert();
        // const newDate = new Date(dateValue);

        const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
        const arrayData: any[] = [];
        if (dataTable) {
        dataTable.querySelectorAll('tr').forEach((row) => {
            const rowData: any = {};

            row.querySelectorAll('td input').forEach((input) => {
                const inputElement = input as HTMLInputElement;
                rowData[inputElement.name || 'rawMaterialId']    = inputElement.value;
                rowData[inputElement.name || 'itemName']         = inputElement.value;
                rowData[inputElement.name || 'stockQty']         = inputElement.value;
                rowData[inputElement.name || 'materialQtyRate']      = inputElement.value;
                rowData[inputElement.name || 'totalQty']         = inputElement.value;
                rowData[inputElement.name || 'wastageQtyRate']       = inputElement.value;
                rowData[inputElement.name || 'totalWastage']     = inputElement.value;
                rowData[inputElement.name || 'totalRawMaterials']= inputElement.value;
                rowData[inputElement.name || 'remainStockQty']   = inputElement.value;
                rowData[inputElement.name || 'productionDate']   = inputElement.value;

            });
    
            arrayData.push(rowData);
          
        });

    } else {
        console.error("Could not find #dataTable tbody element");
    }

        const items = {
            productionDate: dateValue,
            itemId: itemId,
            productionQty: product_qty,
            rawMaterialsArray: arrayData,
            note: note
        }
        console.log(items);

        const token = localStorage.getItem('Token');
        if (token) {
            const bearer1 = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer1}` }

            try {
                await axios.post("http://localhost:8080/bmitvat/api/production-wip/create_production", items, { headers })
                    .then(function (response) {
                        if (response) {
                            navigate("/pages/production_wip/index");
                        }
                    })

            } catch (err) {
                console.log(err);
            }
        }
    };




    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">WIP Production</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className="mb-5">
                        <div className="panel" id="browser_default">
                            <div className="flex items-center justify-between mb-7">
                                <h5 className="font-semibold text-lg dark:text-white-light">Add WIP Production</h5>
                            </div>
                            <div>
                                <form className="space-y-10" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                                        <div>
                                            <label htmlFor="browserLname">Production Date</label>
                                            <input id="browserLname" type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} className="form-input" required />
                                        </div>
                                        <div>
                                            <label htmlFor="gridState">Item Name</label>
                                            <select id="getSupplier" onChange={getBomId} className="form-select text-dark col-span-4 text-sm" required >
                                                <option>Select Items</option>
                                                {all_bom_item.map((option, index) => ( 
                                                    <option key={index} value={option.id+'/'+option.itemId}> 
                                                        {option.itemName} 
                                                    </option> 
                                                ))} 
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="browserLname">Production Quantity</label>
                                            <input id="pqty" type="number" placeholder="" className="form-input" required />
                                        </div>
                                    </div>

                                    <div className="border overflow-hidden overflow-x-auto">
                                        <table id="dataTable" className="whitespace-nowrap table-hover border dataTable">
                                            <thead>
                                                <tr className="whitespace-nowrap border overflow-x-auto">
                                                    <th className="w-1"></th>
                                                    <th className="w-14" >Name</th>
                                                    <th className="w-9 border-black" >Stock Quantity</th>
                                                    <th className="w-9" >Used Material</th>
                                                    <th className="w-10 border-x-1 border-black" >Material Quantity</th>
                                                    <th className="w-6" >Wastage Rate</th>
                                                    <th className="w-9 border-x-1 border-black" >Wastage Quantity</th>
                                                    <th className="w-14" >Total Quantity</th>
                                                    <th className="w-14 border-x-1 border-black" >Balance</th>
                                                    <th className="w-7" >Remark</th>
                                                    <th className="w-1"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="grid grid-cols-5 gap--x-2 gap-y-3 pt-7">
                                        <label htmlFor="userName" className='col-span-1 text-sm'>Note</label>
                                        <textarea id="userName" placeholder="Notes..." className="form-input py-2.5 text-sm col-span-4" onChange={(e) => setNote(e.target.value)} />
                                    </div>

                                    <div className="flex items-center justify-center gap-6 pt-4">
                                        <button type="submit" className="btn btn-success gap-2"  >
                                            Submit
                                        </button>
                                        <Link to="/pages/production_wip/index"><button type="button" className="btn btn-danger gap-2" >
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
export default AddProductionWIP;

