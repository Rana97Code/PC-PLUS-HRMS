import React, { useContext,useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../.././context/UserContex';


const costingAdd = () => {
    const [costing_name, setName] = useState("");
    const [costing_type, setType] = useState("");
    const [costing_status, setStatus] = useState("");
    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl= user.base_url;
  
    useEffect(() => {
      handleSubmit;
  }, []);
  
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      
      const costing = {
        costing_name: costing_name,
        costing_type: costing_type,
        costing_status: costing_status,
        user_id: '1',
      }

      //console.log(costing);
  
      // const token = localStorage.getItem('Token');


      if(user.token){
        const headers= { Authorization: `Bearer ${user.token}` }
      
  
      try {
         await axios.post(`${baseUrl}/costing/add_costing`, costing, {headers})
          .then(function (response) {
            if(response){
              navigate("/pages/settings/costing");
            }else{
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
            {/*----------------- Costing form start ---------------*/}
            <div id="form">
                    <div className="flex items-center justify-between mb-6">
                        <h5 className="font-semibold text-lg dark:text-white-light">Costing Add</h5>
                    </div>
                    <div className="mb-5 ">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="costingName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                    Costing Name
                                </label>
                                <input id="costingName" type="text" placeholder="Enter Costing Name" className="form-input flex-1" 
                                 name = "costing_name" onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="costingType" className="mb-0 sm:w-1/4 sm:ltr:mr-8 rtl:ml-2" >Costing type</label>
                                <select className="form-select text-dark" name = "costing_type" onChange={(e) => setType(e.target.value)} required >
                                    <option >Select Costing Type</option>
                                    <option value="direct">Direct Cost</option>
                                    <option value="indirect">Indirect Cost</option>
                                </select>
                            </div>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="costingStatus" className="mb-0 sm:w-1/4 sm:ltr:mr-8 rtl:ml-2" >Status</label>
                                <select className="form-select text-dark" name = "costing_status" onChange={(e) => setStatus(e.target.value)} required >
                                    <option >Select Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                          
                            <div className="flex items-center justify-center gap-6 pt-9">
                               
                                    <button type="submit" className="btn btn-success gap-2">
                                        <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Submit
                                    </button>
                              
                            </div>
                        </form>
                    </div>
                </div>
            {/*----------------- Costing form end ---------------*/}
        </div>
    )
}
export default costingAdd;