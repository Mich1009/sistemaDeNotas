import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Acciones
      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Limpiar localStorage
        localStorage.removeItem('auth-storage');
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      isAdmin: () => get().user?.role === 'admin',
      isDocente: () => get().user?.role === 'docente',
      isEstudiante: () => get().user?.role === 'estudiante',
      
      // Verificar si el usuario tiene un rol específico
      hasRole: (role) => get().user?.role === role,
      
      // Verificar si el usuario tiene alguno de los roles especificados
      hasAnyRole: (roles) => {
        const userRole = get().user?.role;
        return roles.includes(userRole);
      },
    }),
    {
      name: 'auth-storage', // nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;