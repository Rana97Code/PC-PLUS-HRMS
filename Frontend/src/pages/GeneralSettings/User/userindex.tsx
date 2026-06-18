import React from 'react';
import { Link, NavLink } from 'react-router-dom';
// import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconFile from '../../../components/Icon/IconFile';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconSettings from '../../../components/Icon/IconSettings';
import IconTrashLines from '../../../components/Icon/IconTrashLines';

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../../components/Icon/IconX';

import IconSend from '../../../components/Icon/IconSend';


const rowData = [
    {
        id: 1,
        userName: 'superadmin',
        email: 'arifulislamfiverr007@gmail.com',
        role: 'superadmin',
        costingType: 'Direct Cost',
        status: { tooltip: 'Active', color: 'success' },
        action: '',
    },
    {
        id: 2,
        userName: 'Bank charges',
        email: 'barisal@email.com',
        role: 'Sales Center',
        costingType: 'Indirect Cost',
        status: { tooltip: 'Inactive', color: 'danger' },
        action: '',
    },

];
const col = ['id', 'userName', 'email', 'role', 'action', 'terminationProcess', 'status'];


const index = () => {


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Export Table'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
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
            return rowData.filter((item: any) => {
                return (
                    item.id.toString().includes(search.toLowerCase()) ||
                    item.userName.toLowerCase().includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.role.toLowerCase().includes(search.toLowerCase()) ||
                    item.action.toLowerCase().includes(search.toLowerCase()) ||
                    item.terminationProcess.toLowerCase().includes(search.toLowerCase()) ||
                    item.status.tooltip.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);
    const header = ['Id', 'User Name', 'Email', 'Role', 'Action', 'Termination Process', 'Status'];


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
                <h2 className="text-xl font-bold">Employee</h2>
                <div className="flex items-center flex-wrap gap-3">
                    <Link to="/pages/user/add" className="btn btn-primary gap-1">
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

            <div className="pt-5">
                {/*----------------- Costing list start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex items-center justify-between mb-6">
                        <h5 className="font-semibold text-lg dark:text-white-light">Employee List</h5>

                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'id', title: 'Id', sortable: true },
                                { accessor: 'userName', title: 'Costing Name', sortable: true },
                                { accessor: 'email', sortable: true },
                                { accessor: 'role', sortable: true },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ action }) => (
                                        <div className="flex gap-4 items-center w-max mx-auto">
                                            <NavLink to="/pages/user/view" className="flex btn btn-success btn-sm m-1 p-2">
                                                <IconFile className="w-4.5 h-4.5 mr-2" />
                                                View
                                            </NavLink>
                                            <NavLink to="/pages/user/edit" className="flex btn btn-secondary btn-sm m-1 p-2">
                                                <IconEdit className="w-4.5 h-4.5 mr-2" />
                                                Edit
                                            </NavLink>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'terminationProcess',
                                    title: 'Termination Process',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ }) => (
                                        <div className="flex gap-4 items-center w-max mx-auto">
                                                <div>
                                                    <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                                        <IconSettings className="w-4.5 h-4.5 mr-2" />
                                                        Terminate
                                                    </button>
                                                </div>


                                                <Transition appear show={addContactModal} as={Fragment}>
                                                    <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                                                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                            <div className="fixed inset-0 bg-[black]/60" />
                                                        </Transition.Child>
                                                        <div className="fixed inset-0 overflow-y-auto">
                                                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                                                <Transition.Child
                                                                    as={Fragment}
                                                                    enter="ease-out duration-300"
                                                                    enterFrom="opacity-0 scale-95"
                                                                    enterTo="opacity-100 scale-100"
                                                                    leave="ease-in duration-200"
                                                                    leaveFrom="opacity-100 scale-100"
                                                                    leaveTo="opacity-0 scale-95"
                                                                >
                                                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setAddContactModal(false)}
                                                                            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                                                        >
                                                                            <IconX />
                                                                        </button>
                                                                        <div className="p-5">
                                                                            <form>

                                                                                <div className="mb-5">
                                                                                    <label htmlFor="address">Message</label>
                                                                                    <textarea
                                                                                        id="location"
                                                                                        rows={3}
                                                                                        placeholder="Enter Message"
                                                                                        className="form-textarea resize-none min-h-[130px]"
                                                                                    // value={params.location}
                                                                                    // onChange={(e) => changeValue(e)}
                                                                                    ></textarea>
                                                                                </div>
                                                                                <div className="flex justify-end items-center mt-8">
                                                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                                                        <IconTrashLines className="ltr:mr-2 rtl:ml-2 " />
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button type="button" className="btn btn-outline-success ltr:ml-4 rtl:mr-4" onClick={() => setAddContactModal(false)}>
                                                                                        <IconSend className="ltr:mr-2 rtl:ml-2 " />
                                                                                        Upload
                                                                                    </button>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </Dialog.Panel>
                                                                </Transition.Child>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </Transition>

                                            </div>
                                        // <div className='flex gap-4 items-center'>
                                        //     <div className="flex gap-4 items-center w-max mx-auto">
                                        //         <div>
                                        //             <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                        //                 <IconSettings className="w-4.5 h-4.5 mr-2" />
                                        //                 Terminate
                                        //             </button>
                                        //         </div>


                                        //         <Transition appear show={addContactModal} as={Fragment}>
                                        //             <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                                        //                 <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        //                     <div className="fixed inset-0 bg-[black]/60" />
                                        //                 </Transition.Child>
                                        //                 <div className="fixed inset-0 overflow-y-auto">
                                        //                     <div className="flex min-h-full items-center justify-center px-4 py-8">
                                        //                         <Transition.Child
                                        //                             as={Fragment}
                                        //                             enter="ease-out duration-300"
                                        //                             enterFrom="opacity-0 scale-95"
                                        //                             enterTo="opacity-100 scale-100"
                                        //                             leave="ease-in duration-200"
                                        //                             leaveFrom="opacity-100 scale-100"
                                        //                             leaveTo="opacity-0 scale-95"
                                        //                         >
                                        //                             <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        //                                 <button
                                        //                                     type="button"
                                        //                                     onClick={() => setAddContactModal(false)}
                                        //                                     className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        //                                 >
                                        //                                     <IconX />
                                        //                                 </button>
                                        //                                 <div className="p-5">
                                        //                                     <form>

                                        //                                         <div className="mb-5">
                                        //                                             <label htmlFor="address">Message</label>
                                        //                                             <textarea
                                        //                                                 id="location"
                                        //                                                 rows={3}
                                        //                                                 placeholder="Enter Message"
                                        //                                                 className="form-textarea resize-none min-h-[130px]"
                                        //                                             // value={params.location}
                                        //                                             // onChange={(e) => changeValue(e)}
                                        //                                             ></textarea>
                                        //                                         </div>
                                        //                                         <div className="flex justify-end items-center mt-8">
                                        //                                             <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                        //                                                 <IconTrashLines className="ltr:mr-2 rtl:ml-2 " />
                                        //                                                 Cancel
                                        //                                             </button>
                                        //                                             <button type="button" className="btn btn-outline-success ltr:ml-4 rtl:mr-4" onClick={() => setAddContactModal(false)}>
                                        //                                                 <IconSend className="ltr:mr-2 rtl:ml-2 " />
                                        //                                                 Upload
                                        //                                             </button>
                                        //                                         </div>
                                        //                                     </form>
                                        //                                 </div>
                                        //                             </Dialog.Panel>
                                        //                         </Transition.Child>
                                        //                     </div>
                                        //                 </div>
                                        //             </Dialog>
                                        //         </Transition>

                                        //     </div>
                                        //     <div className="flex gap-4 items-center w-max mx-auto">
                                        //         <div>
                                        //             <button type="button" className="btn btn-warning" onClick={() => editUser()}>
                                        //                 <IconSettings className="w-4.5 h-4.5 mr-2" />
                                        //                 Rejoin
                                        //             </button>
                                        //         </div>


                                        //         <Transition appear show={addContactModal} as={Fragment}>
                                        //             <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                                        //                 <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        //                     <div className="fixed inset-0 bg-[black]/60" />
                                        //                 </Transition.Child>
                                        //                 <div className="fixed inset-0 overflow-y-auto">
                                        //                     <div className="flex min-h-full items-center justify-center px-4 py-8">
                                        //                         <Transition.Child
                                        //                             as={Fragment}
                                        //                             enter="ease-out duration-300"
                                        //                             enterFrom="opacity-0 scale-95"
                                        //                             enterTo="opacity-100 scale-100"
                                        //                             leave="ease-in duration-200"
                                        //                             leaveFrom="opacity-100 scale-100"
                                        //                             leaveTo="opacity-0 scale-95"
                                        //                         >
                                        //                             <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        //                                 <button
                                        //                                     type="button"
                                        //                                     onClick={() => setAddContactModal(false)}
                                        //                                     className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        //                                 >
                                        //                                     <IconX />
                                        //                                 </button>
                                        //                                 <div className="p-5">
                                        //                                     <form>

                                        //                                         <div className="mb-5">
                                        //                                             <label htmlFor="address">Message</label>
                                        //                                             <textarea
                                        //                                                 id="location"
                                        //                                                 rows={3}
                                        //                                                 placeholder="Enter Message"
                                        //                                                 className="form-textarea resize-none min-h-[130px]"
                                        //                                             // value={params.location}
                                        //                                             // onChange={(e) => changeValue(e)}
                                        //                                             ></textarea>
                                        //                                         </div>
                                        //                                         <div className="flex justify-end items-center mt-8">
                                        //                                             <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                        //                                                 <IconTrashLines className="ltr:mr-2 rtl:ml-2 " />
                                        //                                                 Cancel
                                        //                                             </button>
                                        //                                             <button type="button" className="btn btn-outline-success ltr:ml-4 rtl:mr-4" onClick={() => setAddContactModal(false)}>
                                        //                                                 <IconSend className="ltr:mr-2 rtl:ml-2 " />
                                        //                                                 Upload
                                        //                                             </button>
                                        //                                         </div>
                                        //                                     </form>
                                        //                                 </div>
                                        //                             </Dialog.Panel>
                                        //                         </Transition.Child>
                                        //                     </div>
                                        //                 </div>
                                        //             </Dialog>
                                        //         </Transition>

                                        //     </div>
                                        // </div>


                                    ),
                                },

                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    sortable: true,
                                    render: ({ status }) => <span className={`p-2 badge badge-outline-${status.color} `}>{status.tooltip}</span>,
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
                {/*-------------- Costing list end -------------*/}


            </div>
        </div>
    );
};

export default index;