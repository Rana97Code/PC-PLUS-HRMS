import React, { useContext,useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../.././context/UserContex';


const AddCPC = () => {
 

    const [cpcName, setcpcName] = useState("");
    const [cpcCode, setcpcCode] = useState("");
    const [cpcStatus, setcpcStatus] = useState("");
    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl= user.base_url;
  


    useEffect(() => {
      handleSubmit;
     }, []);
  


    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      const cpc = {
        cpc_name: cpcName, 
        cpc_code: cpcCode,
        cpc_status: cpcStatus,
        user_id: 1,
        
      }

   console.log(cpc);
  

      if(user.token){
        const headers= { Authorization: `Bearer ${user.token}` }
      
  
      try {
         await axios.post(`${baseUrl}/cpc/add_cpc`, cpc, {headers})
          .then(function (response) {
            if(response){
              navigate("/pages/cpccode/list");
              
            }else{
              navigate("/pages/cpccode/list");
            }
          })
  
      } catch (err) {
        console.log(err);
      }
      }



    }

    return (
        <div>
           
            <div id="form">
                    <div className="flex items-center justify-between mb-6">
                        <h5 className="font-semibold text-lg dark:text-white-light">CPC Add</h5>
                    </div>
                    <div className="mb-5 ">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="cpc_name" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                    CPC Name
                                </label>
                                <input id="cpc_name" type="text" placeholder="Enter CPC Name" className="form-input flex-1" 
                                 name = "cpc_name" onChange={(e) => setcpcName(e.target.value)} required />
                            </div>

                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="cpc_code" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                    CPC Code
                                </label>
                                <input id="cpc_code" type="text" placeholder="Enter CPC Code" className="form-input flex-1" 
                                 name = "cpc_code" onChange={(e) => setcpcCode(e.target.value)} required />
                            </div>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="cpc_status" className="mb-0 sm:w-1/4 sm:ltr:mr-8 rtl:ml-2" >Status</label>
                                <select className="form-select text-dark" name = "cpc_status" onChange={(e) => setcpcStatus(e.target.value)} required >
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
            
        </div>
    )
}
export default AddCPC;