import React from 'react';
import { Link, NavLink,useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useContext,useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { downloadExcel } from 'react-export-table-to-excel';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconFile from '../../../components/Icon/IconFile';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconX from '../../../components/Icon/IconX';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconSend from '../../../components/Icon/IconSend';
import IconUpload from '../../../components/Icon/IconUpload';
import IconDownload from '../../../components/Icon/IconDownload';
import axios from 'axios';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import UserContex from '../../../context/UserContex';



const index = () => {

    const col = ['id', 'unitName', 'description', 'status', 'action'];
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const user = useContext(UserContex);
        const headers= user.headers;
        const baseUrl= user.base_url;
        const token = user.token;


    useEffect(() => {
        if(user){
        axios.get(`${baseUrl}/allunits`,{headers})
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
        dispatch(setPageTitle('Export Table'));
    });



    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100, 500];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    // console.warn(initialRecords);


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
                    item.unit_name.toLowerCase().includes(search.toLowerCase()) ||
                    item.unit_details.toLowerCase().includes(search.toLowerCase()) ||
                    item.unit_status.tooltip.toLowerCase().includes(search.toLowerCase()) ||
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
    const header = ['Id', 'Unit Name', 'Description', 'Status', 'Action'];

    // excel file
    function handleDownloadExcel() {
        downloadExcel({
            fileName: 'table',
            sheet: 'react-export-table-to-excel',
            tablePayload: {
                header,
                body: initialRecords,
            },
        });
    }

    // csv, pdf, print
    const exportTable = (type: any) => {
        let columns: any = col;
        let records = initialRecords;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            records.map((item: any) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'pdf') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/pdf/i) && !newVariable.msSaveOrOpenBlob) {
                var data1 = 'data:application/pdf;charset=utf-8,' + encodeURIComponent(result);
                var link1 = document.createElement('a');
                link1.setAttribute('href', data1);
                link1.setAttribute('download', filename + '.pdf');
                link1.click();
            } else {
                var blob1 = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob1, filename + '.pdf');
                }
            }
        }
    };

    const capitalize = (text: any) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };


    const [defaultParams] = useState({ file: '', });
    const [selectedFiles, setSelectedFiles] = useState<File | undefined>( undefined );

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(event?.target?.files?.[0]);
        
      };


    const handelExcelUpload = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const file = { 
            file: selectedFiles
        }
        if(token && file){
 
        const headers= { Authorization: `Bearer ${token}` ,'content-type': 'multipart/form-data' }
    try {
      await axios.post(`${baseUrl}/unit/upload_unit_excel`, file, {headers})
      .then(function (response){
      if(response.status==200){
        navigate("/pages/settings/unit");
        window.location.reload();
      }else{
        setShowAlert(true);
        navigate("/pages/settings/unit");
      }
    })
    } catch (err) {
      console.log(err);
    }
    }
    }

    useEffect(() => {
        handelExcelUpload;
    }, [user]);




    const [addFileModal, setAddFileModal] = useState<any>(false);
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const excelModal = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddFileModal(true);
    };

    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const [images, setImages] = useState<any>([]);
    const [images2, setImages2] = useState<any>([]);
    const maxNumber = 69;

    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };

    const onChange2 = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages2(imageList as never[]);
    };



    const downloadFile = async () => {
    
          const link = document.createElement('a');

          // Set the link's href to the public URL of the file
          link.href = '../../../public/assets/excel_file/unit.xlsx';
        //   link.href = 'public/assets/excel_file/unit.xlsx';
      
          link.download = 'unit.xlsx';
      
          // Append the link to the document body
        //   document.body.appendChild(link);
      
          link.click();
      
          document.body.removeChild(link);
    }







    return (
        <div>
            {/* if excel file does not upload */}
            {showAlert && (
                    <div className="alert">
                    <p>Oops! Something went wrong.</p>
                    <button onClick={() => setShowAlert(false)}>Close</button>
                    </div>
                )}


            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Unit</h2>
                <div className="flex items-center flex-wrap gap-3">
                    <button type="button" className="btn btn-primary" onClick={downloadFile}>
                        <IconDownload className="ltr:mr-2 rtl:ml-2" />
                        Download Sample File
                    </button>

                    <button type="button" className="btn btn-primary" onClick={() => excelModal()}>
                        <IconUpload className="ltr:mr-2 rtl:ml-2" />
                        Excel File Upload
                    </button>
                    <Link to="/pages/settings/unit/add" className="btn btn-primary gap-1">
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

            <Transition appear show={addFileModal} as={Fragment}>
                <Dialog as="div" open={addFileModal} onClose={() => setAddFileModal(false)} className="relative z-[51]">
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
                                        onClick={() => setAddFileModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Excel File
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={handelExcelUpload} >
                                            {/* <div className="mb-5">
                                                <label className="custom-file-container__custom-file">File Upload</label>
                                                <input id="file" type="file" />
                                            </div> */}

                                            <div className="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg width-450px" >
                                                <svg className="text-indigo-500 w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                <div className="input_field flex flex-col w-max mx-auto text-center">
                                                    <label className="custom-file-container__custom-file">
                                                        <input id="file" className="text-sm cursor-pointer w-36 hidden" type="file" onChange={handleFileSelect} multiple />
                                                        <div className="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">Select</div>
                                                    </label>

                                                    <div className="title text-indigo-500 uppercase">or drop files here</div>
                                                </div>

                                            </div>


                                            <div className="flex justify-end items-center mt-8">
                                                <button type="submit" className="btn btn-outline-success" >
                                                    <IconSend className="ltr:mr-2 rtl:ml-2 " />
                                                    Upload
                                                </button>
                                                <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={() => setAddFileModal(false)}>
                                                    <IconTrashLines className="ltr:mr-2 rtl:ml-2 " />
                                                    Cancel
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

            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button type="button" onClick={() => exportTable('csv')} className="btn btn-secondary btn-sm m-1 ">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            CSV
                        </button>
                        <button type="button" onClick={() => exportTable('pdf')} className="btn btn-secondary btn-sm m-1">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            PDF
                        </button>

                        <button type="button" className="btn btn-secondary btn-sm m-1" onClick={handleDownloadExcel}>
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            EXCEL
                        </button>

                        <button type="button" onClick={() => exportTable('print')} className="btn btn-secondary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            PRINT
                        </button>
                    </div>

                    <input type="search" className="form-input w-auto" placeholder="Search..." />
                </div>

                {/*-------------- Datatable start ------------------*/}
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'id', title: 'Id', sortable: true },
                            { accessor: 'unit_name', title: 'Unit Name', sortable: true },
                            { accessor: 'unit_details', title: 'Description', sortable: true },
                            {
                                accessor: 'unit_status',
                                title: 'Status',
                                sortable: true,
                                render: ({ unit_status }) => <span className={`p-2 badge ${unit_status == 1 ? 'badge-outline-success' : 'badge-outline-danger'} `}>{unit_status == 1 ? 'Active' : 'Inactive'}</span>,
                            },
                            {
                                accessor: 'action',
                                title: 'Action',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={"/pages/settings/unit/edit/" + id} className="flex btn btn-outline-primary btn-sm m-1 p-2">
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

        </div>
    );
};

export default index;