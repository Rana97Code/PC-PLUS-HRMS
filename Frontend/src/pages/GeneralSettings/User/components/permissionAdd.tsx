import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';


const permissionAdd = () => {
    const [roleName, setRoleName] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const units = {
            roleName: roleName,
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
            <div className="flex items-center justify-between mb-8">
                <h5 className="font-semibold text-lg dark:text-white-light">Add New Permission</h5>
            </div>
            <div className="mb-5 ">
                <form className="space-y-5">
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="permissionName" className="mb-0 sm:w-1/4 sm:ltr:mr-3 rtl:ml-2">Permission Name</label>
                        <input id="permissionName" type="text" placeholder="Enter Permission Name" className="form-input flex-1" name="permission_name" required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="inputStatus" className="font-semibold sm:w-1/4 sm:ltr:mr-11 rtl:ml-2">Status</label>
                        <select className="form-select text-dark" required>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center gap-6 pt-9">
                        <button type="submit" className="btn btn-success gap-2">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Submit
                        </button>
                        <button type="button" className="btn btn-danger gap-2">
                            <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default permissionAdd;