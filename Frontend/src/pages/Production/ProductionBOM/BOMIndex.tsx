import React from 'react';
import { Link,NavLink, useParams,useNavigate } from 'react-router-dom';
import { useState, Fragment, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconPlus from '../../../components/Icon/IconPlus';
import axios from 'axios';

const BOMIndex = () => {

    const params = useParams();


    useEffect(() => {
        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }
  
        axios.get('http://localhost:8080/bmitvat/api/production-bom/get_all_bom', {headers})
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
                    item.id.toString().includes(search.toLowerCase()) ||
                    item.bomNo.toLowerCase().includes(search.toLowerCase()) ||
                    item.itemName.toLowerCase().includes(search.toLowerCase())||
                    item.hsCode.toLowerCase().includes(search.toLowerCase())||
                    item.unitName.toLowerCase().includes(search.toLowerCase())||
                    item.salesPrice.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);


    const handleClick = async (clickedId: string) => {
        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }
  
        await axios.get(`http://localhost:8080/bmitvat/api/production-bom/activate_bom/${clickedId}`, {headers})
            .then((response) => {
                if(response.status == 200){
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
        }
      
      };


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Production BOM</h2>
                <div className="flex items-center flex-wrap gap-3">
                    <Link to="/pages/production_bom/add" className="btn btn-primary gap-1">
                        <IconPlus />
                        Add New BOM
                    </Link>
                </div>
            </div>

            <div className="pt-5">
                {/*----------------- User list start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-6">
                            <h5 className="font-semibold text-lg dark:text-white-light">Production BOM List</h5>
                        </div>
                        <input type="search" className="form-input w-auto" placeholder="Search..." />
                    </div>

                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'bomNo',
                                    title: 'BOM No', 
                                    sortable: true,
                                    render: ({ id,bomNo }) => (
                                        <div >
                                            <NavLink to={"/pages/invoice/production_bom/"+ id} className="text-cyan-500" target="_blank">
                                                {bomNo}
                                            </NavLink>
                                        </div>
                                    ),
                                },
                                { accessor: 'itemName', title: 'Item Name', sortable: true },
                                { accessor: 'hsCode', title: 'HS-Code', sortable: true },
                                { accessor: 'unitName', title: 'Unit Name', sortable: true },
                                { accessor: 'salesPrice', title: 'Sales Price', sortable: true },
                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    sortable: true,
                                    render: ({ id, status }) => (
                                        <div className="flex gap-4 items-center w-max mx-auto cursor-pointer">
                                                <span  onClick={() => handleClick(id)} className={`p-2 badge ${status == 1 ? 'badge-outline-success' : 'badge-outline-danger'} `}>{status == 1 ? 'Active' : 'Inactive'}</span>
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

export default BOMIndex;