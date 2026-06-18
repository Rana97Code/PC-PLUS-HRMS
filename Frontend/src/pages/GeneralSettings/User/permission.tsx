import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconEdit from '../../../components/Icon/IconEdit';
import UserPermissionAdd from './components/permissionAdd'


const rowData = [
    {
        serial: 1,
        permissionName: 'Item',
        status: { tooltip: 'Active', color: 'success' },
        action: '',
    },
    {
        serial: 2,
        permissionName: 'General Settings',
        status: { tooltip: 'Inactive', color: 'danger' },
        action: '',
    },

];

const permission = () => {

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
                    item.serial.toString().includes(search.toLowerCase()) ||
                    item.permissionName.toLowerCase().includes(search.toLowerCase()) ||
                    item.status.tooltip.toLowerCase().includes(search.toLowerCase()) ||
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
    const header = ['Serial', 'Permission Name', 'Status', 'Action'];


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Permissions</h2>
            </div>

            <div className="pt-5 grid grid-cols-5 grid-flow-row-dense gap-2">
                
                <div className='panel col-span-2'>
                    <UserPermissionAdd />
                </div>

                {/*----------------- Permissions list start ---------------*/}
                <div className="panel col-span-3" id="stack_form">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-lg dark:text-white-light">Permissions List</h5>
                    </div>
                    <div className="flex md:items-center justify-between md:flex-row flex-col">
                        <div className="flex items-center flex-wrap"></div>
                        <input type="search" className="form-input w-auto mb-4" placeholder="Search..." />
                    </div>
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'serial', title: 'Serial', sortable: true },
                                { accessor: 'permissionName', title: 'Permission Name', sortable: true },
                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    sortable: true,
                                    render: ({ status }) => <span className={`p-2 badge badge-outline-${status.color} `}>{status.tooltip}</span>,
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ action }) => (
                                        <div className="flex gap-4 items-center w-max mx-auto">
                                            <NavLink to="/pages/user/permissions/edit" className="flex btn btn-outline-primary btn-sm m-1 p-2">
                                                <IconEdit className="w-4.5 h-4.5 mr-2" />
                                                Edit
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
                {/*-------------- Costing list end -------------*/}


            </div>
        </div>
    );
};

export default permission;
