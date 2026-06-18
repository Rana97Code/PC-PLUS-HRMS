import React from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useContext, useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import axios from 'axios';
import UserContex from '../../../context/UserContex';


const index = () => {
    const user = useContext(UserContex);
    const headers= user.headers;

    useEffect(()=> {
        if(user){
            axios.get(`${user.base_url}/hs_code/all_hs_code`,{headers})
            .then((response) => {
                setInitialRecords(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });

        }
    },[user]);
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
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'serial', direction: 'asc' });


    interface RecordWithIndex {
        [key: string]: any; // Define the type for each property in the record
        index: number; // Add index property

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
                    item.serial.toString().includes(search.toLowerCase()) ||
                    item.hs_code.toLowerCase().includes(search.toLowerCase()) ||
                    item.description.toLowerCase().includes(search.toLowerCase()) ||
                    item.cd.any().toLowerCase().includes(search.toLowerCase()) ||
                    item.sd.any().toLowerCase().includes(search.toLowerCase()) ||
                    item.vat.any().toLowerCase().includes(search.toLowerCase()) ||
                    item.at.any().toLowerCase().includes(search.toLowerCase()) ||
                    item.calculate_year.any().toLowerCase().includes(search.toLowerCase())
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
                <h2 className="text-xl font-bold">HS-CODE</h2>   
            </div>

            <div className="panel mt-6">

                <div className="datatables">
                <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsDataWithIndex}
                        columns={[
                            { accessor: 'index', title: 'Serial', sortable: true },
                            { accessor: 'hs_code', title: 'HS-Code', sortable: true },
                            { accessor: 'description', title: 'Description', sortable: true },
                            { accessor: 'cd', title: 'CD', sortable: true },
                            { accessor: 'sd', title: 'SD', sortable: true },
                            { accessor: 'vat', title: 'VAT', sortable: true },
                            { accessor: 'at', title: 'AT', sortable: true },
                            { accessor: 'calculate_year', title: 'Year', sortable: true },
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

export default index;
