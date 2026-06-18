import { Link, useParams,useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import axios from 'axios';


const ProductionBOMInvoice = () => {
    const navigate = useNavigate();
    const params = useParams();


    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (token) {
            const bearer = JSON.parse(token);
            const headers = { Authorization: `Bearer ${bearer}` }
        axios.get(`http://localhost:8080/bmitvat/api/production-bom/bom_invoice/${params.id}`,{headers})
            .then((response) => {
                setRawMaterialsRecords(response.data.invoiceRawMaterialsArray);
                setCostingRecords(response.data.costingArray);
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
    const [initialRecords, setRawMaterialsRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [costingRecords, setCostingRecords] = useState([]);
    const [costingData, setCostignsData] = useState(costingRecords);


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
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setCostignsData([...costingRecords.slice(from, to)]);
    }, [page, pageSize, costingRecords]);

    useEffect(() => {
        setRawMaterialsRecords(() => {
            return initialRecords.filter((item: any, index) => {
                return (
                    index.toString().includes(search.toLowerCase()) ||
                    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
                    item.materialRate.toLowerCase().includes(search.toLowerCase()) ||
                    item.materialQty.toLowerCase().includes(search.toLowerCase()) ||
                    item.wastagePercent.toLowerCase().includes(search.toLowerCase()) ||
                    item.wastageQty.toLowerCase().includes(search.toLowerCase()) ||
                    item.totalQty.tooltip.toLowerCase().includes(search.toLowerCase()) ||
                    item.totalPrice.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);




    return (
        <div>

            <div className="pt-5">
                {/*----------------- Production BOM Invoice start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-lg dark:text-white-light">Production BOM Invoice</h5>
                        </div>
                    </div>
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                { accessor: 'index', title: 'Serial', sortable: true },
                                { accessor: 'itemName', title: 'Material Name', sortable: true },
                                { accessor: 'materialRate', title: 'Material Rate', sortable: true },
                                { accessor: 'materialQty', title: 'Material Quantity', sortable: true },
                                { accessor: 'wastagePercent', title: 'Wastage Rate', sortable: true },
                                { accessor: 'wastageQty', title: 'Material Wastage', sortable: true },
                                { accessor: 'totalQty', title: 'Total Material', sortable: true },
                                { accessor: 'totalPrice', title: 'Total Price', sortable: true },
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
                {/*-------------- Production BOM Invoice end -------------*/}


            </div>

            <div className="pt-5">
                {/*----------------- BOM Costing start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-lg dark:text-white-light">BOM Costing</h5>
                        </div>
                    </div>
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={costingData}
                            columns={[
                                { accessor: 'costingName', title: 'Costing Name', sortable: true },
                                { accessor: 'cost', title: 'Cost Amount', sortable: true },
                            ]}
                            totalRecords={costingRecords.length}
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
                {/*-------------- BOM Costing end -------------*/}


            </div>
        </div>
    );
};


export default ProductionBOMInvoice;
