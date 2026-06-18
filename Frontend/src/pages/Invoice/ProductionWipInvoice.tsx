import { Link, NavLink, useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import axios from 'axios';


const ProductionWipInvoice = () => {
    const params = useParams();


    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }
        axios.get(`http://localhost:8080/bmitvat/api/production-wip/production_invoice/${params.id}`,{headers})
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
                    item.serial.toString().includes(search.toLowerCase()) ||
                    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
                    item.itemQty.toLowerCase().includes(search.toLowerCase()) ||
                    item.productionQty.toLowerCase().includes(search.toLowerCase()) ||
                    item.wastageRate.toLowerCase().includes(search.toLowerCase()) ||
                    item.wastageQty.tooltip.toLowerCase().includes(search.toLowerCase()) ||
                    item.totalProductQty.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);


    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Production Invoice</h2>
            </div>

            <div className="pt-5">
                {/*----------------- Production Invoice start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-lg dark:text-white-light">Production Invoice List</h5>
                        </div>
                    </div>
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'serial', title: 'Serial', sortable: true },
                                { accessor: 'itemName', title: 'Item Name', sortable: true },
                                { accessor: 'usedQtyRate', title: 'Item Quantity Rate', sortable: true },
                                { accessor: 'usedQty', title: 'Used Product Quantity', sortable: true },
                                { accessor: 'wastageQtyRate', title: 'Wastage Rate', sortable: true },
                                { accessor: 'wastageQty', title: 'Total Wastage', sortable: true },
                                { accessor: 'usedQty', title: 'Total Product Quantity', sortable: true },
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
                {/*-------------- Production Invoice end -------------*/}

            </div>
        </div>
    );
};


export default ProductionWipInvoice;
