import React, { useContext, useState, useEffect } from 'react';
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import UserContex from '../../../context/UserContex';


const editItem = () => {

  const [itemName, setName] = useState("");
  const [descriptionCode, setDesCode] = useState("");
  const [unitId, setUnit] = useState("");
  const [hsCodeId, setHscodeId] = useState("");
  const [hsCode, setHscode] = useState("");
  const [year, setYear] = useState("");
  const [itemType, setType] = useState("");
  const [status, setStatus] = useState("");




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
  const params = useParams();
  const navigate = useNavigate();
  const user = useContext(UserContex);
  const baseUrl = user.base_url;

  const getItemDetails = async () => {
    if (user.headers) {
      const headers = user.headers;

      await axios.get(`${baseUrl}/item/get_item/${params.id}`, { headers })
        .then((response) => {
          // setInitialRecords(response.data);
          const data = response.data;
          setName(data.item_name)
          setDesCode(data.description_code)
          setUnit(data.unit_id)
          setHscode(data.hs_code)
          setHscodeId(data.hs_code_id)
          setYear(data.calculate_year)
          setType(data.item_type)
          setStatus(data.status)

        })
        .catch((error) => {
          console.error('Error fetching data:', error);

        });

      // for units 

      axios.get(`${baseUrl}/allunits`, { headers })
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


      //For hs_code
      axios.get(`${baseUrl}/hs_code/all_hs_code`, { headers })
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


  }
  useEffect(() => {
    getItemDetails();
    handleSubmit;
  }, [user]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const myArray = hsCodeId.split("/");
    // const myArray1 = hsCodeId.split("#");

    // const startIndex = hsCodeId.indexOf('/');
    // const endIndex = hsCodeId.indexOf('#');
    //before '/'
    // const hs_code_id = myArray[0];
    //Middle part
    // const year = hsCodeId.substring(startIndex + 1, endIndex);
    //after '/'
    // const hs_code = myArray1.slice(1).join("#");


    const item = {
      item_name: itemName,
      description_code: descriptionCode,
      unit_id: unitId,
      hs_code: hsCode,
      hs_code_id: hsCodeId,
      item_type: itemType,
      stock_status: '0',
      status: status,
      calculate_year: year,
      created_by: '0',
      updated_by: '0'
    }
    console.log(item)

    if (user.token) {
      const headers = { Authorization: `Bearer ${user.token}` }

      try {
        await axios.put(`${baseUrl}/item/update_item/${params.id}`, item, { headers })
          .then(function (response) {
            navigate("/pages/inventory/items");
          })
      } catch (err) {
        console.log(err);
      }
    }
  };


  return (
    <div>
      <div className="panel flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold">Edit Item</h2>
      </div>
      <div className="panel mt-6">
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Edit Item</h3>
          </div>
          <div className="mb-5">
            <form className="space-y-5" onSubmit={handleSubmit} >
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Item Name</label>
                  <input id="unitName" type="text" className="form-input py-2.5 text-base col-span-4" value={itemName} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Description Code</label>
                  <input id="description" type="text" className="form-input py-2.5 text-base col-span-4" value={descriptionCode} onChange={(e) => setDesCode(e.target.value)} required />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Unit</label>
                  <select className="form-select text-dark col-span-4 text-base" value={unitId} onChange={(e) => setUnit(e.target.value)} required>
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
                  <select className="form-select text-dark col-span-4 text-base" value={hsCodeId} onChange={(e) => setHscodeId(e.target.value)} required>
                    <option >Select HS-CODE</option>
                    {allHscode.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.hs_code + ' (' + option.description + ')' + '(' + option.calculate_year + ')'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Item Type</label>
                  <select className="form-select text-dark col-span-4 text-base" value={itemType} onChange={(e) => setType(e.target.value)} required>
                    <option >Select Item Type</option>
                    <option value="1">Raw Materials</option>
                    <option value="2">Finish Goods</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Status</label>
                  <select className="form-select text-dark col-span-4 text-base" value={status} onChange={(e) => setStatus(e.target.value)} required>
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
                <Link to="/pages/inventory/items">
                  <button type="button" className="btn btn-danger gap-2" >
                    <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default editItem;