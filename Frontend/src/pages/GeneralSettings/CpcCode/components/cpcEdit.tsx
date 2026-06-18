import React, { useContext,useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../.././context/UserContex';
import { preventDefault } from '@fullcalendar/core/internal';

const cpcEdit = () => {
    const [cpcName, setName]=useState("");
    const [cpcCode, setType]=useState("");
    const [cpcStatus, setStatus]=useState("");

    const params = useParams();
    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl= user.base_url;

    const getCpcDetails = async()=>{
       if(user.headers){
        const headers= user.headers;

        await axios.get(`${baseUrl}/cpc/get_cpc/${params.id}`,{headers})
            .then((response) => {
                // setInitialRecords(response.data);
                const data = response.data;
                //console.log(data);
                setName(data.cpc_name)
                setType(data.cpc_code)
                setStatus(data.cpc_status)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
        }
    }
    useEffect(()=>{
      getCpcDetails();  //create this function
      //handleSubmit;
    },[user])  //Use array


    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const cpc = {
          cpc_name: cpcName,
          cpc_code: cpcCode,
          cpc_status: cpcStatus,
          user_id: '1'
        }

        //console.log(costing);
        if(user){
          const headers= { Authorization: `Bearer ${user.token}` }
        try {
            
           await axios.put(`${baseUrl}/cpc/update_cpc/${params.id}`, cpc, {headers})
          .then(function (response){
            if(response){
              navigate("/pages/cpccode/list");
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
        <h2 className="text-xl">CPC Code</h2>
      </div>
      <div className="panel mt-6">
        {/* Grid */}
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Cpc Edit</h3>
          </div>
          <div className="mb-5">
           
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="cpcName" className='col-span-1 text-base'>Cpc Name</label>
                  <input id="cpcName" type="text" placeholder="Enter CPC Name" className="form-input py-2.5 text-base col-span-4" name ="cpc_name" value={cpcName} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="cpcCode" className='col-span-1 text-base'>Cpc Code</label>
                  <input id="cpcCode" type="text" placeholder="Enter CPC Code" className="form-input py-2.5 text-base col-span-4" name ="cpc_code" value={cpcCode} onChange={(e) => setType(e.target.value)} required>
                  </input>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="cpcStatus" className='col-span-1 text-base'>Cpc Status</label>
                  <select className="form-select text-dark col-span-4 text-base" value={cpcStatus} onChange={(e) => setStatus(e.target.value)} name ="cpc_status" required>
                  <option >Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 pt-8">
                <button type="submit" className="btn btn-success gap-2" >
                  <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> Update
                </button>
                <Link to={"/pages/cpccode/list"} >
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
export default cpcEdit;











// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from "react-router-dom";
// import IconFile from '../../../../components/Icon/IconFile';
// import IconTrashLines from '../../../../components/Icon/IconTrashLines';
// import axios from 'axios';


// const costingEdit = () => {
//     const [costing_name,setCpcDes]=useState("");
//     const params = useParams();
//     const navigate = useNavigate();

//     const getCostingDetails = async()=>{
//         const token = localStorage.getItem('Token');
//         if(token){
//             const bearer = JSON.parse(token);
//             const headers= { Authorization: `Bearer ${bearer}` }

//         await axios.get(`http://localhost:8080/bmitvat/api/cpc/get_cpc/${params.id}`,{headers})
//             .then((response) => {
//                 // setInitialRecords(response.data);
//                 const data = response.data;
//                 setCpcDes(data.cpcDescription)

//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);

//             });
//         }
//     }
//     useEffect(()=>{
//       getCostingDetails();   //create this function
//     },[])  //Use array
//     const handleSubmit = async () => {
//         const costing = {
//           cpcDescription: costing_name,
//           createdBy: '1',

//           cpc_name: cpcName,
//           cpc_code: costingType,
//           cpc_status: cpcStatus,
//           user_id: '1'
//         }

//         const token = localStorage.getItem('Token');
//         if(token){
//             const bearer = JSON.parse(token);
//             const headers= { Authorization: `Bearer ${bearer}` }


//         try {
//             console.log(costing);
//            await axios.put(`http://localhost:8080/bmitvat/api/cpc/update_cpc/${params.id}`, costing, {headers})
//           .then(function (response){
//             if(response){
//               navigate("/pages/cpccode/list");
//             }
//           })
//           // if(response.status==200){
//           // }else{
//           //   console.warn("Insert Unsuccessfull");
//           //   navigate("/pages/settings/unit/add");
//           // }
//         } catch (err) {
//           console.log(err);
//         }
//         }
//       };


//   return (
//     <div>
//       <div className="panel flex items-center justify-between flex-wrap gap-4">
//         <h2 className="text-xl">Cpc</h2>
//       </div>
//       <div className="panel mt-6">
//         {/* Grid */}
//         <div id="forms_grid">
//           <div className="flex items-center justify-between mb-5">
//             <h3 className="font-semibold text-lg dark:text-white-light">Edit CPC</h3>
//           </div>
//           <div className="mb-5">
//             {/*
//             <form className="space-y-5" onSubmit={handleSubmit}> */}
//             <form className="space-y-5">
//               <div className="grid  gap-4">
//                 <div className="grid grid-cols-5 gap--x-2 gap-y-3">
//                   <label htmlFor="cpc_name" className='col-span-1 text-base'>CPC Name :</label>
//                   <input id="cpc_name" type="text" placeholder="Enter CPC Name" className="form-input py-2.5 text-base col-span-4" name ="cpc_name" value={cpc_name} onChange={(e) => setCpcDes(e.target.value)} required />
//                 </div>
//               </div>

//               <div className="flex items-center  justify-center gap-6 pt-8">
//                 <button type="submit" className="btn btn-success gap-2" onClick={handleSubmit}>
//                   <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
//                   Submit
//                 </button>
//                 <Link to={"/pages/cpccode/list"} >
//                 <button type="button" className="btn btn-danger gap-2" >
//                   <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
//                   Cancel
//                 </button>
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// export default costingEdit;