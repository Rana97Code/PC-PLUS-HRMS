import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../../store';
import { useState, useEffect } from 'react';

import IconCaretsDown from '../../Icon/IconCaretsDown';
import IconCaretDown from '../../Icon/IconCaretDown';
import IconMenuDashboard from '../../Icon/Menu/IconMenuDashboard';
import IconMinus from '../../Icon/IconMinus';
import IconMenuUsers from '../../Icon/Menu/IconMenuUsers';
import IconMenuComponents from '../../Icon/Menu/IconMenuScrumboard';

const SettingsSidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const { permissions, role_key } = useSelector((state: IRootState) => state.auth);

    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const can = (permission: string) => {
        return role_key === 'super_admin' || permissions.includes(permission);
    };

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

return (
    <div className={semidark ? 'dark' : ''}>
        <nav
            className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
                semidark ? 'text-white-dark' : ''
            }`}
        >
            <div className="bg-white dark:bg-black h-full">
                <div className="flex justify-between items-center px-4 py-3">
                    <NavLink to="/pages/erp/modules" className="main-logo flex items-center shrink-0">
                        <img className="w-48 h-20 ml-[5px] flex-none" src="/assets/images/auth/vatfavicon.png" alt="logo" />
                    </NavLink>

                    <button
                        type="button"
                        className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                        onClick={() => dispatch(toggleSidebar())}
                    >
                        <IconCaretsDown className="m-auto rotate-90" />
                    </button>
                </div>

                <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                    <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                        <IconMinus className="w-4 h-5 flex-none hidden" />
                        <span>{t('Settings Navigation')}</span>
                    </h2>

                    <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                        {can('settings_dashboard') && (
                            <li className="nav-item">
                                <NavLink to="/pages/settings/dashboard" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3">{t('Dashboard')}</span>
                                    </div>
                                </NavLink>
                            </li>
                        )}

                        {(can('user_role_manage') || can('role_manage') || can('permission_manage') || can('role_permission_manage')) && (
                            <li className="menu nav-item">
                                <button
                                    type="button"
                                    className={`${currentMenu === 'users' ? 'active' : ''} nav-link group w-full`}
                                    onClick={() => toggleMenu('users')}
                                >
                                    <div className="flex items-center">
                                        <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3">{t('User & Role Settings')}</span>
                                    </div>

                                    <div className={currentMenu !== 'users' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'users' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        {can('user_role_manage') && (
                                            <li>
                                                <NavLink to="/pages/settings/user-roles">{t('User Roles')}</NavLink>
                                            </li>
                                        )}

                                        {can('role_manage') && (
                                            <li>
                                                <NavLink to="/pages/settings/roles">{t('Roles')}</NavLink>
                                            </li>
                                        )}

                                        {can('permission_manage') && (
                                            <li>
                                                <NavLink to="/pages/settings/permissions">{t('Permissions')}</NavLink>
                                            </li>
                                        )}

                                        {can('role_permission_manage') && (
                                            <li>
                                                <NavLink to="/pages/settings/role-permissions">{t('Role Permissions')}</NavLink>
                                            </li>
                                        )}
                                    </ul>
                                </AnimateHeight>
                            </li>
                        )}

                        <li className="nav-item">
                            <div className="border-t border-gray-200 dark:border-[#253b5c] my-2"></div>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/pages/erp/modules" className="group">
                                <div className="flex items-center">
                                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                    <span className="ltr:pl-3 rtl:pr-3">{t('ERP Modules')}</span>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </PerfectScrollbar>
            </div>
        </nav>
    </div>
);
};

export default SettingsSidebar;