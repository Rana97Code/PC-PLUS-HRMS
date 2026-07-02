import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';

interface Props {
    children: JSX.Element;
    permission?: string;
}

const ProtectedRoute = ({ children, permission }: Props) => {
    const { user, role_key, permissions } = useSelector((state: IRootState) => state.auth);

    if (!user?.id) {
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