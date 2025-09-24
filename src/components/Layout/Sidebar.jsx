import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Settings, 
  LogOut,
  BarChart3,
  Calendar,
  Mail
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { clsx } from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout, isAdmin, isDocente, isEstudiante } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  // Configuración de menús por rol
  const getMenuItems = () => {
    const commonItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
    ];

    if (isAdmin()) {
      return [
        ...commonItems,
        { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
        { icon: BookOpen, label: 'Cursos', path: '/admin/cursos' },
        { icon: GraduationCap, label: 'Carreras', path: '/admin/carreras' },
        { icon: Calendar, label: 'Ciclos', path: '/admin/ciclos' },
        { icon: FileText, label: 'Reportes', path: '/admin/reportes' },
        { icon: BarChart3, label: 'Estadísticas', path: '/admin/estadisticas' },
        { icon: Settings, label: 'Configuración', path: '/admin/configuracion' },
      ];
    }

    if (isDocente()) {
      return [
        ...commonItems,
        { icon: BookOpen, label: 'Mis Cursos', path: '/docente/cursos' },
        { icon: FileText, label: 'Notas', path: '/docente/notas' },
        { icon: BarChart3, label: 'Reportes', path: '/docente/reportes' },
        { icon: Mail, label: 'Mensajes', path: '/docente/mensajes' },
        { icon: Settings, label: 'Perfil', path: '/docente/perfil' },
      ];
    }

    if (isEstudiante()) {
      return [
        ...commonItems,
        { icon: BookOpen, label: 'Mis Cursos', path: '/estudiante/cursos' },
        { icon: FileText, label: 'Mis Notas', path: '/estudiante/notas' },
        { icon: Calendar, label: 'Horarios', path: '/estudiante/horarios' },
        { icon: Mail, label: 'Mensajes', path: '/estudiante/mensajes' },
        { icon: Settings, label: 'Perfil', path: '/estudiante/perfil' },
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      {/* Header del sidebar */}
      <div className="p-6 border-b border-secondary-200">
        <h1 className="text-xl font-bold text-secondary-800">
          Sistema de Notas
        </h1>
        <p className="text-sm text-secondary-600 mt-1">
          {user?.first_name} {user?.last_name}
        </p>
        <span className={clsx(
          'inline-block px-2 py-1 rounded-full text-xs font-medium mt-2',
          {
            'bg-red-100 text-red-800': isAdmin(),
            'bg-blue-100 text-blue-800': isDocente(),
            'bg-green-100 text-green-800': isEstudiante(),
          }
        )}>
          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'sidebar-item',
                    { 'active': isActive }
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
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
  );
};

export default Sidebar;