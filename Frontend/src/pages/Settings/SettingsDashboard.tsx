import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import api from '../../api/axios';

import IconUsers from '../../components/Icon/IconUsers';
import IconUser from '../../components/Icon/IconUser';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconMenuComponents from '../../components/Icon/Menu/IconMenuComponents';
import { IRootState } from '../../store';

const SettingsDashboard = () => {
    const dispatch = useDispatch();

    const auth = useSelector((state: IRootState) => state.auth);

    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<any>({
        cards: {},
        users_by_role: [],
        permissions_by_module: [],
        recent_users: [],
        recent_activities: [],
    });

    const getDashboard = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/settings/dashboard`);
            setDashboard(res.data);
        } catch (error) {
            console.error('Settings dashboard loading failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboard();
    }, []);

    const cards = dashboard.cards || {};

    const usersByRoleChart = useMemo(() => {
        const rows = dashboard.users_by_role || [];

        return {
            series: rows.map((item: any) => item.total || 0),
            options: {
                chart: { type: 'donut' },
                labels: rows.map((item: any) => item.role_name || 'No Role'),
                legend: { position: 'bottom' },
                stroke: { show: false },
                plotOptions: {
                    pie: {
                        donut: { size: '65%' },
                    },
                },
            },
        };
    }, [dashboard]);

    const permissionsByModuleChart = useMemo(() => {
        const rows = dashboard.permissions_by_module || [];

        return {
            series: [
                {
                    name: 'Permissions',
                    data: rows.map((item: any) => item.total || 0),
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
                    categories: rows.map((item: any) => item.module_name || 'Others'),
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
                            <p className="text-white-dark">Total Users</p>
                            <h3 className="text-2xl font-bold mt-2">{cards.totalUsers || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-primary text-primary dark:text-primary-light grid place-content-center">
                            <IconUsers />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white-dark">Active Roles</p>
                            <h3 className="text-2xl font-bold mt-2 text-success">{cards.activeRoles || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light grid place-content-center">
                            <IconUser />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white-dark">Permissions</p>
                            <h3 className="text-2xl font-bold mt-2 text-warning">{cards.totalPermissions || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light grid place-content-center">
                            <IconLockDots />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white-dark">Assigned Access</p>
                            <h3 className="text-2xl font-bold mt-2 text-danger">{cards.assignedPermissions || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light grid place-content-center">
                            <IconMenuComponents />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-6 mb-6">
                <div className="panel h-full xl:col-span-2">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Permissions By Module</h5>

                    {loading ? (
                        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : (
                        <ReactApexChart
                            series={permissionsByModuleChart.series}
                            options={permissionsByModuleChart.options as any}
                            type="bar"
                            height={325}
                        />
                    )}
                </div>

                <div className="panel h-full">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Users By Role</h5>

                    {loading ? (
                        <div className="h-[350px] grid place-content-center">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : (
                        <ReactApexChart
                            options={usersByRoleChart.options as any}
                            series={usersByRoleChart.series}
                            type="donut"
                            height={350}
                        />
                    )}
                </div>
            </div>

            <div className="grid xl:grid-cols-2 gap-6 mb-6">
                <div className="panel h-full">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Recent Users</h5>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(dashboard.recent_users || []).length > 0 ? (
                                    dashboard.recent_users.map((user: any) => (
                                        <tr key={user.id}>
                                            <td>{user.user_name}</td>
                                            <td>{user.user_email}</td>
                                            <td>
                                                <span className="badge bg-primary">
                                                    {user.Role?.role_name || 'No Role'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="panel h-full pb-0">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Recent Settings Activities</h5>

                    <PerfectScrollbar className="relative h-[250px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3 mb-4">
                        <div className="text-sm cursor-pointer">
                            {(dashboard.recent_activities || []).map((activity: any, index: number) => (
                                <div className="flex items-center py-1.5 relative group" key={index}>
                                    <div className="bg-primary w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                    <div className="flex-1">{activity.title}</div>
                                    <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark">
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    );
};

export default SettingsDashboard;