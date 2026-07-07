import React, { useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';


const PAGE_SIZES = [10, 20, 30, 50];

const AttendanceList = () => {

    const dispatch = useDispatch();

    const auth = useSelector((state: IRootState) => state.auth);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';
    const headers = useMemo(() => {
        return auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
    }, [auth.token]);

    const printRef = useRef<HTMLDivElement>(null);

    const [records, setRecords] = useState<any[]>([]);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [search, setSearch] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    const [employeeId, setEmployeeId] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [monthlyReport, setMonthlyReport] = useState<any[]>([]);
    const [reportEmployee, setReportEmployee] = useState<any>(null);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });


    const formatTime = (time: any) => {
        if (!time) return '-';
        return new Date(time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isLateIn = (time: any) => {
        if (!time) return false;
        const d = new Date(time);
        return d.getHours() > 10 || (d.getHours() === 10 && d.getMinutes() > 0);
    };

    const isEarlyOut = (time: any) => {
        if (!time) return false;
        const d = new Date(time);
        return d.getHours() < 17;
    };

    const fetchDailyAttendance = async () => {
        const res = await axios.get(`${baseUrl}/attendance/daily`, {
            headers,
            params: {
                date,
                page,
                limit: pageSize,
                search,
                sortBy: sortStatus.columnAccessor,
                sortOrder: sortStatus.direction.toUpperCase(),
            },
        });

        setInitialRecords(res.data.data || []);
        setTotalRecords(res.data.total || 0);
    };

    const fetchMonthlyReport = async () => {
        if (!employeeId || !month) return;

        const res = await axios.get(`${baseUrl}/attendance/monthly-report`, {
            headers,
            params: {
                employee_id: employeeId,
                month,
            },
        });

        setMonthlyReport(res.data.data || []);
        setReportEmployee(res.data.employee || null);
    };

    useEffect(() => {
        fetchDailyAttendance();
    }, [page, pageSize, date, search, sortStatus]);

    useEffect(() => {
        const sorted = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? sorted.reverse() : sorted);
    }, [initialRecords, sortStatus]);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Attendance-Report-${employeeId}-${month}`,
    });

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold text-black dark:text-white-light">
                    Daily Attendance Management
                </h2>

                <div className="flex flex-wrap gap-3">
                    <input
                        type="date"
                        className="form-input w-auto"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            setPage(1);
                        }}
                    />

                    <input
                        type="text"
                        className="form-input w-auto"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="panel mt-5">
                <DataTable
                    highlightOnHover
                    className="whitespace-nowrap table-hover"
                    records={records}
                    columns={[
                        {
                            accessor: 'employee_id',
                            title: 'Employee ID',
                            sortable: true,
                        },
                        {
                            accessor: 'name',
                            title: 'Employee Name',
                            sortable: true,
                        },
                        {
                            accessor: 'attendance.in_time',
                            title: 'In Time',
                            render: (row: any) => (
                                <span
                                    className={`px-3 py-1 rounded font-semibold ${
                                        isLateIn(row.attendance?.in_time)
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}
                                >
                                    {formatTime(row.attendance?.in_time)}
                                </span>
                            ),
                        },
                        {
                            accessor: 'attendance.out_time',
                            title: 'Out Time',
                            render: (row: any) => (
                                <span
                                    className={`px-3 py-1 rounded font-semibold ${
                                        isEarlyOut(row.attendance?.out_time)
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}
                                >
                                    {formatTime(row.attendance?.out_time)}
                                </span>
                            ),
                        },
                        {
                            accessor: 'status',
                            title: 'Status',
                            render: (row: any) => (
                                <span
                                    className={`badge ${
                                        row.attendance
                                            ? 'bg-success'
                                            : 'bg-danger'
                                    }`}
                                >
                                    {row.attendance ? 'Present' : 'Absent'}
                                </span>
                            ),
                        },
                    ]}
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={300}
                    paginationText={({ from, to, totalRecords }) =>
                        `Showing ${from} to ${to} of ${totalRecords} entries`
                    }
                />
            </div>

            <div className="panel mt-5 no-print">
                <h3 className="text-lg font-bold mb-4">Monthly Employee Attendance Report</h3>

                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        className="form-input w-auto"
                        placeholder="Employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    />

                    <input
                        type="month"
                        className="form-input w-auto"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={fetchMonthlyReport}
                    >
                        Filter Report
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handlePrint}
                    >
                        Print Report
                    </button>
                </div>
            </div>

            <div className="pt-5">
                <div ref={printRef} className="attendance-print-area bg-white text-black p-8 rounded shadow">
                    <div className="flex justify-between items-start border-b pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/images/auth/logo.jpeg"
                                alt="Company Logo"
                                className="w-36 h-24 object-contain"
                            />

                            <div>
                                <h1 className="text-2xl font-bold">PC PLUS SOLUTION LTD</h1>
                                <p className="text-sm">House-34, Block-A, Road-18, Banani, Dhaka, Bangladesh</p>
                                <p className="text-sm">Email: info@pcplusbd.com</p>
                                <p className="text-sm">Phone: +880 1772-699434</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className="text-3xl font-bold uppercase" style={{ color: '#0064C8' }}>
                                Attendance Report
                            </h2>
                            <p className="text-sm mt-2">
                                <strong>Month:</strong> {month}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="border rounded p-4">
                            <h3 className="font-bold text-lg mb-3 border-b pb-2" style={{ color: '#0064C8' }}>
                                Employee Info
                            </h3>
                            <p className="text-sm mb-2">
                                <strong>Employee ID:</strong> {reportEmployee?.employee_id || employeeId}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Name:</strong> {reportEmployee?.name || '-'}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Email:</strong> {reportEmployee?.email || '-'}
                            </p>
                        </div>

                        <div className="border rounded p-4">
                            <h3 className="font-bold text-lg mb-3 border-b pb-2" style={{ color: '#0064C8' }}>
                                Summary
                            </h3>
                            <p className="text-sm mb-2">
                                <strong>Total Present:</strong> {monthlyReport.length}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto print-table-wrapper">
                        <table className="attendance-table w-full border border-gray-300 text-sm">
                            <thead>
                                <tr className="attendance-table-head">
                                    <th className="border p-2">SL</th>
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">In Time</th>
                                    <th className="border p-2">Out Time</th>
                                    <th className="border p-2">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {monthlyReport.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="border p-2 text-center">{index + 1}</td>
                                        <td className="border p-2">{item.attendance_date}</td>
                                        <td className="border p-2">{formatTime(item.in_time)}</td>
                                        <td className="border p-2">{formatTime(item.out_time)}</td>
                                        <td className="border p-2">{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mt-16">
                        <div>
                            <div className="border-t border-black pt-2 text-center">Prepared By</div>
                        </div>

                        <div>
                            <div className="border-t border-black pt-2 text-center">Authorized Signature</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    :root {
                        --attendance-theme-bg: #0064C8;
                        --attendance-theme-text: #ffffff;
                    }

                    .dark {
                        --attendance-theme-bg: #1E40AF;
                        --attendance-theme-text: #ffffff;
                    }

                    .attendance-table-head th {
                        background-color: var(--attendance-theme-bg) !important;
                        color: var(--attendance-theme-text) !important;
                    }

                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        body {
                            background: white !important;
                        }

                        .no-print {
                            display: none !important;
                        }

                        .attendance-print-area {
                            width: 100% !important;
                            max-width: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            background: white !important;
                            color: black !important;
                        }

                        .print-table-wrapper {
                            overflow: visible !important;
                        }

                        .attendance-table {
                            width: 100% !important;
                            table-layout: fixed !important;
                            border-collapse: collapse !important;
                            font-size: 10px !important;
                        }

                        .attendance-table th,
                        .attendance-table td {
                            padding: 5px !important;
                            word-break: break-word !important;
                            white-space: normal !important;
                        }

                        @page {
                            size: A4 portrait;
                            margin: 8mm;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default AttendanceList;