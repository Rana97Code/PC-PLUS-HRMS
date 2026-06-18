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


const personAdd = () => {
    const [personName, setpersonName] = useState("");
    const [personDescription, setpersonDescription] = useState("");
    const [personPhone, setpersonPhone] = useState("");
    const [personEmail, setpersonEmail] = useState("");
    const [personNid, setpersonNid] = useState("");
    const [personSignature, setpersonSignature] = useState("");
    //const [Userid, setUserid] = useState("");

    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl = user.base_url;
  
    useEffect(() => {
      handleSubmit;
  }, []);
  
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

      const authorised_person = {
        authorised_person_name: personName,
        authorised_person_description: personDescription,
        authorised_person_phone: personPhone,
        authorised_person_email_address: personEmail,
        authorised_person_nid_number: personNid,
        authorised_person_signature: personSignature,
        user_id : 1, 
      }

  
      if(user.token){
        const headers= { Authorization: `Bearer ${user.token}` }
  
      try {
         axios.post(`${baseUrl}/authorised_person/add-person`, authorised_person, {headers})
          .then(function (response) {
            if(response){
              navigate("/pages/settings/authorised_person/index");
            }else{
              navigate("/pages/settings/authorised_person/add");
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
                <h2 className="text-xl font-bold">Add New Authorised Person</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className='panel'>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="personName" className='col-span-1 text-base'>Person Name</label>
                                <input type="text" placeholder="Enter Person Name" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setpersonName(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="personDescription" className='col-span-1 text-base'>Person Description</label>
                                <input type="text" placeholder="Enter Person Description" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setpersonDescription(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="personPhone" className='col-span-1 text-base'>Person Phone</label>
                                <input type="text" placeholder="Enter Person Phone" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setpersonPhone(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="personEmail" className='col-span-1 text-base'> Person Email</label>
                                <input type="email" placeholder="Enter Person E-mail" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setpersonEmail(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="personNid" className='col-span-1 text-base'>Person NID</label>
                                <input type="text" placeholder="Enter Person NID" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setpersonNid(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="personSignature" className='col-span-1 text-base'>Person Signature</label>
                                <input type="file" placeholder="Enter Person Signature" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setpersonSignature(e.target.value)} />
                            </div>
                            {/* <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="user_id" className='col-span-1 text-base'>User ID</label>
                                <input type="text" placeholder="Enter User ID" className="form-input py-2.5 text-base col-span-4" onChange={(e) => setUserid(e.target.value)} required />
                            </div> */}

                            
                            <div className="flex items-center  justify-center gap-6">
                                <button type="submit" className="btn btn-primary gap-2">
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Submit

                                </button>
                                <Link to="/pages/settings/authorised_person/index">
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

export default personAdd;

// import React, { useState,useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import IconFile from '../../../../components/Icon/IconFile';
// import IconTrashLines from '../../../../components/Icon/IconTrashLines';
// import axios from 'axios';
// import UserContex from '../../../../context/UserContex';


// const personAdd = () => {
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [phone, setPhone] = useState("");
//     const [email, setEmail] = useState("");
//     const [nid, setNid] = useState("");
//     const [signature, setSignature] = useState<File | null>(null);
//     const navigate = useNavigate();
//     const user = useContext(UserContex);
//     const baseUrl= user.base_url;
  
//     useEffect(() => {
//       handleSubmit;
//   }, []);
  
//     const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
//       const authorised_person = {
//         authorised_person_name: name,
//         authorised_person_description: description,
//         authorised_person_phone: phone,
//         authorised_person_email_address: email,
//         authorised_person_nid_number: nid,
//         authorised_person_signature: signature,
//         // user_id: userid,
//       }
//   console.log(authorised_person)
  
//       if(user.token){
//       const headers= { Authorization: `Bearer ${user.token}`}
  
//       try {
//          await axios.post(`${baseUrl}/authorised_person/add-person`,authorised_person, {headers})
//           .then(function (response) {
//             if(response){
//               navigate("/pages/settings/authorised_person/index");
//               console.log("Successfully Add");
//             }else{
//               navigate("/pages/settings/authorised_person/add");
//             }
//           })
  
//       } catch (err) {
//         console.log(err);
//       }
//     }
  
//     }


//     return (
//         <div>
//             <div id="form">
//                     <div className="flex items-center justify-between mb-6">
//                         <h5 className="font-semibold text-lg dark:text-white-light">Authorised Person Add</h5>
//                     </div>
//                     <div className="mb-5 ">
//                         <form className="space-y-5" onSubmit={handleSubmit}>
//                             <div className="flex sm:flex-row flex-col">
//                                 <label htmlFor="name" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
//                                   Person Name
//                                 </label>
//                                 <input id="name" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
//                                  name = "authorised_person_name" onChange={(e) => setName(e.target.value)} required />
//                             </div>
//                             <div className="flex sm:flex-row flex-col">
//                                 <label htmlFor="authorised_person_description" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
//                                   Person Description
//                                 </label>
//                                 <input id="authorised_person_description" type="text" placeholder="Enter Person Description" className="form-input flex-1" 
//                                  name = "authorised_person_description" onChange={(e) => setDescription(e.target.value)} required />
//                             </div>
//                             <div className="flex sm:flex-row flex-col">
//                                 <label htmlFor="authorised_person_phone" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
//                                   Person Phone
//                                 </label>
//                                 <input id="authorised_person_phone" type="text" placeholder="Enter Person Phone" className="form-input flex-1" 
//                                  onChange={(e) => setPhone(e.target.value)} required />
//                             </div>
//                             <div className="flex sm:flex-row flex-col">
//                                 <label htmlFor="authorised_person_email_address" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
//                                   Person Email
//                                 </label>
//                                 <input id="authorised_person_email_address" type="text" placeholder="Enter Person Email" className="form-input flex-1" 
//                                   onChange={(e) => setEmail(e.target.value)} required />
//                             </div>

//                             <div className="flex sm:flex-row flex-col">
//                                 <label htmlFor="authorised_person_nid_number" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
//                                   Person NID
//                                 </label>
//                                 <input id="authorised_person_nid_number" type="text" placeholder="Enter Person NID" className="form-input flex-1" 
//                                   onChange={(e) => setNid(e.target.value)} required />
//                             </div>
//                             <div className="flex sm:flex-row flex-col">
//                                 <label htmlFor="authorised_person_signature" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
//                                   Person Signature
//                                 </label>
//                                 <input id="authorised_person_signature" type="file" placeholder="Enter Person Signature" className="form-input flex-1" 
//                                   onChange={(e) => setSignature(e.target.files![0])} /> 
//                             </div>
                    
//                             <div className="flex items-center justify-center gap-6 pt-9">
                               
//                                     <button type="submit" className="btn btn-success gap-2">
//                                         <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
//                                         Submit
//                                     </button>
                            
//                                  <Link to={"/pages/settings/authorised_person/index"}>
//                                     <button type="button" className="btn btn-danger gap-2" >
//                                         <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
//                                         Cancel
//                                     </button>
//                                 </Link>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//         </div>
//     )
// }
// export default personAdd;