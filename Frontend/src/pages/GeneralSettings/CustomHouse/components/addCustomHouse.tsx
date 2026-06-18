import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import { DataTableSortStatus } from 'mantine-datatable';
import { Link, NavLink, useNavigate }  from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../../context/UserContex';


const addCustomHouse = () => {
    const [houseName, setHouseName] = useState("");
    const [houseCode, setHouseCode] = useState("");
    const [houseAddress, setAddress] = useState("");
    const [houseStatus, setStatus] = useState("");
    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl = user.base_url;
  
    useEffect(() => {
      handleSubmit;
  }, []);
  
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {

      const custom_house = {
        custom_house_name : houseName,
        custom_house_code : houseCode, 
        custom_house_address : houseAddress,
        custom_house_status : houseStatus
      }

      //console.log(custom_house);
  
      if(user.token){
        const headers= { Authorization: `Bearer ${user.token}` }
      //   const bearer1 = JSON.parse(token);
      // const headers= { Authorization: `Bearer ${bearer1}` }
  
      try {
         axios.post(`${baseUrl}/customhouse/add_custom_house`, custom_house, {headers})
          .then(function (response) {
            if(response){
              navigate("/pages/settings/custom_house");
            }else{
              navigate("/pages/settings/custom_house");
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
                <h2 className="text-xl font-bold">Custom-House</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className='panel'>
                <div className="flex items-center justify-between mb-7">
                        <h3 className="font-semibold text-lg dark:text-white-light">Add New Custom-House</h3>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="houseName" className='col-span-1 text-base'>Custom House Name</label>
                                <input type="text" placeholder="Enter Custom House Name" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setHouseName(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="houseCode" className='col-span-1 text-base'>Custom House Code</label>
                                <input type="text" placeholder="Enter Your Custom House Code" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setHouseCode(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="userName" className='col-span-1 text-base'>Custom House Address</label>
                                <input type="text" placeholder="Enter Custom House Address" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setAddress(e.target.value)} required />
                            </div>

                            <div>
                                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                                <label htmlFor="houseStatus" className='col-span-1 text-base'>Custom House Status</label>
                                <select className="form-select text-dark col-span-4 text-base" value={houseStatus} onChange={(e) => setStatus(e.target.value)} name ="custom_house_Status" required>
                                <option >Select Status for Custom House</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                                </select>
                                </div>
                            </div>


                            <div className="flex items-center  justify-center gap-6">
                                <button type="submit" className="btn btn-primary gap-2">
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Submit

                                </button>
                                <Link to="/pages/settings/custom_house">
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
    );
};

export default addCustomHouse;
