import { useState } from 'react';
import {
    BookOpen,
    Award,
    Calendar,
    FileText,
    User,
    LogOut,
    Home
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { clsx } from 'clsx';

// Importar componentes de las opciones del sidebar
import EstudianteDashboard from './EstudianteDashboard';
import MyCourses from './MyCourses';
import MyGrades from './MyGrades';
import Assignments from './Assignments';
import Schedule from './Schedule';
import Profile from './Profile';

const EstudianteLayout = () => {
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
            component: EstudianteDashboard
        },
        {
            id: 'courses',
            label: 'Mis Cursos',
            icon: BookOpen,
            component: MyCourses
        },
        {
            id: 'grades',
            label: 'Mis Calificaciones',
            icon: Award,
            component: MyGrades
        },
        {
            id: 'assignments',
            label: 'Tareas',
            icon: FileText,
            component: Assignments
        },
        {
            id: 'schedule',
            label: 'Horario',
            icon: Calendar,
            component: Schedule
        },
        {
            id: 'profile',
            label: 'Mi Perfil',
            icon: User,
            component: Profile
        }
    ];

    const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component || EstudianteDashboard;

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
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 bg-green-100 text-green-800">
                        Estudiante
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

export default EstudianteLayout;