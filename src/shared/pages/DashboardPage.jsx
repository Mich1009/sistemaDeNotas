import { useState, useEffect } from 'react';
import { LogOut, SidebarClose, Menu } from 'lucide-react';
import useAuthStore from '../../modules/auth/store/authStore';
import useNavigationStore from '../store/navigationStore';
import { useLogoContext } from '../contexts/LogoContext';
import { clsx } from 'clsx';
import { getMenuItemsByRole, getRoleConfig } from '../config/menuConfig';

const DashboardPage = () => {
    const { user, logout } = useAuthStore();
    const {
        activeSection,
        sidebarCollapsed,
        setActiveSection,
        toggleSidebar
    } = useNavigationStore();
    const { logoUrl, loading: logoLoading } = useLogoContext();

    const handleLogout = () => {
        logout();
    };

    // Obtener configuración basada en el rol del usuario
    const menuItems = getMenuItemsByRole(user?.role);
    const roleConfig = getRoleConfig(user?.role);

    // Encontrar el componente activo
    const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component;

    // Si no hay componente activo, mostrar el dashboard por defecto
    useEffect(() => {
        if (!ActiveComponent) {
            const defaultDashboard = menuItems.find(item => item.id === 'dashboard');
            if (defaultDashboard) {
                setActiveSection('dashboard');
            }
        }
    }, [ActiveComponent, menuItems, setActiveSection]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <section className={clsx("bg-white h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out", sidebarCollapsed ? "w-16" : "w-64" )}>
                {/* Header del sidebar */}
                <header className={`p-4 border-b border-secondary-200 text-center relative`}>
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 p-1 hover:bg-secondary-200 rounded-md transition-colors duration-300"
                    >
                        {sidebarCollapsed ? (
                            <Menu className="w-5 h-5 text-secondary-600 mr-1" />
                        ) : (
                            <SidebarClose className="w-5 h-5 text-secondary-600" />
                        )}
                    </button>

                    {/* Logo */}
                    <div className={`flex items-center justify-center ${sidebarCollapsed ? 'mt-10' : ''}`}>
                        {logoLoading ? (
                            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            <img
                                src={logoUrl || '/src/assets/upnote.png'}
                                alt="Logo"
                                className="w-12 h-12 object-contain"
                            />
                        )}
                    </div>

                    {/* Título y información del usuario - solo visible cuando no está colapsado */}
                    <div className={clsx(
                        "transition-all duration-300 ease-in-out overflow-hidden",
                        sidebarCollapsed ? "opacity-0 max-h-0" : "opacity-100 max-h-20"
                    )}>
                        <h1 className="text-xl font-bold text-secondary-800 mt-2">Sistema de Notas</h1>
                        <p className="text-sm text-secondary-600">{user?.first_name} {user?.last_name}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleConfig.badgeColor}`}>
                            {roleConfig.label}
                        </span>
                    </div>
                </header>

                {/* Navegación */}
                <nav className="flex-1 p-2">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveSection(item.id)}
                                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-primary-50 hover:text-primary-700 
                                                    ${isActive ? 'bg-primary-100 text-primary-600 font-semibold' : ''}
                                                `}
                                        title={sidebarCollapsed ? item.label : ''}
                                    >
                                        <Icon className={`w-5 h-5 ${sidebarCollapsed ? 'min-w-5 min-h-6 m-auto' : ''}`} />
                                        {!sidebarCollapsed && (
                                            <span className='whitespace-nowrap'>
                                                {item.label}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer del sidebar */}
                <footer className="p-4 border-t border-secondary-200">
                    <button
                        onClick={handleLogout}
                        className={clsx(
                            "flex items-center w-full text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200",
                            sidebarCollapsed ? "justify-center px-2 py-3" : "px-4 py-2"
                        )}
                        title={sidebarCollapsed ? "Cerrar Sesión" : ""}
                    >
                        <LogOut className={clsx(
                            "w-5 h-5",
                            sidebarCollapsed ? "" : "mr-3"
                        )} />
                        <span className={clsx(
                            "transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                            sidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        )}>
                            Cerrar Sesión
                        </span>
                    </button>
                </footer>
            </section>

            {/* Main Content */}
            <main className=" flex-1 h-full overflow-y-auto">
                {ActiveComponent && <ActiveComponent />}
            </main>
        </div>
    );
};

export default DashboardPage;