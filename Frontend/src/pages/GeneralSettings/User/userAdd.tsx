import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import axios from 'axios';

const userAdd = () => {

  const [userName, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPhone, setPhone] = useState("");
  const [userNid, setNid] = useState("");
  const [nidScan, setNidImg] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfile] = useState("");
  const [saleCenterId, setSalesCenter] = useState("");
  const [userType, setUserType] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    handleSubmit;
}, []);

  const handleSubmit = async () => {
    const users = {
      username: userName,
      firstName: firstName,
      LastName: LastName,
      userEmail: userEmail,
      userPhone: userPhone,
      userNid: userNid,
      nidScan: nidScan,
      password: password,
      profileImage: profileImage,
      saleCenterId: saleCenterId,
      userType: userType,
      status: status,
      createdBy: '0',
      updatedBy: '0'
    }
    console.warn(users);
    try {
      console.warn(users);

      //  await axios.post("http://localhost:8080/bmitvat/api/v1/unit", users)
      //   .then(function (response) {
      //     console.log(response);
      //     navigate("/pages/settings/unit");
      //   })
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
        <h2 className="text-2xl ml-5 font-bold">Employee</h2>
      </div>
      <div className="panel mt-6">

        {/*--------------- Form section ----------------*/}
        <div className="flex items-center justify-between m-5">
          <h5 className="font-semibold text-xl mb-5 dark:text-white-light">Add New User</h5>
        </div>
        <div className="m-5">
          {/* <form className="space-y-5" onSubmit={handleSubmit}> */}
          <form className="space-y-5"  onClick={handleSubmit}>

            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="userName" className='col-span-1 text-base'>User Name</label>
              {/* input id="userEmail" type="text" placeholder="Enter User Name" className="form-input py-2.5 text-base col-span-4" name="user_name" onChange={handleChange} /> */}
              <input id="userName" type="text" placeholder="Enter User Name" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setUsername(e.target.value)}  name="user_name" />
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="firstName" className='col-span-1 text-base'>First Name</label>
              {/* <input id="firstName" type="text" placeholder="Enter First Name" className="form-input py-2.5 text-base col-span-4" name="first_name" onChange={handleChange} /> */}
              <input id="firstName" type="text" placeholder="Enter First Name" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setFirstName(e.target.value)}  name="first_name" />
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="lastName" className='col-span-1 text-base'>Last Name</label>
              <input id="lastName" type="text" placeholder="Enter Last Name" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setLastName(e.target.value)}  name="last_name" />
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="userEmail" className='col-span-1 text-base'>Email</label>
              <input id="userEmail" type="text" placeholder="Enter User Email" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setEmail(e.target.value)}  name="user_email" />
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="userPhone" className='col-span-1 text-base'>Phone</label>
              <input id="userPhone" type="tel" placeholder="Enter Phone Number" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setPhone(e.target.value)}  name="user_phone" />
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="userNid" className='col-span-1 text-base'>NID</label>
              {/* <input id="userNid" type="tel" placeholder="Enter User NID" className="form-input py-2.5 text-base col-span-4" name="user_nid" onChange={handleChange} /> */}
              <input id="userNid" type="tel" placeholder="Enter User NID" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setNid(e.target.value)}  name="user_nid" />
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="nidScan" className='col-span-1 text-base mb-2 inline-block text-neutral-700 dark:text-neutral-200'>NID Image</label>
              <input id="nidScan" type="file" placeholder="Enter User Email" accept=".jpeg, .png, .jpg, .PNG" onChange={(e)=>setNidImg(e.target.value)}
              className="form-input col-span-4 relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary" name="nid_scan" />
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="password" className='col-span-1 text-base'>Password</label>
              <input id="password" type="password" placeholder="Enter Password" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setPassword(e.target.value)}  name="password" />
            </div>
            <div className=" grid grid-cols-5 gap--x-2 gap-y-3">
              <label htmlFor="profileImage" className='col-span-1 text-base mb-2 inline-block text-neutral-700 dark:text-neutral-200'>Profile Image</label>
              <input id="profileImage" type="file" placeholder="Enter User Email"  accept=".jpeg, .png, .jpg, .PNG" onChange={(e)=>setProfile(e.target.value)}
              className="form-input col-span-4 relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary" />
            </div>
            <div className="grid grid-cols-6 gap--x-2 gap-y-3 pt-3 pb-3" >
              <label htmlFor="userType" className='col-span-1 text-base'>User Type</label>
              <div className='pl-9'>
                <label htmlFor="userType" className="col-span-2 text-base">
                  <input type="radio" name="default_radio" className="form-radio text-success " onChange={(e)=>setUserType(e.target.value)} />
                  <span>Corporate</span>
                </label>
              </div>
              <div>
                <label htmlFor="usertype" className="col-span-2  text-base">
                  <input type="radio" name="default_radio" className="form-radio text-success " onChange={(e)=>setUserType(e.target.value)} />
                  <span>Sales Center</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
              <label htmlFor="inputPerson" className='col-span-1 text-base '>Sales Center List</label>
              <select className="form-select text-dark col-span-4 text-base" onChange={(e)=>setSalesCenter(e.target.value)}>
                <option value="1">Ashulia Sales Center</option>
                <option value="0">Barisal Sales Center</option>
              </select>
            </div>
            <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
              <label htmlFor="inputPerson" className='col-span-1 text-base ' >Status</label>
              <select className="form-select text-dark col-span-4 text-base" onChange={(e) => setStatus(e.target.value)} required>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div className="flex items-center  justify-center gap-6 pt-8">
              <button type="submit" className="btn btn-success gap-2">
                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                Submit
              </button>
              <Link to={"/pages/user/index"} >
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
  )
}
export default userAdd;









