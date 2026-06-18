import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContext from '../../../context/UserContex';

const addItem = () => {

  const user = useContext(UserContext);
  const headers = user.headers;
  const navigate = useNavigate();



  interface units {
    id: number;
    unit_name: string;
  }
  interface Hscode {
    id: number;
    hs_code: string;
    description: string;
    description_bn: string;
    calculate_year: string;
  }

  const [allUnits, setGetAllUnits] = useState<units[]>([]);
  const [allHscode, setGetAllHscode] = useState<Hscode[]>([]);
  const [item_name, setName] = useState("");
  const [description_code, setDescriptionCode] = useState("");
  const [unitId, setUnit] = useState("");
  const [hsCodeId, setHscodeId] = useState("");
  const [itemType, setType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) {

      // for Authorised Person
      axios.get(`${user.base_url}/allunits`, { headers })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setGetAllUnits(response.data);
          } else {
            throw new Error('Response data is not an array');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);

        });
      axios.get(`${user.base_url}/hs_code/all_hs_code`, { headers })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setGetAllHscode(response.data);
          } else {
            throw new Error('Response data is not an array');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);

        });
    }

    handleSubmit;
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const myArray = hsCodeId.split("/");
    const myArray1 = hsCodeId.split("#");

    const startIndex = hsCodeId.indexOf('/');
    const endIndex = hsCodeId.indexOf('#');
    //before '/'
    const hs_code_id = myArray[0];
    //Middle part
    const year = hsCodeId.substring(startIndex + 1, endIndex);
    //after '/'
    const hs_code = myArray1.slice(1).join("#");



    const items = {
      item_name: item_name,
      description_code: description_code,
      item_type: itemType,
      hs_code: hs_code,
      hs_code_id: hs_code_id,
      unit_id: unitId,
      stock_status: '0',
      status: status,
      calculate_year: year,
      created_by: '0',
      updated_by: null
    }
    console.log(items);

    if (user) {

      try {
        await axios.post(`${user.base_url}/item/add_item`, items, { headers })
          .then(function (response) {
            if (response) {
              navigate("/pages/inventory/items");
            } else {
              navigate("/pages/inventory/items/add");
            }
          })

      } catch (err) {
        console.log(err);
      }
    }

  };


  return (
    <div>
      <div className="panel flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold">Add Item</h2>
      </div>
      <div className="panel mt-6">
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Add New Item</h3>
          </div>
          <div className="mb-5">

            <form className="space-y-5" onSubmit={handleSubmit} >
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="unitName" className='col-span-1 text-base'>Item Name</label>
                  <input id="unitName" type="text" placeholder="Enter Item Name" className="form-input py-2.5 text-base col-span-4" name="unit_name" onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="descriptionCode" className='col-span-1 text-base'>Description Code</label>
                  <input id="descriptionCode" type="text" placeholder="Enter Description Code" className="form-input py-2.5 text-base col-span-4" name="description_code" onChange={(e) => setDescriptionCode(e.target.value)} required />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Unit Name</label>
                  {/* <select className="form-select text-dark col-span-4 text-base" required onChange={handleChange}> */}
                  <select className="form-select text-dark col-span-4 text-base" onChange={(e) => setUnit(e.target.value)} required>
                    <option >Select Unit</option>
                    {allUnits.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.unit_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>HS-CODE</label>
                  {/* <select className="form-select text-dark col-span-4 text-base" required onChange={handleChange}> */}
                  <select className="form-select text-dark col-span-4 text-base" onChange={(e) => setHscodeId(e.target.value)} required>
                    <option >Select HS-CODE</option>
                    {allHscode.map((option, index) => (
                      <option key={index} value={option.id + '/' + option.calculate_year + '#' + option.hs_code}>
                        {option.hs_code + ' (' + option.description + '/ ' + option.description_bn + ')' + '(' + option.calculate_year + ')'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Item Type</label>
                  {/* <select className="form-select text-dark col-span-4 text-base" required onChange={handleChange}> */}
                  <select className="form-select text-dark col-span-4 text-base" onChange={(e) => setType(e.target.value)} required>
                    <option >Select Item Type</option>
                    <option value="1">Raw Materials</option>
                    <option value="2">Finish Goods</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Status</label>
                  {/* <select className="form-select text-dark col-span-4 text-base" required onChange={handleChange}> */}
                  <select className="form-select text-dark col-span-4 text-base" onChange={(e) => setStatus(e.target.value)} required>
                    <option >Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center  justify-center gap-6 pt-8">
                <button type="submit" className="btn btn-success gap-2">
                  <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Submit
                </button>
                <Link to="/pages/inventory/items"><button type="button" className="btn btn-danger gap-2" >
                  <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Cancel
                </button></Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default addItem;