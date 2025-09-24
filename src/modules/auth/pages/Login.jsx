import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authService } from '../services/apiAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, setLoading, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const response = await authService.login(data.dni, data.password);
      
      // Guardar datos en el store
      login(response.user, response.access_token);
      
      toast.success(`¡Bienvenido, ${response.user.first_name}!`);
      
      // Redirigir según el rol
      const roleRoutes = {
        admin: '/admin/dashboard',
        docente: '/docente/dashboard',
        estudiante: '/estudiante/dashboard',
      };
      
      navigate(roleRoutes[response.user.role] || '/dashboard');
      
    } catch (error) {
      console.error('Error en login:', error);
      // El error ya se maneja en el interceptor de axios
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            Sistema de Notas
          </h1>
          <p className="text-secondary-600">
            Ingresa con tu DNI y contraseña
          </p>
        </div>

        {/* Formulario de login */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo DNI */}
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-secondary-700 mb-2">
                DNI
              </label>
              <input
                id="dni"
                type="text"
                placeholder="12345678"
                className="input-field"
                {...register('dni', {
                  required: 'El DNI es obligatorio',
                  pattern: {
                    value: /^\d{8}$/,
                    message: 'El DNI debe tener exactamente 8 dígitos',
                  },
                })}
              />
              {errors.dni && (
                <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => {
                toast.info('Contacta al administrador para recuperar tu contraseña');
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Información de prueba */}
        <div className="mt-6 p-4 bg-secondary-100 rounded-lg">
          <h3 className="text-sm font-medium text-secondary-800 mb-2">
            Usuarios de prueba:
          </h3>
          <div className="text-xs text-secondary-600 space-y-1">
            <p><strong>Admin:</strong> DNI: 12345678, Contraseña: admin123</p>
            <p><strong>Docente:</strong> DNI: 87654321, Contraseña: docente123</p>
            <p><strong>Estudiante:</strong> DNI: 11223344, Contraseña: estudiante123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;