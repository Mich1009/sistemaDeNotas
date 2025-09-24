import { useState } from 'react';
import {
    Users,
    BookOpen,
    GraduationCap,
    FileText,
    Settings,
    BarChart3,
    LogOut,
    Home
} from 'lucide-react';
import useAuthStore from '../../auth/store/authStore';
import { clsx } from 'clsx';

// Importar componentes de las opciones del sidebar
import Dashboard from '../components/Dashboard';;
import Docentes from '../components/Docentes';
import Courses from '../components/Course';
import Students from '../components/Students';
import Reports from '../components/Reports';
import Configuracion from '../components/Configuracion';

const AdminPage = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            component: Dashboard
        },
        {
            id: 'docentes',
            label: 'Docentes',
            icon: Users,
            component: Docentes
        },
        {
            id: 'courses',
            label: 'Cursos',
            icon: BookOpen,
            component: Courses
        },
        {
            id: 'students',
            label: 'Estudiantes',
            icon: GraduationCap,
            component: Students
        },
        {
            id: 'reports',
            label: 'Reportes',
            icon: FileText,
            component: Reports
        },
        {
            id: 'settings',
            label: 'Configuración',
            icon: Settings,
            component: Configuracion
        }
    ];

    const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component || AdminDashboard;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
                {/* Header del sidebar */}
                <div className="p-6 border-b border-secondary-200">
                    <h1 className="text-xl font-bold text-secondary-800">
                        Sistema de Notas
                    </h1>
                    <p className="text-sm text-secondary-600 mt-1">
                        {user?.first_name} {user?.last_name}
                    </p>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 bg-red-100 text-red-800">
                        Admin
                    </span>
                </div>

                {/* Navegación */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveSection(item.id)}
                                        className={clsx(
                                            'sidebar-item w-full text-left',
                                            { 'active': isActive }
                                        )}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer del sidebar */}
                <div className="p-4 border-t border-secondary-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;