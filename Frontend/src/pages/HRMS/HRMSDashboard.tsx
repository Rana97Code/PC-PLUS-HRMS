import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import api from '../../api/axios';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useDispatch } from 'react-redux';

import Dropdown from '../../components/Dropdown';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconUsers from '../../components/Icon/IconUsers';
import IconUser from '../../components/Icon/IconUser';
import IconClock from '../../components/Icon/IconClock';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconArrowLeft from '../../components/Icon/IconArrowLeft';

const HRDashboard = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const dispatch = useDispatch();

    const auth = useSelector((state: IRootState) => state.auth);

    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<any>({
        cards: {},
        department_chart: [],
        weekly_attendance: [],
        monthly_attendance: [],
        late_employees: [],
        early_out_employees: [],
        recent_activities: [],
    });

    const getDashboard = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/hrms/dashboard`);
            setDashboard(res.data);
        } catch (error) {
            console.error('HRMS dashboard loading failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboard();
    }, []);

    const cards = dashboard?.cards || {};

    const weeklyAttendanceChart = useMemo(() => {
        const rows = dashboard?.weekly_attendance || [];

        return {
            series: [
                {
                    name: 'Present',
                    data: rows.map((item: any) => item.present || 0),
                },
                {
                    name: 'Absent',
                    data: rows.map((item: any) => item.absent || 0),
                },
            ],
            options: {
                chart: {
                    height: 325,
                    type: 'area',
                    toolbar: { show: false },
                },
                dataLabels: { enabled: false },
                stroke: {
                    curve: 'smooth',
                    width: 2,
                },
                xaxis: {
                    categories: rows.map((item: any) => item.date),
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                },
            },
        };
    }, [dashboard]);

    const departmentChart = useMemo(() => {
        const rows = dashboard?.department_chart || [];

        return {
            series: rows.map((item: any) => item.total || 0),
            options: {
                chart: {
                    type: 'donut',
                },
                labels: rows.map((item: any) => item.department || 'N/A'),
                legend: {
                    position: 'bottom',
                },
                stroke: {
                    show: false,
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                        },
                    },
                },
            },
        };
    }, [dashboard]);

    const monthlyAttendanceChart = useMemo(() => {
        const rows = dashboard?.monthly_attendance || [];

        return {
            series: [
                {
                    name: 'Present',
                    data: rows.map((item: any) => item.present || 0),
                },
                {
                    name: 'Absent',
                    data: rows.map((item: any) => item.absent || 0),
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    toolbar: { show: false },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 6,
                        columnWidth: '45%',
                    },
                },
                dataLabels: { enabled: false },
                xaxis: {
                    categories: rows.map((item: any) => item.date),
                },
            },
        };
    }, [dashboard]);

    return (
        <div className="pt-5">
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <div className="panel">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white-dark">Total Employees</p>
                            <h3 className="text-2xl font-bold mt-2">{cards.totalEmployees || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-primary text-primary dark:text-primary-light grid place-content-center">
                            <IconUsers />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white-dark">Present Today</p>
                            <h3 className="text-2xl font-bold mt-2 text-success">{cards.presentToday || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light grid place-content-center">
                            <IconUser />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white-dark">Absent Today</p>
                            <h3 className="text-2xl font-bold mt-2 text-danger">{cards.absentToday || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light grid place-content-center">
                            <IconCalendar />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white-dark">Late Today</p>
                            <h3 className="text-2xl font-bold mt-2 text-warning">{cards.lateToday || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light grid place-content-center">
                            <IconClock />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-6 mb-6">
                <div className="panel h-full xl:col-span-2">
                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg">Weekly Attendance Overview</h5>
                        <Dropdown
                            offset={[0, 1]}
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                        >
                            <ul>
                                <li>
                                    <button type="button">Weekly</button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>

                    <p className="text-lg dark:text-white-light/90 mb-4">
                        Today Summary:
                        <span className="text-primary ml-2">
                            Present: {cards.presentToday || 0}, Absent: {cards.absentToday || 0}, Late: {cards.lateToday || 0}, Early Out: {cards.earlyOutToday || 0}
                        </span>
                    </p>

                    <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                        {loading ? (
                            <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                                <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                            </div>
                        ) : (
                            <ReactApexChart series={weeklyAttendanceChart.series} options={weeklyAttendanceChart.options as any} type="area" height={325} />
                        )}
                    </div>
                </div>

                <div className="panel h-full">
                    <div className="flex items-center mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Employees By Department</h5>
                    </div>

                    {loading ? (
                        <div className="h-[350px] grid place-content-center">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : (
                        <ReactApexChart options={departmentChart.options as any} series={departmentChart.series} type="donut" height={350} />
                    )}
                </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                <div className="panel h-full">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">HR Summary</h5>

                    <div className="space-y-7">
                        <div className="flex items-center">
                            <div className="w-9 h-9 ltr:mr-3 rtl:ml-3 bg-primary-light dark:bg-primary text-primary dark:text-primary-light rounded-full grid place-content-center">
                                <IconUsers />
                            </div>
                            <div className="flex-1">
                                <div className="flex font-semibold text-white-dark mb-2">
                                    <h6>Total Departments</h6>
                                    <p className="ltr:ml-auto rtl:mr-auto">{cards.totalDepartments || 0}</p>
                                </div>
                                <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b]">
                                    <div className="bg-gradient-to-r from-[#2196F3] to-[#1B55E2] h-full rounded-full" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-9 h-9 ltr:mr-3 rtl:ml-3 bg-success-light dark:bg-success text-success dark:text-success-light rounded-full grid place-content-center">
                                <IconUser />
                            </div>
                            <div className="flex-1">
                                <div className="flex font-semibold text-white-dark mb-2">
                                    <h6>Total Designations</h6>
                                    <p className="ltr:ml-auto rtl:mr-auto">{cards.totalDesignations || 0}</p>
                                </div>
                                <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b]">
                                    <div className="bg-gradient-to-r from-[#00AB55] to-[#0ba360] h-full rounded-full" style={{ width: '55%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-9 h-9 ltr:mr-3 rtl:ml-3 bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full grid place-content-center">
                                <IconCalendar />
                            </div>
                            <div className="flex-1">
                                <div className="flex font-semibold text-white-dark mb-2">
                                    <h6>Early Out Today</h6>
                                    <p className="ltr:ml-auto rtl:mr-auto">{cards.earlyOutToday || 0}</p>
                                </div>
                                <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b]">
                                    <div className="bg-gradient-to-r from-[#e2a03f] to-[#f09819] h-full rounded-full" style={{ width: '35%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel h-full">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">
                        Monthly Attendance
                        <span className="block text-white-dark text-sm font-normal">Present and absent count by date.</span>
                    </h5>

                    {loading ? (
                        <div className="h-[240px] grid place-content-center">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : (
                        <ReactApexChart series={monthlyAttendanceChart.series} options={monthlyAttendanceChart.options as any} type="bar" height={240} />
                    )}
                </div>

                <div className="panel h-full pb-0">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Late Employees</h5>

                    <div className="space-y-5">
                        {(dashboard.late_employees || []).length > 0 ? (
                            dashboard.late_employees.map((item: any, index: number) => (
                                <div className="flex" key={index}>
                                    <span className="shrink-0 grid place-content-center text-base w-9 h-9 rounded-md bg-warning-light dark:bg-warning text-warning dark:text-warning-light">
                                        {item.name?.slice(0, 2)?.toUpperCase() || 'NA'}
                                    </span>
                                    <div className="px-3 flex-1">
                                        <div>{item.name}</div>
                                        <div className="text-xs text-white-dark dark:text-gray-500">{item.department}</div>
                                    </div>
                                    <span className="text-warning text-sm px-1 ltr:ml-auto rtl:mr-auto whitespace-pre">
                                        {item.in_time}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-white-dark">No late employee today.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid xl:grid-cols-2 gap-6 mb-6">
                <div className="panel h-full">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Early Out Employees</h5>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Out Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(dashboard.early_out_employees || []).length > 0 ? (
                                    dashboard.early_out_employees.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.department}</td>
                                            <td>{item.designation}</td>
                                            <td>
                                                <span className="badge bg-warning">{item.out_time}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            No early out employee today.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="panel h-full pb-0">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Recent HR Activities</h5>

                    <PerfectScrollbar className="relative h-[250px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3 mb-4">
                        <div className="text-sm cursor-pointer">
                            {(dashboard.recent_activities || []).map((activity: any, index: number) => (
                                <div className="flex items-center py-1.5 relative group" key={index}>
                                    <div className="bg-primary w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">{activity.title}</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark">{activity.time}</div>
                                </div>
                            ))}
                        </div>
                    </PerfectScrollbar>

                    <div className="border-t border-white-light dark:border-white/10">
                        <button type="button" className="font-semibold group hover:text-primary p-4 flex items-center justify-center w-full">
                            View All
                            <IconArrowLeft className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition duration-300 ltr:ml-1 rtl:mr-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;