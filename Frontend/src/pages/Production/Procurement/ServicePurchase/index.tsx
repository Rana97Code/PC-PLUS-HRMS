import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, Fragment, useEffect, useContext  } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import IconPlus from '../../../../components/Icon/IconPlus';
import axios from 'axios';
import UserContext from '../../../../context/UserContex';
import IconEye from '../../../../components/Icon/IconEye';


const index = () => {
    const user = useContext(UserContext);
    const headers = user.headers;
    const baseUrl = user.base_url;

    useEffect(() => {
        axios.get(`${baseUrl}/service_purchase/all_service_purchase`, { headers })
            .then((response) => {
                setInitialRecords(response.data);

            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
    }, [user]);


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Service Purchase Table'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    interface RecordWithIndex {
        [id: string]: any; // Define the type for each property in the record
        index: number; // Add index property
        invoice_no: string;
        vendor_inv: string;
        chalan_date: string;
        supplier_name: string;
        grand_total: string;

    }

    //For Index Number
    const recordsDataWithIndex: RecordWithIndex[] = recordsData.map((record: RecordWithIndex, index: number) => ({
        ...record,
        index: index + 1
    }));

    useEffect(() => {
        setInitialRecords(() => {
            return initialRecords.filter((item: any) => {
                return (
                    item.id.toString().includes(search.toLowerCase()) ||
                    item.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
                    item.vendor_inv.toLowerCase().includes(search.toLowerCase()) ||
                    item.chalan_date.toLowerCase().includes(search.toLowerCase()) ||
                    item.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
                    item.grand_total.toLowerCase().includes(search.toLowerCase()) 
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    // const changeValue = (e: any) => {
    //     const { value, id } = e.target;
    //     setParams({ ...params, [id]: value });
    // };


    const [addContactModal, setAddContactModal] = useState<any>(false);

    const [defaultParams] = useState({
        file: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Production Service Purchase</h2>
                <div className="flex items-center flex-wrap gap-3">
                    <Link to="/pages/procurment/service_purchase/add" className="btn btn-primary gap-1">
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

            <div className="pt-5">
                {/*----------------- User list start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-6">
                            <h5 className="font-semibold text-lg dark:text-white-light">Service Purchase List</h5>
                        </div>
                        <input type="search" className="form-input w-auto" placeholder="Search..." />
                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsDataWithIndex}
                            columns={[
                                { accessor: 'index', title: 'Serial', sortable: true },
                                // { accessor: 'invoice_no', title: 'Invoice No', sortable: true },
                                {
                                    accessor: 'invoice_no', title: 'Invoice No', sortable: false, textAlignment: 'center',
                                    render: ({ id, invoice_no }) => (
                                        <div className="flex gap-4 items-center w-max mx-auto">
                                            <NavLink to={"/pages/invoice/purchase_invoice/" + id} className="flex text-primary m-1 p-2">
                                                <IconEye className="w-4.5 h-3.5 mr-2" />
                                                {invoice_no}
                                            </NavLink>
                                        </div>
                                    ),
                                },
                                { accessor: 'vendor_inv', title: 'Chalan No', sortable: true },
                                { accessor: 'chalan_date', title: 'Chalan Date', sortable: true },
                                { accessor: 'supplier_name', title: 'Supplier Name', sortable: true },
                                { accessor: 'grand_total', title: 'Total', sortable: true },
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
                {/*-------------- User list end -------------*/}

            </div>
        </div>
    );
};

export default index;