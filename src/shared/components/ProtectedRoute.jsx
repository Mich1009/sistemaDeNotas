import { Navigate } from 'react-router-dom';
import useAuthStore from '../../modules/auth/store/authStore';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, user } = useAuthStore();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se requieren roles específicos, verificar
    if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;