import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import i18next from 'i18next';
import axios from 'axios';

import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconGoogle from '../../components/Icon/IconGoogle';

const RegisterCover = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/pcplus/api';

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const [flag, setFlag] = useState(themeConfig.locale);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [officeToken, setOfficeToken] = useState('');
    const [error, setError] = useState('');
    const [tokenError, setTokenError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(setPageTitle('Register Cover'));
    }, [dispatch]);

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };


const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        setError('');
        setTokenError('');
        setLoading(true);

        await axios.post(`${baseUrl}/create_user`, {
            user_name: name,
            user_phone: phone,
            user_email: email,
            user_password: password,
            office_token: officeToken,
        });

        setSuccess('Registration successful. Please login now.');

        setTimeout(() => {
            navigate('/login', { replace: true });
        }, 1000);

    } catch (err: any) {
        if (err.response?.status === 403) {
            setError('Your office verification token is invalid.');
            setTokenError('Your office verification token is invalid.');
        } else if (err.response?.status === 400) {
            setError(err.response?.data?.detail || 'Registration failed.');
        } else {
            setError('Registration failed. Please try again.');
            setTokenError('');
        }
    } finally {
        setLoading(false);
    }
};



    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />

                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(0,18,98,1)_0%,rgba(32,4,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                <img src="/assets/images/auth/pcplus.jpeg" alt="Logo" className="w-full" />
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/user.png" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <NavLink to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </NavLink>

                            <div className="dropdown ms-auto w-max">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                    button={
                                        <>
                                            <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                            <div className="text-base font-bold uppercase">{flag}</div>
                                            <IconCaretDown />
                                        </>
                                    }
                                >
                                    <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                        {themeConfig.languageList.map((item: any) => (
                                            <li key={item.code}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full hover:text-primary rounded-lg ${flag === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                    onClick={() => {
                                                        i18next.changeLanguage(item.code);
                                                        setLocale(item.code);
                                                    }}
                                                >
                                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                    <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign Up</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your information to register</p>
                            </div>

                            {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">{error}</div>}
                            {success && <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-600">{success}</div>}

                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Name">Name</label>
                                    <div className="relative text-white-dark">
                                        <input id="Name" name="name" type="text" autoComplete="name" placeholder="Enter Name" className="form-input ps-10 placeholder:text-white-dark" value={name} onChange={(e) => setName(e.target.value)} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Phone">Phone</label>
                                    <div className="relative text-white-dark">
                                        <input id="Phone" name="phone" type="text" autoComplete="tel" placeholder="Enter Phone" className="form-input ps-10 placeholder:text-white-dark" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" name="email" type="email" autoComplete="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" name="password" type="password" placeholder="Enter Password" autoComplete="new-password" className="form-input ps-10 placeholder:text-white-dark" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="OfficeToken">Office Verification Token</label>

                                    <div className="relative text-white-dark">
                                        <input
                                            id="OfficeToken"
                                            name="officeToken"
                                            type="password"
                                            autoComplete="off"
                                            placeholder="Enter Office Verification Token"
                                            value={officeToken}
                                            onChange={(e) => {
                                                setOfficeToken(e.target.value);
                                                setTokenError('');
                                            }}
                                            className={`form-input ps-10 placeholder:text-white-dark ${
                                                tokenError ? 'border-red-500 focus:border-red-500' : ''
                                            }`}
                                            required
                                        />

                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>

                                    {tokenError && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {tokenError}
                                        </p>
                                    )}
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] disabled:opacity-60">
                                    {loading ? 'Creating...' : 'Sign Up'}
                                </button>
                            </form>

                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>

                            <div className="mb-10 md:mb-[60px]">
                                <ul className="flex justify-center gap-3.5 text-white">
                                    <li><Link to="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}><IconInstagram /></Link></li>
                                    <li><Link to="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}><IconFacebookCircle /></Link></li>
                                    <li><Link to="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}><IconTwitter fill={true} /></Link></li>
                                    <li><Link to="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}><IconGoogle /></Link></li>
                                </ul>
                            </div>

                            <div className="text-center dark:text-white">
                                Already have an account ?&nbsp;
                                <NavLink to="/" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN IN
                                </NavLink>
                            </div>
                        </div>

                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.PC PLUS Solution All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCover;