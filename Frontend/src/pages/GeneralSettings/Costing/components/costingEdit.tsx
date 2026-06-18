import React, { useContext,useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../.././context/UserContex';
import { preventDefault } from '@fullcalendar/core/internal';

const costingEdit = () => {
    const [costingName, setName]=useState("");
    const [costingType, setType]=useState("");
    const [costingStatus, setStatus]=useState("");

    const params = useParams();
    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl= user.base_url;

    const getCostingDetails = async()=>{
       if(user.headers){
        const headers= user.headers;

        await axios.get(`${baseUrl}/costing/get_costing/${params.id}`,{headers})
            .then((response) => {
                // setInitialRecords(response.data);
                const data = response.data;
                //console.log(data);
                setName(data.costing_name)
                setType(data.costing_type)
                setStatus(data.costing_status)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
        }
    }
    useEffect(()=>{
      getCostingDetails();  //create this function
      //handleSubmit;
    },[user])  //Use array


    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const costing = {
          costing_name: costingName,
          costing_type: costingType,
          costing_status: costingStatus,
          user_id: '1'
        }

        //console.log(costing);
        if(user){
          const headers= { Authorization: `Bearer ${user.token}` }
        try {
            
           await axios.put(`${baseUrl}/costing/update_costing/${params.id}`, costing, {headers})
          .then(function (response){
            if(response){
              navigate("/pages/settings/costing");
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
        <h2 className="text-xl">Costing</h2>
      </div>
      <div className="panel mt-6">
        {/* Grid */}
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Edit Costing</h3>
          </div>
          <div className="mb-5">
           
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="costingName" className='col-span-1 text-base'>Costing Name</label>
                  <input id="costingName" type="text" placeholder="Enter Costing Name" className="form-input py-2.5 text-base col-span-4" name ="costing_name" value={costingName} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="costingType" className='col-span-1 text-base'>Costing Type</label>
                  <select className="form-select text-dark col-span-4 text-base" value={costingType} onChange={(e) => setType(e.target.value)} name ="costing_type" required>
                    <option value="" disabled>Select One</option>
                    <option value="1">Direct Cost</option>
                    <option value="0">Indirect Cost</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="costingType" className='col-span-1 text-base'>Costing Status</label>
                  <select className="form-select text-dark col-span-4 text-base" value={costingStatus} onChange={(e) => setStatus(e.target.value)} name ="costing_status" required>
                  <option >Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center  justify-center gap-6 pt-8">
                <button type="submit" className="btn btn-success gap-2" >
                  <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Submit
                </button>
                <Link to={"/pages/settings/costing"} >
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
  )
}
export default costingEdit;