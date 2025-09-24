import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './modules/auth/store/authStore';

// Componentes de autenticación
import Login from './modules/auth/pages/Login';
import ProtectedRoute from './shared/components/ProtectedRoute';
import Unauthorized from './shared/components/Unauthorized';

// Pages for Module
import AdminPage from './modules/admin/pages/AdminPage';
import DocentePage from './modules/teacher/pages/DocentePage';
import StudentPage from './modules/student/pages/Studentpage';

function App() {
    const { isAuthenticated, user } = useAuthStore();

    // Componente para redirigir al dashboard correcto según el rol
    const DashboardRedirect = () => {
        if (!isAuthenticated || !user) {
            return <Navigate to="/login" replace />;
        }

        const roleRoutes = {
            admin: '/admin',
            docente: '/docente',
            estudiante: '/estudiante',
        };

        return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
    };

    return (
        <Router>
            <Routes>
                {/* Ruta de login */}
                <Route path="/login" element={<Login />} />

                {/* Ruta de acceso no autorizado */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Ruta por defecto - redirigir al dashboard */}
                <Route path="/" element={<DashboardRedirect />} />

                {/* Redirección del dashboard principal */}
                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Rutas protegidas */}
                
                {/* Rutas de Administrador */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute requiredRoles={['admin']}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                {/* Rutas de Docente */}
                <Route
                    path="/docente/*"
                    element={
                        <ProtectedRoute requiredRoles={['docente']}>
                            <DocentePage />
                        </ProtectedRoute>
                    }
                />

                {/* Rutas de Estudiante */}
                <Route
                    path="/estudiante/*"
                    element={
                        <ProtectedRoute requiredRoles={['estudiante']}>
                            <StudentPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            {/* Configuración global de notificaciones */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        theme: {
                            primary: '#4ade80',
                            secondary: '#black',
                        },
                    },
                    error: {
                        duration: 5000,
                        theme: {
                            primary: '#ef4444',
                            secondary: '#black',
                        },
                    },
                }}
            />
        </Router>
    );
}

export default App;
