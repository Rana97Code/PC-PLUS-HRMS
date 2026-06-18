import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';


const costingAdd = () => {
    const [cpc_code, setCodeName] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      handleSubmit;
  }, []);
  
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      const costing = {
        cpcDescription: cpc_code,
        createdBy: '1',
      }

    //   console.log(costing);
  
      const token = localStorage.getItem('Token');
      if(token){
        const bearer1 = JSON.parse(token);
      const headers= { Authorization: `Bearer ${bearer1}` }
  
      try {
         await axios.post("http://localhost:8080/bmitvat/api/cpc/add-cpc", costing, {headers})
          .then(function (response) {
            if(response){
            //   navigate("/pages/settings/c");
                console.log("Successfully Add");
            }else{
            //   navigate("/pages/settings/costing");
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
                                 name = "costing_name" onChange={(e) => setCodeName(e.target.value)} required />
                            </div>
                    
                            <div className="flex items-center justify-center gap-6 pt-9">
                               
                                    <button type="submit" className="btn btn-success gap-2">
                                        <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Submit
                                    </button>
                            
{/*                                
                                    <button type="button" className="btn btn-danger gap-2" >
                                        <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Cancel
                                    </button> */}
                              
                            </div>
                        </form>
                    </div>
                </div>
            {/*----------------- Costing form end ---------------*/}
        </div>
    )
}
export default costingAdd;