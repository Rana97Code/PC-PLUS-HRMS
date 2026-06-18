import { useEffect, useState, useContext } from 'react';
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import UserContex from '../../../context/UserContex';

interface countrys {
  id: number;
  country_name: string;
}
const editCustomers = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passport, setPassport] = useState("");
  const [nid, setNID] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [shippingCid, setScId] = useState("");
  const [shippingAdd, setScAddress] = useState("");
  const [bin, setBin] = useState("");
  const [tin, setTin] = useState("");

  const [countries, setAllCountry] = useState<countrys[]>([]);
  const navigate = useNavigate();
  const params = useParams();
  const user = useContext(UserContex);
  const headers = user.headers;


  const getCustomer = async () => {
    if (user) {

      await axios.get(`${user.base_url}/customer/get_customer/${params.id}`, { headers })
        .then((response) => {
          // setInitialRecords(response.data);
          const data = response.data;
          console.log(data);
          setName(data.customer_name)
          setEmail(data.customer_email)
          setPassport(data.passport_no)
          setNID(data.nid_no)
          setPhone(data.customer_phone)
          setType(data.customer_type)
          setCountry(data.country_id)
          setAddress(data.c_address)
          setScId(data.shipping_country_id)
          setScAddress(data.shipping_address)
          setBin(data.c_bin_nid)
          setTin(data.c_tin)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('Token');
    if (token) {
      const bearer = JSON.parse(token);
      const headers = { Authorization: `Bearer ${bearer}` }

      axios.get(`${user.base_url}/country/all_country`, { headers })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setAllCountry(response.data);
          } else {
            throw new Error('Response data is not an array');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    getCustomer();
    handleSubmit;

  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const customer = {
      customer_name: name,
      customer_email: email,
      passport_no: passport,
      nid_no: nid,
      customerPhone: phone,
      customer_phone: address,
      customer_type: type,
      country_id: country,
      c_address: address,
      shipping_country_id: shippingCid,
      shipping_address: shippingAdd,
      c_bin_nid: bin,
      c_tin: tin,
      status: '1',
      user_id: 1
    }

    console.log(customer);

    if (user) {

      try {
        await axios.put(`${user.base_url}/customer/update_customer/${params.id}`, customer, { headers })
          .then(function (response) {
            if (response) {
              navigate("/pages/relationship/customers");
            } else {
              navigate("/pages/relationship/customers/edit");
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
        <h2 className="text-xl font-bold">Customers</h2>
      </div>
      <div className="panel mt-6">
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Edit Customers</h3>
          </div>
          <div className="mb-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suName">Customer Name</label>
                  <input id="suName" type="text" placeholder="Enter Name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="suEmail">Customer Email</label>
                  <input id="suEmail" type="email" placeholder="Enter Email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suPassport">Customer Passport</label>
                  <input id="suPassport" type="tel" placeholder="Enter Passport" className="form-input" value={passport} onChange={(e) => setPassport(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="suNID">Customer NID</label>
                  <input id="suNID" type="tel" placeholder="Enter NID" className="form-input" value={nid} onChange={(e) => setNID(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suPhone">Customer Phone</label>
                  <input id="suPhone" type="tel" placeholder="Enter Phone Number" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="supplierType">Customer Type</label>
                  <div>
                    <select className="form-select text-dark " defaultValue="active" value={type} onChange={(e) => setType(e.target.value)} required >
                      <option value="1">Local</option>
                      <option value="2">Foregin</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="tagging">
              <div>
                  <label htmlFor="countryId">Country</label>
                  <select className="form-select text-dark " defaultValue="active" value={country} onChange={(e) => setCountry(e.target.value)} required >
                    <option value="1">Select Countries</option>
                    {countries.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.country_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="suAddress">Customer Address</label>
                  <input id="suAddress" type="text" placeholder="Enter Address" defaultValue="" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suBinNid">BIN/NID</label>
                  <input id="suBinNid" type="tel" placeholder="Enter BIN or NID" className="form-input" value={bin} onChange={(e) => setBin(e.target.value)} />
                </div>
                <div>
                  <div>
                    <label htmlFor="suTin">TIN</label>
                    <input id="suTin" type="tel" placeholder="Enter TIN Number" className="form-input" value={tin} onChange={(e) => setTin(e.target.value)} />
                  </div>
                  <div>
                    <h1 className='mt-5 mb-5'>
                      If Customer type is local then BIN/NID or TIN must be submitted.
                      If Customer type is Foreign then no need BIN/NID or TIN.
                    </h1>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="tagging">
                <div>
                  <label htmlFor="shippingCountryId">Shipping Country</label>
                  <div>
                    <select className="form-select text-black " value={shippingCid} onChange={(e) => setScId(e.target.value)} required >
                      <option value="1">Select Countries</option>
                      {countries.map((option, index) => (
                        <option key={index} value={option.id}>
                          {option.country_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="shippingAddress">Shipping Address</label>
                  <input id="shippingAddress" type="text" placeholder="Enter Address" className="form-input" value={shippingAdd} onChange={(e) => setScAddress(e.target.value)} required />
                </div>
              </div>
              <div className="flex items-center  justify-center gap-6">
                <button type="submit" className="btn btn-success gap-2">
                  <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Submit
                </button>
                <Link to="/pages/relationship/customers">
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
export default editCustomers;
