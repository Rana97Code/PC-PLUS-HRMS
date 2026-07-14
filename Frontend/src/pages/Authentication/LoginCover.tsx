import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import Swal from 'sweetalert2';

import { IRootState } from '../../store';
import { loginSuccess } from '../../store/authSlice';

import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconUser from '../../components/Icon/IconUser';

const LoginCover = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: IRootState) => state.auth);


    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user?.id) {
            navigate('/pages/erp/modules', { replace: true });
        }
    }, [user?.id, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post(`/auth`, formData);

            if (response?.data?.access_token && response?.data?.user) {
                dispatch(
                    loginSuccess({
                        token: response.data.access_token,
                        user: response.data.user,
                        role_key: response.data.user.role_key,
                        permissions: response.data.user.permissions || [],
                    })
                );

                navigate('/pages/erp/modules');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Enter a valid user email and password',
                });
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.detail || 'Enter a valid User Email & Password',
            });
        }
    };



    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/1.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(0,18,98,1)_0%,rgba(32,4,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/vatfavicon.png" alt="Logo" className="w-full" />
                            </Link>
                            {/* <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/vatfavicon.png" alt="Cover Image" className="w-full" />
                            </div> */}
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your username and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" autoComplete="on" onSubmit={handleSubmit} method='POST' >
                                <div>
                                    <label htmlFor="userName">User Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="UserName" type="text"
                                            placeholder="Enter User Email"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={e => setUser(e.target.value)} required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" type="password"
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots />
                                        </span>
                                    </div>
                                </div>
                                {/* <Link  type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"> */}
                                <button type='submit' className="btn bg-[linear-gradient(225deg,rgba(0,18,98,1)_0%,rgba(32,4,238,1)_100%)] !mt-6 w-full border-0 uppercase text-white">Sign in</button>
                                
                                <div className="relative my-7 text-center md:mb-9">
                                    <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                    <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                                </div>

                            <div className="text-center dark:text-white">
                                I don't have an account ?&nbsp;
                                <NavLink to="/register" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN UP
                                </NavLink>
                            </div>


                            </form>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.PC PLUS Solution All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginCover;



