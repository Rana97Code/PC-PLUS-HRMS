import { useEffect, useState, useContext } from 'react';
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../../context/UserContex';


const addSuupliers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("1");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [bin, setBin] = useState("");
  const [tin, setTin] = useState("");

  interface countrys {
    id: number;
    country_name: string;
  }
  const [countries, setAllCountry] = useState<countrys[]>([]);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const headers = user.headers;
  const baseUrl = user.base_url;


  useEffect(() => {
    if (user) {
      axios.get(`${baseUrl}/country/all_country`, { headers })
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

    handleSubmit;
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const supplier = {
      supplier_name: name,
      supplier_email: email,
      supplier_phone: phone,
      supplier_type: type,
      country_id: country,
      s_address: address,
      s_bin_nid: bin,
      s_tin: tin,
      status: '1',
      user_id: 1
    }

    if (user) {
      try {
        await axios.post(`${baseUrl}/supplier/add-supplier`, supplier, { headers })
          .then(function (response) {
            if (response) {
              navigate("/pages/relationship/suppliers");
            } else {
              navigate("/pages/relationship/suppliers/add");
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
        <h2 className="text-xl font-bold">Suppliers</h2>
      </div>
      <div className="panel mt-6">
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Add New Supplier</h3>
          </div>
          <div className="mb-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suName">Supplier Name</label>
                  <input id="suName" type="text" placeholder="Enter Name" className="form-input" onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="suEmail">Supplier Email</label>
                  <input id="suEmail" type="email" placeholder="Enter Email" className="form-input" onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suPhone">Supplier Phone</label>
                  <input id="suPhone" type="tel" placeholder="Enter Phone Number" className="form-input" onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="supplierType">Supplier Type</label>
                  <div>
                    <select className="form-select text-dark " defaultValue="active" onChange={(e) => setType(e.target.value)} required >
                      <option value="1" selected>Local</option>
                      <option value="2">Foregin</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="tagging">
                <div>
                  <label htmlFor="countryId">Country</label>
                  <select className="form-select text-dark " defaultValue="active" onChange={(e) => setCountry(e.target.value)} required >
                    <option value="1">Select Countries</option>
                    {countries.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.country_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="suAddress">Address</label>
                  <input id="suAddress" type="text" placeholder="Enter Address" defaultValue="1234 Main St" className="form-input" onChange={(e) => setAddress(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suBinNid">BIN/NID</label>
                  <input id="suBinNid" type="tel" placeholder="Enter BIN or NID" className="form-input" onChange={(e) => setBin(e.target.value)} />
                </div>
                <div>
                  <div>
                    <label htmlFor="suTin">TIN</label>
                    <input id="suTin" type="tel" placeholder="Enter TIN" className="form-input" onChange={(e) => setTin(e.target.value)} />
                  </div>
                  <div>
                    <h1 className='mt-5 mb-5'>
                      If Customer type is local then BIN/NID or TIN must be submitted.
                      If Customer type is Foreign then no need BIN/NID or TIN.
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex items-center  justify-center gap-6">
                <button type="submit" className="btn btn-success gap-2">
                  <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Submit
                </button>
                <Link to="/pages/relationship/suppliers">
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

export default addSuupliers;
