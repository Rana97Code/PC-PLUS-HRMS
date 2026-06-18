import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, Fragment, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
// import { Dialog, Transition } from '@headlessui/react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
// import IconFile from '../../../../components/Icon/IconFile';
// import IconPlus from '../../../../components/Icon/IconPlus';
// import IconEdit from '../../../../components/Icon/IconEdit';
// import IconSettings from '../../../../components/Icon/IconSettings';
// import IconTrashLines from '../../../../components/Icon/IconTrashLines';
// import IconX from '../../../../components/Icon/IconX';
// import IconSend from '../../../../components/Icon/IconSend';
import axios from 'axios';


const index = () => {

const col = ['nidImage', 'userID', 'email', 'phone', 'nid', 'terminationDate', 'terminationReason'];
    useEffect(() => {
        axios.get('http://localhost:8080/bmitvat/api/v1/unit/allunits')
            .then((response) => {
                setInitialRecords(response.data);

            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
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
                    item.nidImage.toString().includes(search.toLowerCase()) ||
                    item.userId.toString().includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.phone.toLowerCase().includes(search.toLowerCase()) ||
                    item.nid.toLowerCase().includes(search.toLowerCase()) ||
                    item.terminationDate.toLowerCase().includes(search.toLowerCase())||
                    item.terminationReason.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);
    const header = ['Nid Image', 'User Id', 'Email', 'Phone', 'NID', 'Termination Date', 'Termination Reason'];

    // const changeValue = (e: any) => {
    //     const { value, id } = e.target;
    //     setParams({ ...params, [id]: value });
    // };


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Employee</h2>
            </div>
            <div className="pt-5">

                {/*----------------- User view list start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex items-center justify-between mb-6">
                        <h5 className="font-semibold text-lg dark:text-white-light">User View List</h5>
                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'nid', title: 'NID Image', sortable: true },
                                { accessor: 'userName', title: 'User Id', sortable: true },
                                { accessor: 'email', title: 'Email',sortable: true },
                                { accessor: 'phone', title: 'Phone', sortable: true },
                                { accessor: 'nid', title: 'NID', sortable: true },
                                { accessor: 'terminationDate', title: 'Termination Date', sortable: true },
                                { accessor: 'terminationReason', title: 'Termination Reason', sortable: true },

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
                {/*-------------- User view list end -------------*/}

            </div>
        </div>
    );
};

export default index;