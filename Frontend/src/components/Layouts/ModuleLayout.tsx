import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../App';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Portals from '../Portals';

import HRHeader from './hr/HRHeader';
import HRSidebar from './hr/HRSidebar';
import HRFooter from './hr/HRFooter';

import AccountsHeader from './accounts/AccountsHeader';
import AccountsSidebar from './accounts/AccountsSidebar';
import AccountsFooter from './accounts/AccountsFooter';

import InventoryHeader from './inventory/InventoryHeader';
import InventorySidebar from './inventory/InventoryFooter';
import InventoryFooter from './inventory/InventoryFooter';

import SettingsHeader from './settings/SettingsHeader';
import SettingsSidebar from './settings/SettingsSidebar';
import SettingsFooter from './settings/SettingsFooter';

const layouts: any = {
    hr: {
        Header: HRHeader,
        Sidebar: HRSidebar,
        Footer: HRFooter,
    },
    accounts: {
        Header: AccountsHeader,
        Sidebar: AccountsSidebar,
        Footer: AccountsFooter,
    },
        inventory: {
            Header: InventoryHeader,
            Sidebar: InventorySidebar,
            Footer: InventoryFooter,
        },
    settings: {
        Header: SettingsHeader,
        Sidebar: SettingsSidebar,
        Footer: SettingsFooter,
    },
};

const ModuleLayout = ({ children, module = 'hr' }: PropsWithChildren<{ module?: string }>) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);

    const SelectedLayout = layouts[module] || layouts.hr;

    const Header = SelectedLayout.Header;
    const Sidebar = SelectedLayout.Sidebar;
    const Footer = SelectedLayout.Footer;

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const onScrollHandler = () => {
        const shouldShow = document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;
        setShowTopButton((prev) => (prev === shouldShow ? prev : shouldShow));
    };

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler);

        const screenLoader = document.getElementsByClassName('screen_loader');

        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');

            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

        return () => {
            window.removeEventListener('scroll', onScrollHandler);
        };
    }, []);

    return (
        <App>
            <div className="relative">
                <div
                    className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 bg-[black]/60 z-50 lg:hidden`}
                    onClick={() => dispatch(toggleSidebar())}
                ></div>

                {showLoader && (
                    <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-12 h-12 inline-block"></span>
                    </div>
                )}

                <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
                    {showTopButton && (
                        <button type="button" className="btn btn-outline-primary rounded-full p-2" onClick={goToTop}>
                            ↑
                        </button>
                    )}
                </div>

                <div className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen`}>
                    <Sidebar />

                    <div className="main-content flex flex-col min-h-screen">
                        <Header />

                        <Suspense>
                            <div className={`${themeConfig.animation} p-6 animate__animated`}>
                                {children}
                            </div>
                        </Suspense>

                        <Footer />
                        <Portals />
                    </div>
                </div>
            </div>
        </App>
    );
};

export default ModuleLayout;