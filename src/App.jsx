import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Componentes de autenticación
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Unauthorized from './components/Common/Unauthorized';

// Layout
import Layout from './components/Layout/Layout';

// Dashboards
import AdminDashboard from './pages/Admin/AdminDashboard';
import DocenteDashboard from './pages/Docente/DocenteDashboard';
import EstudianteDashboard from './pages/Estudiante/EstudianteDashboard';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Componente para redirigir al dashboard correcto según el rol
  const DashboardRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }

    const roleRoutes = {
      admin: '/admin/dashboard',
      docente: '/docente/dashboard',
      estudiante: '/estudiante/dashboard',
    };

    return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta de acceso no autorizado */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Redirección del dashboard principal */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Rutas protegidas con layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          > 
            {/* Ruta por defecto - redirigir al dashboard */}
            <Route index element={<DashboardRedirect />} />
            
            {/* Rutas de Administrador */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de Docente */}
            <Route
              path="docente/dashboard"
              element={
                <ProtectedRoute requiredRoles={['docente']}>
                  <DocenteDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de Estudiante */}
            <Route
              path="estudiante/dashboard"
              element={
                <ProtectedRoute requiredRoles={['estudiante']}>
                  <EstudianteDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        
        {/* Configuración global de notificaciones */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
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
      </div>
    </Router>
  );
}

export default App;
