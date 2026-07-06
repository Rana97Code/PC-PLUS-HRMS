import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuComponents from '../Icon/Menu/IconMenuScrumboard';


const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [procurementSubMenu, setProcurementSubMenu] = useState(false);
    const [salesSubMenu, setSalesSubMenu] = useState(false);
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/index" className="main-logo flex items-center shrink-0">
                            <img className="w-50 h-24 ml-[5px] flex-none" src="/assets/images/auth/vatfavicon.png" alt="logo" />
                            {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('VRISTO')}</span> */}
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
                            <span>{t('Navigation')}</span>
                        </h2>
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {/*-------------- Dashboard  ----------------*/}
                            <li className="menu nav-item">
                                <NavLink to="/index" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDashboard
                                            className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                    </div>
                                </NavLink>
                            </li>


                                                        {/*----------- Accounts -----------*/}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'Accounts' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Accounts')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Accounts')}</span>
                                    </div>

                                    <div className={currentMenu !== 'Accounts' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'Accounts' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/pages/accounts/summary">{t('Accounts Summary')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/accounts/transaction">{t('Transaction')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/accounts/due">{t('Due')}</NavLink>
                                        </li>

                                    </ul>
                                </AnimateHeight>
                            </li>



                                                        {/*----------- Employee -----------*/}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'Employee' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Employee')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Employee')}</span>
                                    </div>

                                    <div className={currentMenu !== 'Employee' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'Employee' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/pages/employees">{t('Employee List')}</NavLink>
                                        </li>
                                        {/* <li>
                                            <NavLink to="/pages/employee/attendance">{t('Employee Attendance')}</NavLink>
                                        </li> */}
                                        <li>
                                            <NavLink to="/pages/employee/designation">{t('Employee Designation')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/employee/department">{t('Employee Department')}</NavLink>
                                        </li>

                                    </ul>
                                </AnimateHeight>
                            </li>


                            {/* ----------- User Settings ----------- */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'Settings' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Settings')}>
                                    <div className="flex items-center">
                                        <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('User Settings')}</span>
                                    </div>

                                    <div className={currentMenu !== 'Settings' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'Settings' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/pages/settings/user-roles">{t('User Roles')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/roles">{t('Roles')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/permissions">{t('Permissions')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/role-permissions">{t('Role Permissions')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>


                            {/*----------- General Settings -----------*/}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'setting' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('setting')}>
                                    <div className="flex items-center">
                                        <IconMenuAuthentication className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('General Settings')}</span>
                                    </div>

                                    <div className={currentMenu !== 'setting' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'setting' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${errorSubMenu ? 'open' : ''
                                                    } w-full before:bg-gray-300 before:w-[5px] before:h-[5px] before:rounded ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] hover:bg-gray-100 dark:hover:bg-gray-900`}
                                                onClick={() => setErrorSubMenu(!errorSubMenu)}
                                            >
                                                {t('User Config')}
                                                <div className={`${errorSubMenu ? 'rtl:rotate-90 -rotate-90' : ''} ltr:ml-auto rtl:mr-auto`}>
                                                    <IconCaretsDown fill={true} className="w-4 h-4" />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={errorSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <a href="/pages/user/index" >{t('User')}</a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/user/role" >{t('Role')}</a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/user/permissions" >{t('Permissions')}</a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/user/userRolePermission" >{t('Role Permissions')}</a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/user/userPermissions" >{t('User Permissions')}</a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/user/userRole" >{t('User Role')}</a>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/Company_Settings">{t('Company Settings')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/authorised_person/index">{t('Authorised Person')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/costing">{t('Costing')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/custom_house">{t('Custom-House')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/currency/index">{t('Currency')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/settings/unit">{t('Unit')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/cpccode/list">{t('Cpc-Code')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/hscode/list">{t('HS-Code')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/pages/hscode/backup_database">{t('Backup Database')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;