import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconPlus from '../../../components/Icon/IconPlus';
import axios from 'axios';


const index = () => {

    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }
        axios.get('http://localhost:8080/bmitvat/api/debit_note/all_debit_note',{headers})
            .then((response) => {
                setInitialRecords(response.data);
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

    useEffect(() => {
        setInitialRecords(() => {
            return initialRecords.filter((item: any) => {
                return (
                    item.serialNo.toString().includes(search.toLowerCase()) ||
                    item.debitNoteNo.toLowerCase().includes(search.toLowerCase()) ||
                    item.dnIssueDate.toLowerCase().includes(search.toLowerCase()) ||
                    item.totalSd.toLowerCase().includes(search.toLowerCase()) ||
                    item.totalVat.toLowerCase().includes(search.toLowerCase()) ||
                    item.grandTotal.toLowerCase().includes(search.toLowerCase()) ||
                    item.action.toLowerCase().includes(search.toLowerCase())
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
                <h2 className="text-xl font-bold">Debit Note</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/pages/purchase/debit_note/add" className="btn btn-primary gap-1">
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

            <div className="pt-5">
                {/*----------------- User list start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-lg dark:text-white-light">Debit Note List</h5>
                        </div>
                        <input type="search" className="form-input w-auto mb-3 " placeholder="Search..." />
                    </div>
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'debitNoteNo', title: 'Debit Invoice', sortable: true },
                                { accessor: 'dnIssueDate', title: 'Issue Date', sortable: true },
                                { accessor: 'totalSd', title: 'Total Amount', sortable: true },
                                { accessor: 'totalVat', title: 'Total Vat', sortable: true },
                                { accessor: 'grandTotal', title: 'Total SD', sortable: true },
                                { accessor: 'id', title: 'Musak', 
                                    sortable: true,
                                    render: ({ id }) => (
                                        <div >
                                            <NavLink to={"/pages/report/mushak/debit_note/"+ id} className="text-cyan-500" target="_blank">
                                                Mushak-6.8
                                            </NavLink>
                                        </div>
                                    ),
                                },
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