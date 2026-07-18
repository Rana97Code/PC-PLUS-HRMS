import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import api from '../../../../api/axios';
import { setPageTitle } from '../../../../store/themeConfigSlice';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    department_id?: number | null;
    designation_id?: number | null;
    status?: number;
}

interface AttendanceRecord {
    id: number;
    employee_id: string;
    employee_name?: string;
    attendance_date: string;
    in_time: string | null;
    out_time: string | null;
    total_punch: number;
    source: string;
    status: number;
    created_at?: string;
    updated_at?: string;
}

interface EmployeeResponse {
    employees: Employee[];
}

interface AttendanceResponse {
    attendance: AttendanceRecord | null;
}

interface RecentAttendanceResponse {
    attendance: AttendanceRecord[];
}

interface SaveAttendanceResponse {
    message?: string;
    operation?: 'created' | 'updated';
    attendance?: AttendanceRecord;
}

const DEFAULT_IN_TIME = '10:00';
const DEFAULT_OUT_TIME = '18:00';

const getLocalDate = (): string => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Converts a stored datetime into HH:mm format.
 *
 * Supports:
 * 2026-07-18 10:00:00
 * 2026-07-18T04:00:00.000Z
 */
const extractTime = (
    value?: string | null
): string => {
    if (!value) {
        return '';
    }

    // MySQL DATETIME string
    if (value.includes(' ') && !value.includes('T')) {
        return value.split(' ')[1]?.slice(0, 5) || '';
    }

    // ISO datetime string
    if (value.includes('T')) {
        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            const parts = new Intl.DateTimeFormat(
                'en-GB',
                {
                    timeZone: 'Asia/Dhaka',
                    hour: '2-digit',
                    minute: '2-digit',
                    hourCycle: 'h23',
                }
            ).formatToParts(date);

            const hour =
                parts.find(
                    (part) => part.type === 'hour'
                )?.value || '';

            const minute =
                parts.find(
                    (part) => part.type === 'minute'
                )?.value || '';

            if (hour && minute) {
                return `${hour}:${minute}`;
            }
        }

        return value.split('T')[1]?.slice(0, 5) || '';
    }

    // Already HH:mm or HH:mm:ss
    if (/^\d{2}:\d{2}/.test(value)) {
        return value.slice(0, 5);
    }

    return '';
};

const formatDate = (
    value?: string | null
): string => {
    if (!value) {
        return 'N/A';
    }

    const dateOnly = value.slice(0, 10);
    const [year, month, day] = dateOnly.split('-');

    if (!year || !month || !day) {
        return value;
    }

    const monthNames = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
    ];

    const monthName =
        monthNames[Number(month) - 1] || month;

    return `${day}-${monthName}-${year}`;
};

const formatTimeValue = (
    time?: string | null
): string => {
    if (!time) {
        return 'N/A';
    }

    const normalizedTime =
        time.includes(':') && time.length <= 8
            ? time.slice(0, 5)
            : extractTime(time);

    if (!normalizedTime) {
        return 'N/A';
    }

    const [hourValue, minuteValue] =
        normalizedTime.split(':');

    const hour = Number(hourValue);
    const minute = minuteValue || '00';

    if (Number.isNaN(hour)) {
        return normalizedTime;
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;

    return `${String(formattedHour).padStart(
        2,
        '0'
    )}:${minute} ${period}`;
};

const ManualAttendance = () => {
    const dispatch = useDispatch();

    const [employees, setEmployees] =
        useState<Employee[]>([]);

    const [
        recentAttendance,
        setRecentAttendance,
    ] = useState<AttendanceRecord[]>([]);

    const [
        selectedEmployeeId,
        setSelectedEmployeeId,
    ] = useState('');

    const [
        attendanceDate,
        setAttendanceDate,
    ] = useState(getLocalDate());

    const [inTime, setInTime] =
        useState(DEFAULT_IN_TIME);

    const [outTime, setOutTime] =
        useState(DEFAULT_OUT_TIME);

    const [search, setSearch] = useState('');

    const [
        attendanceId,
        setAttendanceId,
    ] = useState<number | null>(null);

    const [
        existingSource,
        setExistingSource,
    ] = useState('');

    const [
        loadingEmployees,
        setLoadingEmployees,
    ] = useState(false);

    const [
        loadingAttendance,
        setLoadingAttendance,
    ] = useState(false);

    const [
        loadingRecent,
        setLoadingRecent,
    ] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] =
        useState(false);

    const selectedEmployee = useMemo(() => {
        return employees.find(
            (employee) =>
                employee.employee_id ===
                selectedEmployeeId
        );
    }, [employees, selectedEmployeeId]);

    const filteredEmployees = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        if (!keyword) {
            return employees;
        }

        return employees.filter((employee) => {
            const name =
                employee.name?.toLowerCase() || '';

            const employeeId =
                employee.employee_id
                    ?.toLowerCase() || '';

            const email =
                employee.email?.toLowerCase() || '';

            const phone =
                employee.phone?.toLowerCase() || '';

            return (
                name.includes(keyword) ||
                employeeId.includes(keyword) ||
                email.includes(keyword) ||
                phone.includes(keyword)
            );
        });
    }, [employees, search]);

    /**
     * Resets attendance values while keeping
     * selected employee and attendance date.
     */
    const clearAttendanceFields = () => {
        setAttendanceId(null);
        setExistingSource('');
        setInTime(DEFAULT_IN_TIME);
        setOutTime(DEFAULT_OUT_TIME);
    };

    /**
     * Resets the complete form.
     */
    const resetCompleteForm = () => {
        setSelectedEmployeeId('');
        setAttendanceDate(getLocalDate());
        setSearch('');
        setAttendanceId(null);
        setExistingSource('');
        setInTime(DEFAULT_IN_TIME);
        setOutTime(DEFAULT_OUT_TIME);
    };

    const loadEmployees = async () => {
        try {
            setLoadingEmployees(true);

            const response =
                await api.get<EmployeeResponse>(
                    '/hrms/manual-attendance/employees'
                );

            const employeeRows =
                response.data?.employees;

            setEmployees(
                Array.isArray(employeeRows)
                    ? employeeRows
                    : []
            );
        } catch (error: any) {
            setEmployees([]);

            await Swal.fire({
                icon: 'error',
                title: 'Employee Load Failed',
                text:
                    error.response?.data?.detail ||
                    'Unable to load employees.',
            });
        } finally {
            setLoadingEmployees(false);
        }
    };

    const loadRecentAttendance = async () => {
        try {
            setLoadingRecent(true);

            const response =
                await api.get<RecentAttendanceResponse>(
                    '/hrms/manual-attendance/recent',
                    {
                        params: {
                            limit: 20,
                        },
                    }
                );

            const attendanceRows =
                response.data?.attendance;

            setRecentAttendance(
                Array.isArray(attendanceRows)
                    ? attendanceRows
                    : []
            );
        } catch (error) {
            console.error(
                'Recent attendance load error:',
                error
            );

            setRecentAttendance([]);
        } finally {
            setLoadingRecent(false);
        }
    };

    const loadExistingAttendance = async () => {
        if (
            !selectedEmployeeId ||
            !attendanceDate
        ) {
            clearAttendanceFields();
            return;
        }

        try {
            setLoadingAttendance(true);

            const response =
                await api.get<AttendanceResponse>(
                    '/hrms/manual-attendance',
                    {
                        params: {
                            employee_id:
                                selectedEmployeeId,
                            attendance_date:
                                attendanceDate,
                        },
                    }
                );

            const attendance =
                response.data?.attendance;

            if (!attendance) {
                clearAttendanceFields();
                return;
            }

            setAttendanceId(attendance.id);

            setExistingSource(
                attendance.source || ''
            );

            const savedInTime = extractTime(
                attendance.in_time
            );

            const savedOutTime = extractTime(
                attendance.out_time
            );

            /*
             * If an existing record has no in-time or
             * out-time, show default office times.
             */
            setInTime(
                savedInTime || DEFAULT_IN_TIME
            );

            setOutTime(
                savedOutTime || DEFAULT_OUT_TIME
            );
        } catch (error: any) {
            clearAttendanceFields();

            await Swal.fire({
                icon: 'error',
                title: 'Attendance Load Failed',
                text:
                    error.response?.data?.detail ||
                    'Unable to load attendance.',
            });
        } finally {
            setLoadingAttendance(false);
        }
    };

    useEffect(() => {
        dispatch(
            setPageTitle('Manual Attendance')
        );

        loadEmployees();
        loadRecentAttendance();
    }, [dispatch]);

    useEffect(() => {
        loadExistingAttendance();
    }, [
        selectedEmployeeId,
        attendanceDate,
    ]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!selectedEmployeeId) {
            await Swal.fire({
                icon: 'warning',
                title: 'Employee Required',
                text:
                    'Please select an employee.',
            });

            return;
        }

        if (!attendanceDate) {
            await Swal.fire({
                icon: 'warning',
                title: 'Date Required',
                text:
                    'Please select an attendance date.',
            });

            return;
        }

        const finalInTime =
            inTime || DEFAULT_IN_TIME;

        const finalOutTime =
            outTime || DEFAULT_OUT_TIME;

        if (finalOutTime < finalInTime) {
            await Swal.fire({
                icon: 'warning',
                title: 'Invalid Time',
                text:
                    'Out-time cannot be earlier than in-time.',
            });

            return;
        }

        if (
            attendanceId &&
            existingSource.toLowerCase() ===
                'fingerprint'
        ) {
            const confirmation =
                await Swal.fire({
                    icon: 'warning',
                    title:
                        'Update Fingerprint Attendance?',
                    text:
                        'This attendance was recorded using the fingerprint device. Updating it will change the source to manual.',
                    showCancelButton: true,
                    confirmButtonText:
                        'Yes, update',
                    cancelButtonText: 'Cancel',
                });

            if (!confirmation.isConfirmed) {
                return;
            }
        }

        try {
            setSaving(true);

            const response =
                await api.post<SaveAttendanceResponse>(
                    '/hrms/manual-attendance',
                    {
                        employee_id:
                            selectedEmployeeId,
                        attendance_date:
                            attendanceDate,
                        in_time: finalInTime,
                        out_time: finalOutTime,
                    }
                );

            const savedAttendance =
                response.data?.attendance;

            if (savedAttendance) {
                setAttendanceId(
                    savedAttendance.id
                );

                setExistingSource(
                    savedAttendance.source ||
                        'manual'
                );

                setInTime(
                    extractTime(
                        savedAttendance.in_time
                    ) || finalInTime
                );

                setOutTime(
                    extractTime(
                        savedAttendance.out_time
                    ) || finalOutTime
                );
            }

            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text:
                    response.data?.message ||
                    'Attendance saved successfully.',
            });

            await Promise.all([
                loadExistingAttendance(),
                loadRecentAttendance(),
            ]);
        } catch (error: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text:
                    error.response?.data?.detail ||
                    'Unable to save attendance.',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!attendanceId) {
            return;
        }

        if (
            existingSource.toLowerCase() !==
            'manual'
        ) {
            await Swal.fire({
                icon: 'warning',
                title: 'Delete Not Allowed',
                text:
                    'Only manually entered attendance can be deleted from this page.',
            });

            return;
        }

        const confirmation = await Swal.fire({
            icon: 'warning',
            title: 'Delete Attendance?',
            text:
                'This manual attendance record will be permanently deleted.',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#e7515a',
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            setDeleting(true);

            const response = await api.delete(
                `/hrms/manual-attendance/${attendanceId}`
            );

            clearAttendanceFields();

            await Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text:
                    response.data?.message ||
                    'Attendance deleted successfully.',
            });

            await loadRecentAttendance();
        } catch (error: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text:
                    error.response?.data?.detail ||
                    'Unable to delete attendance.',
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleSelectRecentRecord = (
        attendance: AttendanceRecord
    ) => {
        setSelectedEmployeeId(
            attendance.employee_id
        );

        setAttendanceDate(
            attendance.attendance_date.slice(
                0,
                10
            )
        );

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="space-y-5">
            {/* Page heading */}
            <div className="panel">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h5 className="text-lg font-semibold dark:text-white-light">
                            Manual Attendance
                        </h5>

                        <p className="mt-1 text-sm text-white-dark">
                            Insert or update an
                            employee&apos;s in-time and
                            out-time manually.
                        </p>
                    </div>

                    {attendanceId ? (
                        <span
                            className={`badge ${
                                existingSource.toLowerCase() ===
                                'fingerprint'
                                    ? 'bg-success'
                                    : 'bg-info'
                            }`}
                        >
                            Existing{' '}
                            {existingSource ||
                                'attendance'}{' '}
                            record
                        </span>
                    ) : (
                        <span className="badge bg-primary">
                            New attendance
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {/* Attendance form */}
                <div className="panel xl:col-span-2">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-semibold">
                                    Search Employee
                                </label>

                                <input
                                    type="text"
                                    className="form-input"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Search by name, ID, email or phone"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold">
                                    Attendance Date

                                    <span className="ml-1 text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    className="form-input"
                                    value={
                                        attendanceDate
                                    }
                                    onChange={(event) =>
                                        setAttendanceDate(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">
                                Select Employee

                                <span className="ml-1 text-danger">
                                    *
                                </span>
                            </label>

                            <select
                                className="form-select"
                                value={
                                    selectedEmployeeId
                                }
                                onChange={(event) =>
                                    setSelectedEmployeeId(
                                        event.target
                                            .value
                                    )
                                }
                                disabled={
                                    loadingEmployees
                                }
                                required
                            >
                                <option value="">
                                    {loadingEmployees
                                        ? 'Loading employees...'
                                        : 'Select an employee'}
                                </option>

                                {filteredEmployees.map(
                                    (employee) => (
                                        <option
                                            key={
                                                employee.id
                                            }
                                            value={
                                                employee.employee_id
                                            }
                                        >
                                            {
                                                employee.employee_id
                                            }{' '}
                                            — {employee.name}
                                        </option>
                                    )
                                )}
                            </select>

                            {!loadingEmployees &&
                                filteredEmployees.length ===
                                    0 && (
                                    <p className="mt-2 text-sm text-danger">
                                        No matching
                                        employee found.
                                    </p>
                                )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-semibold">
                                    In-Time

                                    <span className="ml-1 text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="time"
                                    className="form-input"
                                    value={inTime}
                                    onChange={(event) =>
                                        setInTime(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                />

                                <p className="mt-1 text-xs text-white-dark">
                                    Default: 10:00 AM
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold">
                                    Out-Time

                                    <span className="ml-1 text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="time"
                                    className="form-input"
                                    value={outTime}
                                    onChange={(event) =>
                                        setOutTime(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                />

                                <p className="mt-1 text-xs text-white-dark">
                                    Default: 06:00 PM
                                </p>
                            </div>
                        </div>

                        {loadingAttendance && (
                            <div className="rounded-md bg-primary-light p-3 text-primary dark:bg-primary-dark-light">
                                Loading existing
                                attendance...
                            </div>
                        )}

                        {attendanceId &&
                            existingSource.toLowerCase() ===
                                'fingerprint' && (
                                <div className="rounded-md bg-warning-light p-3 text-warning dark:bg-warning-dark-light">
                                    This attendance
                                    was recorded by the
                                    fingerprint device.
                                    Saving will update
                                    the same record and
                                    change its source to
                                    manual.
                                </div>
                            )}

                        <div className="flex flex-wrap items-center gap-3 border-t border-white-light pt-5 dark:border-dark">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    saving ||
                                    loadingAttendance
                                }
                            >
                                {saving
                                    ? 'Saving...'
                                    : attendanceId
                                      ? 'Update Attendance'
                                      : 'Save Attendance'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={
                                    resetCompleteForm
                                }
                                disabled={
                                    saving || deleting
                                }
                            >
                                Reset
                            </button>

                            {attendanceId &&
                                existingSource.toLowerCase() ===
                                    'manual' && (
                                    <button
                                        type="button"
                                        className="btn btn-danger ltr:sm:ml-auto rtl:sm:mr-auto"
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={
                                            deleting ||
                                            saving
                                        }
                                    >
                                        {deleting
                                            ? 'Deleting...'
                                            : 'Delete Attendance'}
                                    </button>
                                )}
                        </div>
                    </form>
                </div>

                {/* Attendance summary */}
                <div className="panel h-fit">
                    <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
                        Attendance Summary
                    </h5>

                    <div className="space-y-5">
                        <div>
                            <p className="text-xs font-semibold uppercase text-white-dark">
                                Employee Name
                            </p>

                            <p className="mt-1 break-words font-semibold dark:text-white-light">
                                {selectedEmployee
                                    ?.name ||
                                    'Not selected'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-white-dark">
                                Employee ID
                            </p>

                            <p className="mt-1 font-semibold dark:text-white-light">
                                {selectedEmployeeId ||
                                    'N/A'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-white-dark">
                                Attendance Date
                            </p>

                            <p className="mt-1 font-semibold dark:text-white-light">
                                {formatDate(
                                    attendanceDate
                                )}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase text-white-dark">
                                    In-Time
                                </p>

                                <p className="mt-1 font-semibold dark:text-white-light">
                                    {formatTimeValue(
                                        inTime
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase text-white-dark">
                                    Out-Time
                                </p>

                                <p className="mt-1 font-semibold dark:text-white-light">
                                    {formatTimeValue(
                                        outTime
                                    )}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-white-dark">
                                Source
                            </p>

                            <span
                                className={`mt-2 inline-flex badge ${
                                    existingSource.toLowerCase() ===
                                    'fingerprint'
                                        ? 'bg-success'
                                        : existingSource.toLowerCase() ===
                                            'manual'
                                          ? 'bg-info'
                                          : 'bg-secondary'
                                }`}
                            >
                                {existingSource ||
                                    'Not saved'}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-white-dark">
                                Total Punch
                            </p>

                            <p className="mt-1 font-semibold dark:text-white-light">
                                {inTime && outTime
                                    ? 2
                                    : inTime ||
                                        outTime
                                      ? 1
                                      : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent attendance */}
            <div className="panel">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h5 className="text-lg font-semibold dark:text-white-light">
                            Recent Manual Attendance
                        </h5>

                        <p className="mt-1 text-sm text-white-dark">
                            Last 20 manually entered
                            attendance records.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={
                            loadRecentAttendance
                        }
                        disabled={loadingRecent}
                    >
                        {loadingRecent
                            ? 'Loading...'
                            : 'Refresh'}
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>In-Time</th>
                                <th>Out-Time</th>
                                <th>Total Punch</th>
                                <th>Source</th>
                                <th className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingRecent ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center"
                                    >
                                        Loading
                                        attendance...
                                    </td>
                                </tr>
                            ) : recentAttendance.length >
                              0 ? (
                                recentAttendance.map(
                                    (attendance) => (
                                        <tr
                                            key={
                                                attendance.id
                                            }
                                        >
                                            <td>
                                                <div>
                                                    <p className="font-semibold">
                                                        {attendance.employee_name ||
                                                            'Unknown Employee'}
                                                    </p>

                                                    <p className="text-xs text-white-dark">
                                                        {
                                                            attendance.employee_id
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    attendance.attendance_date
                                                )}
                                            </td>

                                            <td>
                                                {formatTimeValue(
                                                    attendance.in_time
                                                )}
                                            </td>

                                            <td>
                                                {formatTimeValue(
                                                    attendance.out_time
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    attendance.total_punch
                                                }
                                            </td>

                                            <td>
                                                <span className="badge bg-info">
                                                    {
                                                        attendance.source
                                                    }
                                                </span>
                                            </td>

                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        handleSelectRecentRecord(
                                                            attendance
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-white-dark"
                                    >
                                        No manual
                                        attendance found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManualAttendance;