import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../../../api/axios';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useReactToPrint } from 'react-to-print';
import Swal from 'sweetalert2';

const PAGE_SIZES = [10, 20, 30, 50];

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    department_id?: number | null;
    designation_id?: number | null;
    joining_date?: string | null;
    status?: number;
}

interface AttendanceRecord {
    id: number;
    employee_id: string;
    attendance_date: string;
    in_time: string | null;
    out_time: string | null;
    total_punch: number;
    source: string;
    status: number;
    created_at?: string;
    updated_at?: string;
}

interface DailyAttendanceRow {
    id: number;
    employee_id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    department_id?: number | null;
    designation_id?: number | null;
    Attendances?: AttendanceRecord[];
}

interface EmployeeListResponse {
    employees: Employee[];
}

interface MonthlyReportResponse {
    employee: Employee | null;
    month: string;
    startDate: string;
    endDate: string;
    records: AttendanceRecord[];
}

interface MonthlyCalendarRow {
    date: string;
    dayName: string;
    attendance: AttendanceRecord | null;
    inTime: string;
    outTime: string;
    workingMinutes: number;
    workingHours: string;
    status: 'Present' | 'Absent';
}

const getLocalDate = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getLocalMonth = (): string => getLocalDate().slice(0, 7);

const formatTime = (time?: string | null): string => {
    if (!time) return '-';

    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date);
};

const getDhakaTimeParts = (time?: string | null): { hour: number; minute: number } | null => {
    if (!time) return null;

    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return null;

    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(date);

    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value);

    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    return { hour, minute };
};

const isLateIn = (time?: string | null): boolean => {
    const parts = getDhakaTimeParts(time);
    if (!parts) return false;
    return parts.hour > 10 || (parts.hour === 10 && parts.minute > 0);
};

const isEarlyOut = (time?: string | null): boolean => {
    const parts = getDhakaTimeParts(time);
    if (!parts) return false;
    return parts.hour < 18;
};

const calculateWorkingMinutes = (inTime?: string | null, outTime?: string | null): number => {
    if (!inTime || !outTime) return 0;

    const start = new Date(inTime);
    const end = new Date(outTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

    const difference = end.getTime() - start.getTime();
    if (difference <= 0) return 0;

    return Math.floor(difference / (1000 * 60));
};

const formatMinutesToHours = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

const formatDate = (value?: string | null): string => {
    if (!value) return '-';

    const [year, month, day] = value.slice(0, 10).split('-');
    if (!year || !month || !day) return value;

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${day}-${monthNames[Number(month) - 1] || month}-${year}`;
};

const formatMonth = (monthValue: string): string => {
    if (!monthValue) return '-';

    const [year, month] = monthValue.split('-');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    return `${monthNames[Number(month) - 1] || month} ${year}`;
};

const generateDateRange = (startDate: string, endDate: string): string[] => {
    if (!startDate || !endDate) return [];

    const dates: string[] = [];
    const currentDate = new Date(`${startDate}T00:00:00`);
    const finalDate = new Date(`${endDate}T00:00:00`);

    while (currentDate.getTime() <= finalDate.getTime()) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

const getDayName = (dateValue: string): string => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
        new Date(`${dateValue}T00:00:00`)
    );
};

const AttendanceList = () => {
    const printRef = useRef<HTMLDivElement>(null);

    const [records, setRecords] = useState<DailyAttendanceRow[]>([]);
    const [initialRecords, setInitialRecords] = useState<DailyAttendanceRow[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [search, setSearch] = useState('');
    const [date, setDate] = useState(getLocalDate());
    const [employeeId, setEmployeeId] = useState('');
    const [month, setMonth] = useState(getLocalMonth());

    const [monthlyResponse, setMonthlyResponse] = useState<MonthlyReportResponse | null>(null);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const [loadingDaily, setLoadingDaily] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingMonthlyReport, setLoadingMonthlyReport] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    const selectedEmployee = useMemo(
        () => employees.find((employee) => employee.employee_id === employeeId),
        [employees, employeeId]
    );

    const monthlyCalendarRows = useMemo<MonthlyCalendarRow[]>(() => {
        if (!monthlyResponse) return [];

        const allDates = generateDateRange(monthlyResponse.startDate, monthlyResponse.endDate);
        const attendanceMap = new Map<string, AttendanceRecord>();

        (Array.isArray(monthlyResponse.records) ? monthlyResponse.records : []).forEach((attendance) => {
            attendanceMap.set(attendance.attendance_date.slice(0, 10), attendance);
        });

        return allDates.map((currentDate) => {
            const attendance = attendanceMap.get(currentDate) || null;
            const workingMinutes = calculateWorkingMinutes(attendance?.in_time, attendance?.out_time);

            return {
                date: currentDate,
                dayName: getDayName(currentDate),
                attendance,
                inTime: formatTime(attendance?.in_time),
                outTime: formatTime(attendance?.out_time),
                workingMinutes,
                workingHours: formatMinutesToHours(workingMinutes),
                status: attendance ? 'Present' : 'Absent',
            };
        });
    }, [monthlyResponse]);

    const reportSummary = useMemo(() => {
        const presentDays = monthlyCalendarRows.filter((row) => row.status === 'Present').length;
        const absentDays = monthlyCalendarRows.filter((row) => row.status === 'Absent').length;
        const totalWorkingMinutes = monthlyCalendarRows.reduce(
            (total, row) => total + row.workingMinutes,
            0
        );

        return {
            totalDays: monthlyCalendarRows.length,
            presentDays,
            absentDays,
            totalWorkingHours: formatMinutesToHours(totalWorkingMinutes),
        };
    }, [monthlyCalendarRows]);

    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const response = await api.get<EmployeeListResponse>('/hrms/manual-attendance/employees');
            setEmployees(Array.isArray(response.data?.employees) ? response.data.employees : []);
        } catch (error: any) {
            setEmployees([]);
            await Swal.fire({
                icon: 'error',
                title: 'Employee Load Failed',
                text: error.response?.data?.detail || 'Unable to load employees.',
            });
        } finally {
            setLoadingEmployees(false);
        }
    };

    const getDailyAttendance = (
        row: DailyAttendanceRow
    ): AttendanceRecord | null => {
        if (
            Array.isArray(row.Attendances) &&
            row.Attendances.length > 0
        ) {
                return row.Attendances[0];
            }

            return null;
        };

    const fetchDailyAttendance = async () => {
        try {
            setLoadingDaily(true);
            const response = await api.get('/attendance/daily', {
                params: {
                    date,
                    page,
                    limit: pageSize,
                    search,
                    sortBy: sortStatus.columnAccessor,
                    sortOrder: sortStatus.direction.toUpperCase(),
                },
            });

            setInitialRecords(Array.isArray(response.data?.data) ? response.data.data : []);
            setTotalRecords(Number(response.data?.total) || 0);
        } catch (error) {
            console.error('Daily attendance error:', error);
            setInitialRecords([]);
            setTotalRecords(0);
        } finally {
            setLoadingDaily(false);
        }
    };

    const fetchMonthlyReport = async () => {
        if (!employeeId) {
            await Swal.fire({
                icon: 'warning',
                title: 'Employee Required',
                text: 'Please select an employee.',
            });
            return;
        }

        if (!month) {
            await Swal.fire({
                icon: 'warning',
                title: 'Month Required',
                text: 'Please select a month.',
            });
            return;
        }

        try {
            setLoadingMonthlyReport(true);
            const response = await api.get<MonthlyReportResponse>('/attendance/monthly-report', {
                params: {
                    employee_id: employeeId,
                    month,
                },
            });

            const data = response.data;

            setMonthlyResponse({
                employee: data.employee || selectedEmployee || null,
                month: data.month || month,
                startDate: data.startDate || `${month}-01`,
                endDate: data.endDate || `${month}-31`,
                records: Array.isArray(data.records) ? data.records : [],
            });

            setReportModalOpen(true);
        } catch (error: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Report Load Failed',
                text: error.response?.data?.detail || 'Unable to load monthly attendance report.',
            });
        } finally {
            setLoadingMonthlyReport(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

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
        <div className="space-y-5">


            <div className="panel no-print">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-black dark:text-white-light">
                        Monthly Employee Attendance Report
                    </h3>
                    <p className="mt-1 text-sm text-white-dark">
                        Select a specific employee and month to view the full report.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block font-semibold">
                            Employee <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-select"
                            value={employeeId}
                            onChange={(event) => setEmployeeId(event.target.value)}
                            disabled={loadingEmployees}
                        >
                            <option value="">
                                {loadingEmployees ? 'Loading employees...' : 'Select an employee'}
                            </option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.employee_id}>
                                    {employee.employee_id} — {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold">
                            Report Month <span className="text-danger">*</span>
                        </label>
                        <input
                            type="month"
                            className="form-input"
                            value={month}
                            onChange={(event) => setMonth(event.target.value)}
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="button"
                            className="btn btn-primary w-full"
                            onClick={fetchMonthlyReport}
                            disabled={loadingMonthlyReport}
                        >
                            {loadingMonthlyReport ? 'Loading Report...' : 'View Monthly Report'}
                        </button>
                    </div>
                </div>

                {selectedEmployee && (
                    <div className="mt-4 rounded-md border border-primary/20 bg-primary-light p-4 dark:bg-primary-dark-light">
                        <p className="font-semibold text-primary">{selectedEmployee.name}</p>
                        <p className="mt-1 text-sm text-white-dark">
                            Employee ID: {selectedEmployee.employee_id}
                            {selectedEmployee.email ? ` | Email: ${selectedEmployee.email}` : ''}
                        </p>
                    </div>
                )}
            </div>

            <div className="panel flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-black dark:text-white-light">Daily Attendance</h3>
                    <p className="mt-1 text-sm text-white-dark">
                        View attendance of all employees for a specific date.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <input
                        type="date"
                        className="form-input w-auto"
                        value={date}
                        onChange={(event) => {
                            setDate(event.target.value);
                            setPage(1);
                        }}
                    />
                    <input
                        type="text"
                        className="form-input w-auto"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="panel">
                <DataTable
                    highlightOnHover
                    fetching={loadingDaily}
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
                        accessor: 'in_time',
                        title: 'In Time',
                        render: (row: DailyAttendanceRow) => {
                            const attendance =
                                getDailyAttendance(row);

                            return (
                                <span
                                    className={`rounded px-3 py-1 font-semibold ${
                                        !attendance?.in_time
                                            ? 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                            : isLateIn(
                                                attendance.in_time
                                            )
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}
                                >
                                    {formatTime(
                                        attendance?.in_time
                                    )}
                                </span>
                            );
                        },
                    },
                    {
                        accessor: 'out_time',
                        title: 'Out Time',
                        render: (row: DailyAttendanceRow) => {
                            const attendance =
                                getDailyAttendance(row);

                            return (
                                <span
                                    className={`rounded px-3 py-1 font-semibold ${
                                        !attendance?.out_time
                                            ? 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                            : isEarlyOut(
                                                attendance.out_time
                                            )
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}
                                >
                                    {formatTime(
                                        attendance?.out_time
                                    )}
                                </span>
                            );
                        },
                    },
                    {
                        accessor: 'working_hours',
                        title: 'Working Hours',
                        render: (row: DailyAttendanceRow) => {
                            const attendance =
                                getDailyAttendance(row);

                            const workingMinutes =
                                calculateWorkingMinutes(
                                    attendance?.in_time,
                                    attendance?.out_time
                                );

                            return (
                                <span className="font-semibold text-primary">
                                    {formatMinutesToHours(
                                        workingMinutes
                                    )}
                                </span>
                            );
                        },
                    },
                    {
                        accessor: 'total_punch',
                        title: 'Total Punch',
                        render: (row: DailyAttendanceRow) => {
                            const attendance =
                                getDailyAttendance(row);

                            return (
                                <span className="font-semibold">
                                    {attendance?.total_punch || 0}
                                </span>
                            );
                        },
                    },
                    {
                        accessor: 'status',
                        title: 'Status',
                        render: (row: DailyAttendanceRow) => {
                            const attendance =
                                getDailyAttendance(row);

                            return (
                                <span
                                    className={`badge ${
                                        attendance
                                            ? 'bg-success'
                                            : 'bg-danger'
                                    }`}
                                >
                                    {attendance
                                        ? 'Present'
                                        : 'Absent'}
                                </span>
                            );
                        },
                            },
                        ]}
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={300}
                    noRecordsText="No attendance records found"
                    paginationText={({ from, to, totalRecords }) =>
                        `Showing ${from} to ${to} of ${totalRecords} entries`
                    }
                />
            </div>

            {reportModalOpen && monthlyResponse && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-3 sm:p-5">
                    <div className="flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-[#0e1726]">
                        <div className="no-print flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                            <div>
                                <h3 className="text-lg font-bold text-black dark:text-white-light">
                                    Monthly Attendance Report
                                </h3>
                                <p className="mt-1 text-sm text-white-dark">
                                    {monthlyResponse.employee?.name || '-'} — {formatMonth(monthlyResponse.month)}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button type="button" className="btn btn-primary" onClick={handlePrint}>
                                    Print Report
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => setReportModalOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-4 sm:p-6">
                            <div ref={printRef} className="attendance-print-area bg-white p-5 text-black sm:p-8">
                                <div className="mb-6 flex items-start justify-between border-b border-gray-300 pb-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src="/assets/images/auth/logo.jpeg"
                                            alt="PC Plus Solution Ltd"
                                            className="h-20 w-32 object-contain"
                                        />
                                        <div>
                                            <h1 className="text-2xl font-bold">PC PLUS SOLUTION LTD</h1>
                                            <p className="text-sm">House-34, Block-A, Road-18, Banani, Dhaka, Bangladesh</p>
                                            <p className="text-sm">Email: info@pcplusbd.com</p>
                                            <p className="text-sm">Phone: +880 1772-699434</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <h2 className="text-2xl font-bold uppercase" style={{ color: '#0064C8' }}>
                                            Attendance Report
                                        </h2>
                                        <p className="mt-2 text-sm">
                                            <strong>Month:</strong> {formatMonth(monthlyResponse.month)}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Period:</strong> {formatDate(monthlyResponse.startDate)} to{' '}
                                            {formatDate(monthlyResponse.endDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div className="rounded border border-gray-300 p-4">
                                        <h3 className="mb-3 border-b border-gray-300 pb-2 text-lg font-bold" style={{ color: '#0064C8' }}>
                                            Employee Information
                                        </h3>
                                        <p className="mb-2 text-sm">
                                            <strong>Employee ID:</strong>{' '}
                                            {monthlyResponse.employee?.employee_id || employeeId}
                                        </p>
                                        <p className="mb-2 text-sm">
                                            <strong>Name:</strong> {monthlyResponse.employee?.name || '-'}
                                        </p>
                                        <p className="mb-2 text-sm">
                                            <strong>Email:</strong> {monthlyResponse.employee?.email || '-'}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Phone:</strong> {monthlyResponse.employee?.phone || '-'}
                                        </p>
                                    </div>

                                    <div className="rounded border border-gray-300 p-4">
                                        <h3 className="mb-3 border-b border-gray-300 pb-2 text-lg font-bold" style={{ color: '#0064C8' }}>
                                            Monthly Summary
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <p><strong>Total Days:</strong> {reportSummary.totalDays}</p>
                                            <p><strong>Present:</strong> {reportSummary.presentDays}</p>
                                            <p><strong>Absent:</strong> {reportSummary.absentDays}</p>
                                            <p><strong>Total Hours:</strong> {reportSummary.totalWorkingHours}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="print-table-wrapper overflow-x-auto">
                                    <table className="attendance-table w-full border-collapse border border-gray-300 text-sm">
                                        <thead>
                                            <tr className="attendance-table-head">
                                                <th className="border border-gray-300 p-2">SL</th>
                                                <th className="border border-gray-300 p-2">Date</th>
                                                <th className="border border-gray-300 p-2">Day</th>
                                                <th className="border border-gray-300 p-2">In Time</th>
                                                <th className="border border-gray-300 p-2">Out Time</th>
                                                <th className="border border-gray-300 p-2">Daily Hours</th>
                                                <th className="border border-gray-300 p-2">Punch</th>
                                                <th className="border border-gray-300 p-2">Source</th>
                                                <th className="border border-gray-300 p-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyCalendarRows.map((item, index) => (
                                                <tr key={item.date} className={item.status === 'Absent' ? 'bg-red-50' : ''}>
                                                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                                    <td className="border border-gray-300 p-2">{formatDate(item.date)}</td>
                                                    <td className="border border-gray-300 p-2">{item.dayName}</td>
                                                    <td className="border border-gray-300 p-2 text-center">{item.inTime}</td>
                                                    <td className="border border-gray-300 p-2 text-center">{item.outTime}</td>
                                                    <td className="border border-gray-300 p-2 text-center font-semibold">
                                                        {item.workingHours}
                                                    </td>
                                                    <td className="border border-gray-300 p-2 text-center">
                                                        {item.attendance?.total_punch || 0}
                                                    </td>
                                                    <td className="border border-gray-300 p-2 text-center capitalize">
                                                        {item.attendance?.source || '-'}
                                                    </td>
                                                    <td className="border border-gray-300 p-2 text-center">
                                                        <span
                                                            className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                                                                item.status === 'Present'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="font-bold">
                                                <td colSpan={5} className="border border-gray-300 p-2 text-right">
                                                    Total Working Hours
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {reportSummary.totalWorkingHours}
                                                </td>
                                                <td colSpan={3} className="border border-gray-300 p-2" />
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="mt-16 grid grid-cols-2 gap-16">
                                    <div className="border-t border-black pt-2 text-center">Prepared By</div>
                                    <div className="border-t border-black pt-2 text-center">Authorized Signature</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

                        body * {
                            visibility: hidden !important;
                        }

                        .attendance-print-area,
                        .attendance-print-area * {
                            visibility: visible !important;
                        }

                        .attendance-print-area {
                            position: absolute !important;
                            top: 0 !important;
                            left: 0 !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            background: white !important;
                            color: black !important;
                        }

                        .no-print {
                            display: none !important;
                        }

                        .print-table-wrapper {
                            overflow: visible !important;
                        }

                        .attendance-table {
                            width: 100% !important;
                            table-layout: fixed !important;
                            border-collapse: collapse !important;
                            font-size: 8px !important;
                        }

                        .attendance-table th,
                        .attendance-table td {
                            padding: 4px !important;
                            word-break: break-word !important;
                            white-space: normal !important;
                        }

                        .attendance-table tr {
                            page-break-inside: avoid !important;
                        }

                        @page {
                            size: A4 landscape;
                            margin: 7mm;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default AttendanceList;