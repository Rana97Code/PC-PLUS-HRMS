import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useContext, useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconPlus from '../../../components/Icon/IconPlus';
import axios from 'axios';
import UserContex from '../../../context/UserContex';


const index = () => {
    const user = useContext(UserContex);
    const headers = user.headers;

    useEffect(() => {
        if (user) {
            axios.get(`${user.base_url}/customer/all_customer`, { headers })
                .then((response) => {
                    setInitialRecords(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [user]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Receivable Voucher Table'));
    });


    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'serial', direction: 'asc' });

    interface RecordWithIndex {
        [key: string]: any; // Define the type for each property in the record
        // index: number; // Add index property
        // pinvoiceNo: string;
        receivable_description: string;
        challan_date: string;
        execution_date: string;
        amount: number;
        vat_amount: number;
    }

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
        setInitialRecords(() => {
            return initialRecords.filter((item: any) => {
                return (
                    item.payble_description.toLowerCase().includes(search.toLowerCase()) ||
                    item.challan_date.toLowerCase().includes(search.toLowerCase()) ||
                    item.execution_date.toLowerCase().includes(search.toLowerCase()) ||
                    item.amount.toLowerCase().includes(search.toLowerCase()) ||
                    item.vat_amount.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Receivable Voucher</h2>
                <div className="flex items-center flex-wrap gap-3">
                    <Link to="/pages/reports/receivable_voucher/add" className="btn btn-primary gap-2">
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

            <div className="panel mt-6">

                {/*----------------- Receivable Voucher list start ---------------*/}
                <div className="flex items-center justify-between mb-6">
                    <h5 className="font-semibold text-lg dark:text-white-light">Receivable Voucher List</h5>
                    <input type="text" className="h-12 w-60 border border-slate-300 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none" placeholder="Search..."></input>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsDataWithIndex}
                        columns={[
                            { accessor: 'receivable_description', title: 'Receivable Description', sortable: true },
                            { accessor: 'challan_date', title: 'Challan Date', sortable: true },
                            { accessor: 'execution_date', title: 'Execution Date', sortable: true },
                            { accessor: 'amount', title: 'Amount', sortable: true },
                            { accessor: 'vat_amount', title: 'VAT Amount', sortable: true },
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
                {/*----------------- Receivable Voucher list end ---------------*/}

            </div>
        </div>
    );
};

export default index;
