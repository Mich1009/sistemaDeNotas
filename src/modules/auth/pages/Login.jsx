import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, GraduationCap, X, Mail, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authService } from '../services/apiAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, setLoading, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Email, 2: Token, 3: Nueva contraseña
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetLoginForm,
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
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryRequest = async (data) => {
    try {
      setLoading(true);
      const result = await authService.requestPasswordReset(data.email);
      
      setRecoveryEmail(data.email);
      setRecoveryStep(2);
      recoveryForm.reset();
      
      toast.success('Se ha enviado un código de recuperación a tu email');
      console.log('🔐 Revisa la consola del backend para obtener el token de prueba');
      
    } catch (error) {
      console.error('Error solicitando recuperación:', error);
      toast.error('Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenVerification = async (data) => {
    try {
      setLoading(true);
      
      const result = await authService.verifyResetToken(data.token);
      
      if (result.valid) {
        setRecoveryToken(data.token);
        setRecoveryStep(3);
        recoveryForm.reset();
        toast.success('Token verificado, ahora ingresa tu nueva contraseña');
      } else {
        toast.error(result.message || 'Token inválido o expirado');
      }
      
    } catch (error) {
      console.error('Error verificando token:', error);
      toast.error('Error al verificar el token');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (data) => {
    try {
      setLoading(true);
      await authService.confirmPasswordReset(recoveryToken, data.newPassword);
      
      toast.success('¡Contraseña actualizada exitosamente!');
      setShowRecoveryModal(false);
      resetRecoveryModal();
      
      // Limpiar formulario de login
      resetLoginForm();
      
    } catch (error) {
      console.error('Error confirmando recuperación:', error);
      toast.error('Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const resetRecoveryModal = () => {
    setRecoveryStep(1);
    setRecoveryEmail('');
    setRecoveryToken('');
    recoveryForm.reset();
  };

  const closeRecoveryModal = () => {
    setShowRecoveryModal(false);
    setTimeout(resetRecoveryModal, 300);
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
              onClick={() => setShowRecoveryModal(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Modal de recuperación de contraseña */}
        {showRecoveryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Key className="w-6 h-6 text-primary-600 mr-2" />
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

              {/* Progreso */}
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        recoveryStep >= step
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-200 text-secondary-600'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          recoveryStep > step ? 'bg-primary-600' : 'bg-secondary-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Paso 1: Email */}
              {recoveryStep === 1 && (
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
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Código
                  </button>
                </form>
              )}

              {/* Paso 2: Token */}
              {recoveryStep === 2 && (
                <form onSubmit={recoveryForm.handleSubmit(handleTokenVerification)} className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-600 mb-4">
                      Se ha enviado un código a: <strong>{recoveryEmail}</strong>
                    </p>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Código de verificación
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa el código recibido"
                      className="input-field"
                      {...recoveryForm.register('token', {
                        required: 'El código es obligatorio',
                      })}
                    />
                    {recoveryForm.formState.errors.token && (
                      <p className="mt-1 text-sm text-red-600">
                        {recoveryForm.formState.errors.token.message}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep(1)}
                      className="flex-1 btn-secondary"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Verificar
                    </button>
                  </div>
                </form>
              )}

              {/* Paso 3: Nueva contraseña */}
              {recoveryStep === 3 && (
                <form onSubmit={recoveryForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input-field"
                      {...recoveryForm.register('newPassword', {
                        required: 'La contraseña es obligatoria',
                        minLength: {
                          value: 6,
                          message: 'Mínimo 6 caracteres',
                        },
                      })}
                    />
                    {recoveryForm.formState.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {recoveryForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input-field"
                      {...recoveryForm.register('confirmPassword', {
                        required: 'Confirma tu contraseña',
                        validate: value =>
                          value === recoveryForm.watch('newPassword') || 'Las contraseñas no coinciden',
                      })}
                    />
                    {recoveryForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {recoveryForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep(2)}
                      className="flex-1 btn-secondary"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 btn-primary flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Cambiar Contraseña'
                      )}
                    </button>
                  </div>
                </form>
              )}
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
      </div>
    </div>
  );
};

export default Login;