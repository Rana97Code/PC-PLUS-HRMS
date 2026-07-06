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

const AccountsSidebar = () => {
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
                {/* Logo */}
                <div className="flex justify-between items-center px-4 py-3">
                    <NavLink
                        to="/pages/erp/modules"
                        className="main-logo flex items-center shrink-0"
                    >
                        <img
                            className="w-48 h-20 ml-[5px] flex-none"
                            src="/assets/images/auth/vatfavicon.png"
                            alt="logo"
                        />
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
                        <span>{t('Accounts Navigation')}</span>
                    </h2>

                    <ul className="relative font-semibold space-y-0.5 p-4 py-0">

                        {/* Dashboard */}
                        {can('accounts_dashboard') && (
                            <li className="nav-item">
                                <NavLink
                                    to="/pages/accounts/dashboard"
                                    className="group"
                                >
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3">
                                            {t('Dashboard')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        )}

                        {/* Accounts Menu */}
                        {(can('accounts_summary_view') ||
                            can('transaction_view') ||
                            can('due_view')) && (
                            <li className="menu nav-item">
                                <button
                                    type="button"
                                    className={`${
                                        currentMenu === 'accounts'
                                            ? 'active'
                                            : ''
                                    } nav-link group w-full`}
                                    onClick={() => toggleMenu('accounts')}
                                >
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3">
                                            {t('Accounts')}
                                        </span>
                                    </div>

                                    <div
                                        className={`${
                                            currentMenu !== 'accounts'
                                                ? 'rtl:rotate-90 -rotate-90'
                                                : ''
                                        }`}
                                    >
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight
                                    duration={300}
                                    height={
                                        currentMenu === 'accounts'
                                            ? 'auto'
                                            : 0
                                    }
                                >
                                    <ul className="sub-menu text-gray-500">

                                        {can('accounts_summary_view') && (
                                            <li>
                                                <NavLink to="/pages/accounts/summary">
                                                    {t('Accounts Summary')}
                                                </NavLink>
                                            </li>
                                        )}

                                        {can('transaction_view') && (
                                            <li>
                                                <NavLink to="/pages/accounts/transaction">
                                                    {t('Transaction')}
                                                </NavLink>
                                            </li>
                                        )}

                                        {can('due_view') && (
                                            <li>
                                                <NavLink to="/pages/accounts/due">
                                                    {t('Due Management')}
                                                </NavLink>
                                            </li>
                                        )}

                                    </ul>
                                </AnimateHeight>
                            </li>
                        )}

                        {/* Reports */}
                        {can('accounts_report_view') && (
                            <li className="nav-item">
                                <NavLink
                                    to="/pages/accounts/reports"
                                    className="group"
                                >
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3">
                                            {t('Reports')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        )}

                        {/* Settings */}
                        {can('accounts_settings_view') && (
                            <li className="nav-item">
                                <NavLink
                                    to="/pages/accounts/settings"
                                    className="group"
                                >
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3">
                                            {t('Settings')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        )}

                        {/* Divider */}
                        <li className="nav-item">
                            <div className="border-t border-gray-200 dark:border-[#253b5c] my-2"></div>
                        </li>

                        {/* Back to Modules */}
                        <li className="nav-item">
                            <NavLink
                                to="/pages/erp/modules"
                                className="group"
                            >
                                <div className="flex items-center">
                                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                    <span className="ltr:pl-3 rtl:pr-3">
                                        {t('ERP Modules')}
                                    </span>
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

export default AccountsSidebar;