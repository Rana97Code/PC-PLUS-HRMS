import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import api from '../../../api/axios';

interface AttendanceRecord {
    id: number;
    employee_id: string;
    attendance_date: string;
    in_time?: string | null;
    out_time?: string | null;
}

interface EmployeeDetails {
    id: number;
    employee_id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    joining_date?: string;
    salary?: number;
    user_img?: string;
    status: number;
    Department?: {
        id: number;
        department_name: string;
    };
    Designation?: {
        id: number;
        designation_name: string;
    };
}

interface AttendanceSummary {
    total_records: number;
    present_days: number;
    late_days: number;
    early_leave_days: number;
}

const EmployeeView = () => {
    const { id } = useParams<{ id: string }>();

    const [employee, setEmployee] =
        useState<EmployeeDetails | null>(null);

    const [attendanceHistory, setAttendanceHistory] = useState<
        AttendanceRecord[]
    >([]);

    const [attendanceSummary, setAttendanceSummary] =
        useState<AttendanceSummary>({
            total_records: 0,
            present_days: 0,
            late_days: 0,
            early_leave_days: 0,
        });

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const fetchEmployeeDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);

            const response = await api.get(
                `/employees/${id}/details`
            );

            setEmployee(response.data?.employee || null);
            setAttendanceHistory(
                response.data?.attendance_history || []
            );

            setAttendanceSummary(
                response.data?.attendance_summary || {
                    total_records: 0,
                    present_days: 0,
                    late_days: 0,
                    early_leave_days: 0,
                }
            );
        } catch (error: any) {
            alert(
                error?.response?.data?.detail ||
                    'Failed to load employee details'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]);

    useEffect(() => {
        setPage(1);
    }, [search, pageSize]);

    const filteredAttendance = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return attendanceHistory;
        }

        return attendanceHistory.filter((attendance) => {
            return (
                attendance.attendance_date
                    ?.toLowerCase()
                    .includes(keyword) ||
                attendance.in_time
                    ?.toLowerCase()
                    .includes(keyword) ||
                attendance.out_time
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });
    }, [attendanceHistory, search]);

    const paginatedAttendance = useMemo(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        return filteredAttendance.slice(from, to);
    }, [filteredAttendance, page, pageSize]);

    const formatTime = (time?: string | null) => {
        if (!time) return '-';

        /*
         * Supports:
         * 10:30:00
         * 2026-07-14T10:30:00.000Z
         */
        if (time.includes('T')) {
            return new Date(time).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }

        const [hours, minutes] = time.split(':');
        const date = new Date();

        date.setHours(Number(hours), Number(minutes), 0);

        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date?: string) => {
        if (!date) return '-';

        const dateObject = new Date(`${date}T00:00:00`);

        return dateObject
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            .toUpperCase()
            .replace(/ /g, '-');
    };

    const isLate = (time?: string | null) => {
        if (!time) return false;

        const timePart = time.includes('T')
            ? time.split('T')[1]?.slice(0, 5)
            : time.slice(0, 5);

        return timePart > '10:00';
    };

    const isEarlyLeave = (time?: string | null) => {
        if (!time) return false;

        const timePart = time.includes('T')
            ? time.split('T')[1]?.slice(0, 5)
            : time.slice(0, 5);

        return timePart < '17:00';
    };

    if (loading) {
        return (
            <div className="panel">
                <div className="flex min-h-[300px] items-center justify-center">
                    <span className="m-auto inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent align-middle" />
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="panel text-center">
                <h2 className="text-xl font-bold">Employee not found</h2>

                <Link
                    to="/pages/employees"
                    className="btn btn-primary mx-auto mt-5 w-fit"
                >
                    Back to Employee List
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="panel flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold dark:text-white-light">
                        Employee Details
                    </h2>

                    <p className="mt-1 text-sm text-white-dark">
                        Employee information and attendance history
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        to={`/pages/employee/edit/${employee.id}`}
                        className="btn btn-primary"
                    >
                        Edit Employee
                    </Link>

                    <Link
                        to="/pages/employees"
                        className="btn btn-outline-secondary"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 pt-5 xl:grid-cols-3">
                <div className="panel xl:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        {employee.user_img ? (
                            <img
                                src={employee.user_img}
                                alt={employee.name}
                                className="h-28 w-28 rounded-full object-cover"
                            />
                        ) : (
                            <div className="grid h-28 w-28 place-content-center rounded-full bg-gray-200 text-4xl font-bold text-gray-700 dark:bg-gray-700 dark:text-white">
                                {employee.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>
                        )}

                        <h3 className="mt-4 text-xl font-bold">
                            {employee.name}
                        </h3>

                        <p className="text-white-dark">
                            {employee.Designation
                                ?.designation_name || '-'}
                        </p>

                        <span
                            className={`badge mt-3 ${
                                employee.status === 1
                                    ? 'badge-outline-success'
                                    : 'badge-outline-danger'
                            }`}
                        >
                            {employee.status === 1
                                ? 'Active'
                                : 'Inactive'}
                        </span>
                    </div>

                    <div className="mt-6 space-y-4 border-t border-white-light pt-5 dark:border-dark">
                        <InformationRow
                            label="Employee ID"
                            value={employee.employee_id}
                        />

                        <InformationRow
                            label="Department"
                            value={
                                employee.Department
                                    ?.department_name || '-'
                            }
                        />

                        <InformationRow
                            label="Email"
                            value={employee.email || '-'}
                        />

                        <InformationRow
                            label="Phone"
                            value={employee.phone || '-'}
                        />

                        <InformationRow
                            label="Joining Date"
                            value={formatDate(
                                employee.joining_date
                            )}
                        />

                        <InformationRow
                            label="Salary"
                            value={
                                employee.salary
                                    ? `BDT ${Number(
                                          employee.salary
                                      ).toLocaleString()}`
                                    : '-'
                            }
                        />

                        <InformationRow
                            label="Address"
                            value={employee.address || '-'}
                        />
                    </div>
                </div>

                <div className="xl:col-span-2">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <SummaryCard
                            title="Attendance Records"
                            value={attendanceSummary.total_records}
                        />

                        <SummaryCard
                            title="Present Days"
                            value={attendanceSummary.present_days}
                        />

                        <SummaryCard
                            title="Late Days"
                            value={attendanceSummary.late_days}
                            valueClassName="text-danger"
                        />

                        <SummaryCard
                            title="Early Leave"
                            value={
                                attendanceSummary.early_leave_days
                            }
                            valueClassName="text-warning"
                        />
                    </div>

                    <div className="panel mt-5">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-semibold dark:text-white-light">
                                    Attendance History
                                </h3>

                                <p className="text-sm text-white-dark">
                                    Daily check-in and check-out records
                                </p>
                            </div>

                            <div className="sm:ltr:ml-auto sm:rtl:mr-auto">
                                <input
                                    type="text"
                                    className="form-input w-full sm:w-auto"
                                    placeholder="Search attendance..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="datatables">
                            <DataTable
                                highlightOnHover
                                className="table-hover whitespace-nowrap"
                                records={paginatedAttendance}
                                columns={[
                                    {
                                        accessor:
                                            'attendance_date',
                                        title: 'Date',
                                        render: ({
                                            attendance_date,
                                        }) =>
                                            formatDate(
                                                attendance_date
                                            ),
                                    },
                                    {
                                        accessor: 'in_time',
                                        title: 'In Time',
                                        render: ({ in_time }) => (
                                            <span
                                                className={
                                                    isLate(in_time)
                                                        ? 'font-semibold text-danger'
                                                        : 'text-success'
                                                }
                                            >
                                                {formatTime(
                                                    in_time
                                                )}
                                            </span>
                                        ),
                                    },
                                    {
                                        accessor: 'out_time',
                                        title: 'Out Time',
                                        render: ({ out_time }) => (
                                            <span
                                                className={
                                                    isEarlyLeave(
                                                        out_time
                                                    )
                                                        ? 'font-semibold text-danger'
                                                        : ''
                                                }
                                            >
                                                {formatTime(
                                                    out_time
                                                )}
                                            </span>
                                        ),
                                    },
                                    {
                                        accessor: 'attendance_status',
                                        title: 'Status',
                                        render: ({
                                            in_time,
                                        }) => (
                                            <span
                                                className={`badge ${
                                                    in_time
                                                        ? 'badge-outline-success'
                                                        : 'badge-outline-danger'
                                                }`}
                                            >
                                                {in_time
                                                    ? 'Present'
                                                    : 'Absent'}
                                            </span>
                                        ),
                                    },
                                    {
                                        accessor: 'remarks',
                                        title: 'Remarks',
                                        render: ({
                                            in_time,
                                            out_time,
                                        }) => {
                                            const remarks: string[] =
                                                [];

                                            if (isLate(in_time)) {
                                                remarks.push(
                                                    'Late Entry'
                                                );
                                            }

                                            if (
                                                isEarlyLeave(
                                                    out_time
                                                )
                                            ) {
                                                remarks.push(
                                                    'Early Leave'
                                                );
                                            }

                                            return remarks.length >
                                                0
                                                ? remarks.join(', ')
                                                : 'Regular';
                                        },
                                    },
                                ]}
                                totalRecords={
                                    filteredAttendance.length
                                }
                                recordsPerPage={pageSize}
                                page={page}
                                onPageChange={setPage}
                                recordsPerPageOptions={
                                    PAGE_SIZES
                                }
                                onRecordsPerPageChange={
                                    setPageSize
                                }
                                minHeight={250}
                                noRecordsText="No attendance records found"
                                paginationText={({
                                    from,
                                    to,
                                    totalRecords,
                                }) =>
                                    `Showing ${from} to ${to} of ${totalRecords} entries`
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface InformationRowProps {
    label: string;
    value: string | number;
}

const InformationRow = ({
    label,
    value,
}: InformationRowProps) => {
    return (
        <div>
            <p className="text-xs font-semibold uppercase text-white-dark">
                {label}
            </p>

            <p className="mt-1 break-words font-medium">{value}</p>
        </div>
    );
};

interface SummaryCardProps {
    title: string;
    value: number;
    valueClassName?: string;
}

const SummaryCard = ({
    title,
    value,
    valueClassName = '',
}: SummaryCardProps) => {
    return (
        <div className="panel">
            <p className="text-sm text-white-dark">{title}</p>

            <h3
                className={`mt-2 text-2xl font-bold ${valueClassName}`}
            >
                {value}
            </h3>
        </div>
    );
};

export default EmployeeView;