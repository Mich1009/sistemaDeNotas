import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNavigationStore = create(
    persist(
        (set, get) => ({
            // Estado del menú activo
            activeSection: 'dashboard',

            // Estado del sidebar (colapsado o expandido)
            sidebarCollapsed: false,

            // Función para cambiar la sección activa
            setActiveSection: (sectionId) => {
                set({ activeSection: sectionId });
            },

            // Función para alternar el estado del sidebar
            toggleSidebar: () => {
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
            },

            // Función para colapsar el sidebar
            collapseSidebar: () => {
                set({ sidebarCollapsed: true });
            },

            // Función para expandir el sidebar
            expandSidebar: () => {
                set({ sidebarCollapsed: false });
            },

            // Función para navegar a una sección específica (para usar desde otros componentes)
            navigateToSection: (sectionId) => {
                set({ activeSection: sectionId });
            },

            // Función para obtener el estado actual
            getNavigationState: () => {
                const state = get();
                return {
                    activeSection: state.activeSection,
                    sidebarCollapsed: state.sidebarCollapsed
                };
            },

            // Función para resetear a valores por defecto
            resetNavigation: () => {
                set({
                    activeSection: 'dashboard',
                    sidebarCollapsed: false
                });
            }
        }),
        {
            name: 'navigation-storage', // nombre único para el localStorage
            partialize: (state) => ({
                activeSection: state.activeSection,
                sidebarCollapsed: state.sidebarCollapsed
            }), // solo persistir estos campos
        }
    )
);

export default useNavigationStore;