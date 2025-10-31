import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, GraduationCap, Mail, X } from 'lucide-react
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authService } from '../services/apiAuth';
import Footer from '../../../shared/components/Footer.jsx';
import upnoteLogo from '../../../assets/upnote.png';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, setLoading, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const recoveryForm = useForm();

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
      
      toast.success(`Bienvenido, ${response.user.first_name}!`);
      
      // Redirigir seg�n el rol
      const roleRoutes = {
        admin: '/admin/dashboard',
        docente: '/docente/dashboard',
        estudiante: '/estudiante/dashboard',
      };
      
      navigate(roleRoutes[response.user.role] || '/dashboard');
      
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryRequest = async (data) => {
    try {
      setLoading(true);
      await authService.requestPasswordReset(data.email);
      
      toast.success('Se ha enviado un enlace de recuperación a tu email. Por favor revisa tu correo.');
      setShowRecoveryModal(false);
      recoveryForm.reset();
      
    } catch (error) {
      console.error('Error solicitando recuperación:', error);
      toast.error('Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  const closeRecoveryModal = () => {
    setShowRecoveryModal(false);
    recoveryForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y t�tulo */}
        <div className="text-center mb-8">
          <img
            src={upnoteLogo}
            alt="UPNote"
            className="mx-auto w-16 h-16 rounded-full mb-4 ring-2 ring-primary-600 object-cover"
          />
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
                    message: 'El DNI debe tener exactamente 8 d�gitos',
                  },
                })}
              />
              {errors.dni && (
                <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
              )}
            </div>

            {/* Campo Contrase�a */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=""
                  className="input-field pr-10"
                  {...register('password', {
                    required: 'La contrase�a es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contrase�a debe tener al menos 6 caracteres',
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

            {/* Boton de login */}
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
              onClick={() => setShowRecoveryModal(true)}
            >
              Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Modal de recuperación de contraseña - Solo paso 1 (email) */}
        {showRecoveryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-primary-600 mr-2" />
                  <h2 className="text-xl font-bold text-secondary-800">
                    Recuperar Contraseña
                  </h2>
                </div>
                <button
                  onClick={closeRecoveryModal}
                  className="text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="space-y-4">
                <p className="text-sm text-secondary-600">
                  Ingresa tu email registrado y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                
                <form onSubmit={recoveryForm.handleSubmit(handleRecoveryRequest)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email registrado
                    </label>
                    <input
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      className="input-field"
                      {...recoveryForm.register('email', {
                        required: 'El email es obligatorio',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Email inválido',
                        },
                      })}
                    />
                    {recoveryForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {recoveryForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={closeRecoveryModal}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 btn-primary flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar Enlace
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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

        <Footer />
      </div>
    </div>
  );
};

export default Login;
