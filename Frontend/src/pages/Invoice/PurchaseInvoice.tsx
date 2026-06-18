import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import axios from 'axios';
import UserContext from '../../context/UserContex';

const PurchaseInvoice = () => {
    const params = useParams();
    const user = useContext(UserContext);
    const headers = user.headers;
    const baseUrl = user.base_url;

    useEffect(() => {
        if (user) {
        axios.get(`${baseUrl}/purchase/purchase_invoice/${params.id}`,{headers})
            .then((response) => {
                setRawMaterialsRecords(response.data.items);
                setChalanDate(response.data.chalan_date);
                setSuppliersName(response.data.supplier_name);
                setSuppliersEmail(response.data.supplier_email);
                setSuppliersPhone(response.data.supplier_phone);
                setSuppliersCountry(response.data.country_name);
                setSuppliersAddress(response.data.s_address);
                setSuppliersTin(response.data.s_tin);
                setSuppliersType(response.data.supplier_type);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Export Table'));
    });

      interface RecordWithIndex {
        [key: string]: any; // Define the type for each property in the record
        index: number; // Add index property
        serial: string;
        item_name: string;
        hs_code: string;
        qty: number;
        rate: number;
        access_amount: number;
        sd_amount: number;
        vatable_value: number;
        vat_amount: number;
        item_total: number;
    }

    const [chalanDate, setChalanDate] = useState();
    const [supplierName, setSuppliersName] = useState();
    const [supplierEmail, setSuppliersEmail] = useState();
    const [supplierPhone, setSuppliersPhone] = useState();
    const [supplierCountry, setSuppliersCountry] = useState();
    const [supplierAddress, setSuppliersAddress] = useState();
    const [supplierTin, setSuppliersTin] = useState();
    const [supplierType, setSuppliersType] = useState();





    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setRawMaterialsRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    //For Index Number
    const recordsDataWithIndex: RecordWithIndex[] = recordsData.map((record: RecordWithIndex, index: number) => ({
        ...record,
        index: index + 1 
    }));


    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setRawMaterialsRecords(() => {
            return initialRecords.filter((item: any) => {
                return (
                    item.index.toString().includes(search.toLowerCase()) ||
                    item.item_name.toLowerCase().includes(search.toLowerCase()) ||
                    item.hs_code.toLowerCase().includes(search.toLowerCase()) ||
                    item.qty.toLowerCase().includes(search.toLowerCase()) ||
                    item.rate.toLowerCase().includes(search.toLowerCase()) ||
                    item.access_amount.toLowerCase().includes(search.toLowerCase()) ||
                    item.sd_amount.toLowerCase().includes(search.toLowerCase()) ||
                    item.vatable_value.toLowerCase().includes(search.toLowerCase()) ||
                    item.vat_amount.toLowerCase().includes(search.toLowerCase()) ||
                    item.item_total.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Invoice</h2>
            </div>

            <div className="pt-2">
                {/*----------------- Invoice Form start ---------------*/}
                <div className="panel col-span-3 mt-6" id="stack_form" >
                    <div id="forms_grid">
                        <div className="mt-2">
                            <form className="space-y-2">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Supplier Name:</label>
                                            <p className="flex-1 text-sm font-medium">{supplierName}</p>
                                        </div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Supplier Phone:</label>
                                            <p className="flex-1 text-sm font-medium">{supplierPhone} </p>
                                        </div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Supplier Email:</label>
                                            <p className="flex-1 text-sm font-medium">{supplierEmail} </p>
                                        </div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Supplier Address:</label>
                                            <p className="flex-1 text-sm font-medium"> {supplierAddress}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Date:</label>
                                            <p className="flex-1 text-sm font-medium">{chalanDate} </p>
                                        </div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Supplier Type:</label>
                                            {supplierType === 1 ? (
                                                <p className="flex-1 text-sm font-medium">Local</p>
                                            ) : (
                                                <p className="flex-1 text-sm font-medium">Foreign</p>
                                            )}
                                        </div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Supplier TIN:</label>
                                            <p className="flex-1 text-sm font-medium">{supplierTin} </p>
                                        </div>
                                        <div className='flex sm:flex-row flex-col pb-3'>
                                            <label htmlFor="cuPhone" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 font-bold text-sm">Country Name:</label>
                                            <p className="flex-1 text-sm font-medium">{supplierCountry} </p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/*----------------- Invoice Table start ---------------*/}
                <div className="datatables mt-7">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsDataWithIndex}
                        columns={[
                            { accessor: 'index', title: 'Serial', sortable: true },
                            { accessor: 'item_name', title: 'Item Name', sortable: true },
                            { accessor: 'hs_code', title: 'HS-Code', sortable: true },
                            { accessor: 'qty', title: 'Quantity', sortable: true },
                            { accessor: 'rate', title: 'Rate', sortable: true },
                            { accessor: 'access_amount', title: 'Value', sortable: true },
                            { accessor: 'sd_amount', title: 'Sd Amount', sortable: true },
                            { accessor: 'vatable_value', title: 'Vatable Amount', sortable: true },
                            { accessor: 'vat_amount', title: 'Vat Amount', sortable: true },
                            { accessor: 'item_total', title: 'Total Amount', sortable: true },
                        ]}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>

    );
};

export default PurchaseInvoice;