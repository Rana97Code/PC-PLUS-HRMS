import React, {useContext, useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../context/UserContex';


const addUnit = () => {
  const [unitName, setName] = useState("");
  const [unitAbbr, setAbbr] = useState("");
  const [unitStatus, setStatus] = useState("");
  
  const navigate = useNavigate();
  const user = useContext(UserContex);
  const baseUrl= user.base_url;

  useEffect(() => {
    handleSubmit;
}, []);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const units = {
      unit_name: unitName,
      unit_details: unitAbbr,
      unit_status: unitStatus,
      createdBy: '0',
      updatedBy: '0'
    }

    if(user.token){
      const headers= { Authorization: `Bearer ${user.token}` }

    try {
       await axios.post(`${baseUrl}/add_unit`, units, {headers})
        .then(function (response) {
          if(response){
            navigate("/pages/settings/unit");
          }else{
            navigate("/pages/settings/unit/add");
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
        <h2 className="text-xl font-bold">Add Unit</h2>
      </div>
      <div className="panel mt-6">
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Add New Unit</h3>
          </div>
          <div className="mb-5">
            {/*
            <form className="space-y-5" onSubmit={handleSubmit}> */}
            <form className="space-y-5" onSubmit={handleSubmit} >
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="unitName" className='col-span-1 text-base'>Unit Name</label>
                  <input id="unitName" type="text" placeholder="Enter Unit Name" className="form-input py-2.5 text-base col-span-4" name="unit_name" onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                <label htmlFor="abbr" className='col-span-1 text-base'>Abbr</label>
                <input id="abbr" type="text" placeholder="Enter Abbr" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setAbbr(e.target.value)} required />
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
                <Link to="/pages/settings/unit"><button type="button" className="btn btn-danger gap-2" >
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
export default addUnit;