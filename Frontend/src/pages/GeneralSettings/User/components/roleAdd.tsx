import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';


const roleAdd = () => {
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
            <div className="flex items-center justify-between flex-wrap pb-6 gap-4">
                <h2 className="text-lg">Add Role</h2>
            </div>

            {/*----------------- User-Role form start ---------------*/}
            <div className="mb-5">
                <form className="space-y-5">
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="roleName" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2" >
                            Role Name
                        </label>
                        <input id="roleName" type="text" placeholder="Enter Role Name" className="form-input flex-1" name="role_name" required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="inputStatus" className="font-semibold sm:w-1/4 sm:ltr:mr-10 rtl:ml-2">Status</label>
                        <select className="form-select text-dark" x-model="form3.select" required>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center gap-6 pt-9">
                        <button type="submit" className="btn btn-success gap-2" onClick={handleSubmit}>
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
            {/*----------------- User-Role form end ---------------*/}
        </div>
    )
}
export default roleAdd;