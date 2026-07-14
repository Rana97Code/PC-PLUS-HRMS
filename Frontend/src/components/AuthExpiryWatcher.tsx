import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { logout } from '../store/authSlice';
import { IRootState } from '../store';

interface JwtPayload {
    exp?: number;
}

const AuthExpiryWatcher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector(
        (state: IRootState) => state.auth.token
    );

    useEffect(() => {
        if (!token) return;

        try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (!decoded.exp) return;

            const expiresAt = decoded.exp * 1000;

            const timeout = expiresAt - Date.now();

            if (timeout <= 0) {
                dispatch(logout());
                localStorage.clear();
                navigate('/login', { replace: true });
                return;
            }

            const timer = setTimeout(() => {
                dispatch(logout());
                localStorage.clear();
                navigate('/login', { replace: true });
            }, timeout);

            return () => clearTimeout(timer);
        } catch {
            dispatch(logout());
            localStorage.clear();
            navigate('/login', { replace: true });
        }
    }, [token, dispatch, navigate]);

    return null;
};

export default AuthExpiryWatcher;