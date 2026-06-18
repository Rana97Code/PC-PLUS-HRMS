import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useContext,useEffect, useState } from 'react';
import IconMail from '../../../components/Icon/IconMail';
import IconPhone from '../../../components/Icon/IconPhone';
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import change from "../../../../public/assets/images/change-password.svg"
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import UserContex from '../../../context/UserContex';


const profile = () => {
    const user = useContext(UserContex);
    const baseUrl= user.base_url;

    // const dispatch = useDispatch();
    const [user_id,setUserId]=useState("");
    const [username,setName]=useState("");
    const [userProfile,setTokenProfile]=useState("");
    const [useremail,setTokenEmail]=useState("");
    const [userphone,setTokenPhone]=useState("");

    //for form data
    const [userName, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [uEmail, setEmail] = useState("");
    const [userPhone, setPhone] = useState("");
    const [userNid, setNid] = useState("");
    const [nidScan, setNidImg] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [profileImage, setProfile] = useState<File | null>(null);
    const [saleCenterId, setSalesCenter] = useState("");
    const [userType, setUserType] = useState("");
    const [status, setStatus] = useState("");

    const params = useParams();
    const navigate = useNavigate();



    useEffect(() => {
        // dispatch(setPageTitle('Profile'));

             //Data from session token
             const token = localStorage.getItem('Token');
             if(token){
     
               const jwt = jwtDecode(token);
                    var user = jwt.sub;
                    var email = (jwt as any).u_email;
                    var profile = (jwt as any).pro_pic;
                    var uphone = (jwt as any).u_phone;
                    // var user_id = (jwt as any).u_id;
                 //    console.log(user);
     
                 if (user !== undefined) {
                    setName(user);
                 }
                    // setUserId(user_id);
                    setTokenEmail(email);
                    setTokenProfile(profile);
                    setTokenPhone(uphone);
     
             }
             getUserDetails();
    },[]);




  const getUserDetails = async()=>{
        const token = localStorage.getItem('Token');
        if(token){
            const jwt = jwtDecode(token);
            var userid = (jwt as any).u_id;

            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }


        await axios.get(`${baseUrl}/bmitvat/api/get_user/${userid}`,{headers})
            .then((response) => {
                // setInitialRecords(response.data);
                const data = response.data;
                // console.log(data);
                setFirstName(data.firstName)
                setLastName(data.lastName)
                setEmail(data.userEmail)
                setPhone(data.userPhone)
                setNid(data.userNid)
                setProfile(data.profileImage)
                setNidImg(data.nidScan)
                setUserId(data.id);

            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
         }

    }



      
     



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

    
            // if(nidScan && profileImage){
            if(profileImage){
            const formData = new FormData();
            // formData.append('username', userName);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('userEmail', uEmail);
            formData.append('userPhone', userPhone);
            formData.append('userNid', userNid);
            // formData.append('nidScan', nidScan);
            // formData.append('password', password);
            formData.append('profileImage', profileImage);
            // formData.append('saleCenterId', saleCenterId);
            // formData.append('userType', userType);
            // formData.append('status', status);
            formData.append('createdBy', `0`);
            formData.append('updatedBy', `0`);
            
            
            
            try {
                console.warn(formData);
                const token = localStorage.getItem('Token');
                if(token){
                const bearer1 = JSON.parse(token);
        
                const headers= { Authorization: `Bearer ${bearer1}`,'Content-Type': 'multipart/form-data'  }
                await axios.put(`${baseUrl}/bmitvat/api/update_user/${user_id}`, formData, {headers})
                .then(function (response) {
                    // console.log(response);
                    navigate("/index");
                    console.warn("Insert Successfull");
                })
            
                .catch(function(error) {
                console.warn("Insert Unsuccessfull");
                navigate("/pages/user/profile");
                })
            }
            } catch (err) {
                console.log(err);
            }

            }
    
    }




    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 mb-3">
                <h2 className="text-lg">Profile Information</h2>
            </div>
            <div className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-5 mb-5">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                        </div>
                        <div className="mb-6">
                            <div className="flex flex-col justify-center items-center">
                                <img src={'/assets/images/users/'+ userProfile} alt="img" className="w-24 h-24 rounded-full object-cover  mb-5" />
                                <p className="font-semibold text-primary text-xl">{username}</p>
                            </div>
                            <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconMail className="w-5 h-5 shrink-0" />
                                        <span className="text-primary truncate">{useremail}</span>
                                    </button>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span className="whitespace-nowrap" dir="ltr">
                                        {userphone}
                                    </span>
                                </li>
                                <button type="button" className="btn btn-success ">
                                    <img src={change} alt="" className='w-8 h-8' />
                                    <span className="whitespace-nowrap" dir="ltr">
                                        Change password
                                    </span>
                                </button>
                            </ul>
                        </div>
                    </div>
                    <div className=" lg:col-span-8 xl:col-span-3">
                        <div className="panel flex items-center justify-between flex-wrap gap-4 mb-3">
                            <h2 className="text-lg">Information</h2>
                        </div>
                        {/* Horizontal */}
                        <div className="panel " id="user_form">
                            <div className="flex items-center justify-between mb-7">
                                <div className="mb-4">
                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                First Name
                                            </label>
                                            <input id="horizontalEmail" type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="form-input flex-1" required />
                                        </div>
                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Last Name
                                            </label>
                                            <input id="horizontalEmail" type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} className="form-input flex-1" required />
                                        </div>
                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Email
                                            </label>
                                            <input id="horizontalEmail" type="email" value={useremail} onChange={(e)=>setEmail(e.target.value)} className="form-input flex-1" required />
                                        </div>
                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Phone
                                            </label>
                                            <input id="horizontalEmail" type="text" value={userPhone} onChange={(e)=>setPhone(e.target.value)} className="form-input flex-1" required />
                                        </div>
                                        <div className="flex sm:flex-row flex-col ">
                                            <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Profile Pic
                                            </label>
                                                <input id="horizontalEmail" type="file" onChange={(e)=>setProfile(e.target.files![0])} className="form-input flex-1" required />
                                                {/* <span className="text-white-dark">Images only (image/*)
                                                </span> */}
                                        </div>
                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                NDI Number
                                            </label>
                                            <input id="horizontalEmail" type="text" value={userNid} onChange={(e)=>setNid(e.target.value)} className="form-input flex-1" required />
                                        </div>
                                        <div className="flex items-center  justify-center gap-6">
                                            <button type="submit" className="btn btn-primary gap-2">
                                                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                Submit
                                            </button>
                                            <Link to={"/index"} >
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
                </div>
            </div>
        </div>
    );
};

export default profile;
