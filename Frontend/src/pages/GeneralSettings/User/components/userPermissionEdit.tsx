import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';

const userPermissionEdit = () => {
    const [unitName, setName] = useState("");
    const [unitAbbr, setAbbr] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const units = {
            unitName: unitName,
            abbr: unitAbbr,
            status: true,
            createdBy: '0',
            updatedBy: '0'
        }
        try {
            const data = await axios.post("http://localhost:8080/bmitvat/api/v1/unit", units)
                .then(function (response) {
                    console.log(response);
                    navigate("/pages/settings/unit");
                })
            // if(response.status==200){
            // }else{
            //   console.warn("Insert Unsuccessfull");
            //   navigate("/pages/settings/unit/add");
            // }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 ">
                <h2 className="text-2xl ml-5 font-bold">Permissions</h2>
            </div>
            <div className="panel mt-6">

                {/*------------------ Form section -----------------*/}
                <div className="flex items-center justify-between m-5">
                    <h5 className="font-semibold text-xl mb-5 dark:text-white-light">Edit Permission</h5>
                </div>
                <div className="m-5">
                    <form className="space-y-5">

                        <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                            <label htmlFor="permissionName" className='col-span-1 text-base'>Permission Name </label>
                            <input id="permissionName" type="text" placeholder="Enter Permission Name" className="form-input py-2.5 text-base col-span-4" name="permission_name" />
                        </div>
                        <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                            <label htmlFor="inputPerson" className='col-span-1 text-base'>Status</label>
                            <select className="form-select text-dark col-span-4 text-base" required>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-center  justify-center gap-6 pt-8">
                            <button type="submit" className="btn btn-primary gap-2" onClick={handleSubmit}>
                                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Submit
                            </button>
                            <button type="button" className="btn btn-danger gap-2" >
                                <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default userPermissionEdit;









