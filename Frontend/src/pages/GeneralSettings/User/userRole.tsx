import React from 'react';
import { useEffect, useState } from 'react';
import { DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';


const rowData = [
    {
        serial: 1,
        roleName: 'Superadmin',
        status: { tooltip: 'Active', color: 'success' },
        action: '',
    },
    {
        serial: 2,
        roleName: 'Bank charges',
        status: { tooltip: 'Inactive', color: 'danger' },
        action: '',
    },
];

const userRole = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Export Table'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'serial'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'serial', direction: 'asc' });

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
                    item.roleName.toLowerCase().includes(search.toLowerCase()) ||
                    item.description.toLowerCase().includes(search.toLowerCase()) ||
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
    const header = ['Serial', 'Role Name', 'Status', 'Action'];



    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">User-Role</h2>
            </div>
            <div className="pt-5 gap-2">
                <div className='panel'>
                    <div className="mb-5">
                        <form className="space-y-5 pt-4">
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                                <label htmlFor="userName" className='col-span-1 text-base'>User Name</label>
                                <input id="userName" type="text" placeholder="Enter User Name" className="form-input py-2.5 text-base col-span-4" name="user_name" />
                            </div>
                            <div className="grid grid-cols-5 gap--x-2 gap-y-3 pb-3" >
                                <label htmlFor="inputPerson" className='col-span-1 text-base '>Role Name</label>
                                <select className="form-select text-dark col-span-4 text-base" required>
                                    {/* <option value="">Select an option......</option> */}
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                            <div className="space-y-2 text-base">
                                <div>
                                    <label className="inline-flex">
                                        <input type="checkbox" className="form-checkbox text-success rounded-full" />
                                        <span>List</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex">
                                        <input type="checkbox" className="form-checkbox text-success rounded-full" />
                                        <span>Created By</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex">
                                        <input type="checkbox" className="form-checkbox text-success rounded-full" />
                                        <span>Updated By</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-6 pt-9">
                                <button type="submit" className="btn btn-success gap-2" >
                                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Submit
                                </button>
                                <button type="button" className="btn btn-danger gap-2" >
                                    <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default userRole;
