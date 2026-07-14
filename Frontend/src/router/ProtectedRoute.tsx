import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import { IRootState } from '../store';
import { logout } from '../store/authSlice';

interface Props {
    children: JSX.Element;
    permission?: string;
}

interface JwtPayload {
    exp?: number;
}

const ProtectedRoute = ({ children, permission }: Props) => {
    const dispatch = useDispatch();

    const { user, token, role_key, permissions } = useSelector(
        (state: IRootState) => state.auth
    );

    const isExpired = useMemo(() => {
        if (!token) return true;

        try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (!decoded.exp) return true;

            return decoded.exp * 1000 <= Date.now();
        } catch {
            return true;
        }
    }, [token]);

    useEffect(() => {
        if (isExpired && (user || token)) {
            dispatch(logout());
        }
    }, [isExpired, user, token, dispatch]);

    if (!user?.id || !token || isExpired) {
        return <Navigate to="/login" replace />;
    }

    if (role_key === 'super_admin') {
        return children;
    }

    if (permission && !permissions?.includes(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;