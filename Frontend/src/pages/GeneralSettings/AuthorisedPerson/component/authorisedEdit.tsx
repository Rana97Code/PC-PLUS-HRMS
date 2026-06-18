import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';
import UserContex from '../../../../context/UserContex';

const personEdit = () => {
  const [personName, setpersonName] = useState("");
  const [personDescription, setpersonDescription] = useState("");
  const [personPhone, setpersonPhone] = useState("");
  const [personEmail, setpersonEmail] = useState("");
  const [personNid, setpersonNid] = useState("");
  const [personSignature, setpersonSignature] = useState("");
  const [Userid, setUserid] = useState("");

    const params = useParams();
    const navigate = useNavigate();
    const user = useContext(UserContex);
    const baseUrl= user.base_url;

  const getPersonDetails = async()=>{
      if(user.headers){
      const headers= user.headers;

      await axios.get(`${baseUrl}/authorised_person/get_person/${params.id}`, {headers})
          .then((response) => {
              const data = response.data;
              setpersonName(data.authorised_person_name)
              setpersonDescription(data.authorised_person_description)
              setpersonPhone(data.authorised_person_phone)
              setpersonEmail(data.authorised_person_email_address)
              setpersonNid(data.authorised_person_nid_number)
              setpersonSignature(data.authorised_person_signature)
              setUserid(data.authorised_person_user_id)
          })
          .catch((error) => {
              console.error('Error fetching data:', error);

          });

      }


  }
  useEffect(()=>{
    getPersonDetails();
     //handleSubmit;
  }, [user]);


  const Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      // const isFile = personSignature instanceof File;
      // if(isFile){
        //console.log("This is File");

        const person = {
          authorised_person_name: personName,
          authorised_person_description: personDescription,
          authorised_person_phone: personPhone,
          authorised_person_email_address: personEmail,
          authorised_person_nid_number: personNid,
          authorised_person_signature: personSignature,
          user_id: '1',
        };
        console.log(person);

        if(user.token){
          const headers= user.headers;
          // const headers= { Authorization: `Bearer ${bearer}`, 'Content-Type': 'multipart/form-data' }


        try {
           await axios.put(`${baseUrl}/authorised_person/update_person/${params.id}`, person, {headers})
          .then(function (response){
            if(response){
              navigate("/pages/settings/authorised_person/index");
            }
          })

        } catch (err) {
          console.log(err);
        }
        // }
      }else{
        console.log("This is Not a File");
        const imageTag = document.getElementById('myImage') as HTMLImageElement | null;
        if (imageTag) {
            const src = imageTag.src;
            const img_name=src.split('/').pop();
  
            const response = await fetch(src);
            const blob = await response.blob();
            const fileExtension = src.split('.').pop() || 'jpg';
            const file = new File([blob], `${img_name}`, { type: `image/${fileExtension}` });


            const person = {
              authorised_person_name: personName,
              authorised_person_description: personDescription,
              authorised_person_phone: personPhone,
              authorised_person_email_address: personEmail,
              authorised_person_nid_number: personNid,
              authorised_person_signature: personSignature,
              user_id: '1',
            }
            if(user.token){
                const bearer = JSON.parse(user.token);
                const headers= { Authorization: `Bearer ${bearer}`, 'Content-Type': 'multipart/form-data' }
    
    
            try {
               await axios.put(`${baseUrl}/authorised_person/update_person/${params.id}`, person, {headers})
              .then(function (response){
                if(response){
                  navigate("/pages/settings/authorised_person/index");
                }
              })
    
            } catch (err) {
              console.log(err);
            }
            }
        }

      }

      };


  return (
    <div>
    <div >
            <div className="flex items-center justify-between mb-6">
                <h5 className="font-semibold text-lg dark:text-white-light">Authorised Person Edit</h5>
            </div>
            <div className="mb-5 ">
                <form className="space-y-5" onSubmit={Submit}>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Name
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "authorised_person_name" value={personName} onChange={(e) => setpersonName(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Description
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={personDescription} onChange={(e) => setpersonDescription(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Phone
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={personPhone} onChange={(e) => setpersonPhone(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Email
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={personEmail} onChange={(e) => setpersonEmail(e.target.value)} required />
                    </div>

                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person NID
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={personNid} onChange={(e) => setpersonNid(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Signature
                        </label>
                        <div className="flex sm:flex-row flex-col">
                           <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1 " 
                            name = "Person_name"  onChange={(e) => setpersonSignature(e.target.value)} />
                           <img id="myImage" src={'/assets/images/authorised_person/'+ personSignature} className="h-16 w-auto" />
                         </div>
                    </div>
            
                    <div className="flex items-center justify-center gap-6 pt-9">
                       
                            <button type="submit" className="btn btn-success gap-2">
                                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Submit
                            </button>
                    
                         <Link to={"/pages/settings/authorised_person/index"}>
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
export default personEdit;