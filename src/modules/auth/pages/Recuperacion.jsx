import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Key, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authService } from '../services/apiAuth';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setLoading, isLoading } = useAuthStore();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null: loading, true: valid, false: invalid
  const [verificationToken, setVerificationToken] = useState('');

  const identificatorToken = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Verificar el token cuando el componente se monta
  useEffect(() => {
    const verifyToken = async () => {
      if (!identificatorToken) {
        setTokenValid(false);
        return;
      }

      try {
        setLoading(true);
        const response = await authService.verifyResetToken( identificatorToken);
        console.log('✅ [COMPONENT] Respuesta:', response);
        
        if (response.valid) {
          setTokenValid(true);
          setVerificationToken(response.verification_token);
        } else {
          setTokenValid(false);
          toast.error('Enlace inválido o expirado');
        }
      } catch (error) {
        console.error('Error verificando token:', error);
        setTokenValid(false);
        toast.error('Error al verificar el enlace');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [identificatorToken, setLoading]);

  const onSubmit = async (data) => {
    if (!verificationToken) {
      toast.error('Token de verificación no disponible');
      return;
    }

    try {
      setLoading(true);
      // Usar el verification_token para cambiar la contraseña
      await authService.confirmPasswordReset(verificationToken, data.newPassword);
      
      setResetSuccess(true);
      toast.success('¡Contraseña actualizada exitosamente!');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Error restableciendo contraseña:', error);
      toast.error('Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Estados de carga y verificación
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="card p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-secondary-800 mb-4">
              Verificando Enlace
            </h2>
            <p className="text-secondary-600">
              Validando tu enlace de recuperación...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="card p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-800 mb-4">
              Enlace Inválido
            </h2>
            <p className="text-secondary-600 mb-6">
              Este enlace de recuperación es inválido, ha expirado o ya fue utilizado.
              Por favor, solicita un nuevo enlace desde la página de login.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="card p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary-800 mb-4">
              ¡Contraseña Restablecida!
            </h2>
            <p className="text-secondary-600 mb-6">
              Tu contraseña ha sido actualizada exitosamente. Serás redirigido al login en unos segundos.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary"
            >
              Ir al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-secondary-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Formulario */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register('newPassword', {
                  required: 'La contraseña es obligatoria',
                  minLength: {
                    value: 6,
                    message: 'Mínimo 6 caracteres',
                  },
                })}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: value =>
                    value === watch('newPassword') || 'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 btn-secondary flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
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
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;