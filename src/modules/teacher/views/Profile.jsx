import React, { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    BookOpen, 
    Award, 
    Calendar,
    Save,
    X,
    Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../auth/store/authStore';
import { perfilService } from '../services/apiTeacher';

const Profile = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        especialidad: '',
        grado_academico: '',
        fecha_ingreso: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                especialidad: user.especialidad || '',
                grado_academico: user.grado_academico || '',
                fecha_ingreso: user.fecha_ingreso || '',
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar contraseñas si se están cambiando
        if (profileData.new_password) {
            if (profileData.new_password !== profileData.confirm_password) {
                toast.error('Las contraseñas no coinciden');
                return;
            }
            
            if (profileData.new_password.length < 6) {
                toast.error('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            if (!profileData.current_password) {
                toast.error('Debes ingresar tu contraseña actual');
                return;
            }
        }
        
        try {
            setLoading(true);
            
            // Preparar datos para actualizar
            const updateData = {
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                phone: profileData.phone,
                especialidad: profileData.especialidad,
                grado_academico: profileData.grado_academico
            };
            
            // Si hay cambio de contraseña, incluir esos datos
            if (profileData.new_password) {
                updateData.current_password = profileData.current_password;
                updateData.new_password = profileData.new_password;
            }
            
            // Llamar al servicio para actualizar perfil
            await perfilService.updateProfile(updateData);
            
            toast.success('Perfil actualizado correctamente');
            setIsEditing(false);
            
            // Actualizar datos del usuario en el store
            // Esto dependerá de cómo esté implementado tu sistema de autenticación
            
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            toast.error(error.message || 'Error al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                <User size={40} className="text-blue-500" />
                            </div>
                            <div className="ml-4 text-white">
                                <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h2>
                                <p className="opacity-90">Docente</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-50 transition-colors"
                            >
                                <Edit size={18} />
                                <span>Editar Perfil</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información personal */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Información Personal</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={profileData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={profileData.last_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                {/* Información académica */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Información Académica</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                                        <input
                                            type="text"
                                            name="especialidad"
                                            value={profileData.especialidad}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Grado Académico</label>
                                        <select
                                            name="grado_academico"
                                            value={profileData.grado_academico}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Seleccionar grado</option>
                                            <option value="Licenciado">Licenciado</option>
                                            <option value="Magister">Magister</option>
                                            <option value="Doctor">Doctor</option>
                                            <option value="PhD">PhD</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                                        <input
                                            type="date"
                                            name="fecha_ingreso"
                                            value={profileData.fecha_ingreso}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Cambio de contraseña */}
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={profileData.current_password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={profileData.new_password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={profileData.confirm_password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Botones */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                    disabled={loading}
                                >
                                    <X size={18} />
                                    <span>Cancelar</span>
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                                    disabled={loading}
                                >
                                    <Save size={18} />
                                    <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información personal */}
                            <div>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Información Personal</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <User className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Nombre completo</p>
                                            <p className="font-medium">{profileData.first_name} {profileData.last_name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{profileData.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Teléfono</p>
                                            <p className="font-medium">{profileData.phone || 'No especificado'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Información académica */}
                            <div>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Información Académica</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <BookOpen className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Especialidad</p>
                                            <p className="font-medium">{profileData.especialidad || 'No especificado'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Award className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Grado Académico</p>
                                            <p className="font-medium">{profileData.grado_academico || 'No especificado'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de Ingreso</p>
                                            <p className="font-medium">
                                                {profileData.fecha_ingreso 
                                                    ? new Date(profileData.fecha_ingreso).toLocaleDateString() 
                                                    : 'No especificado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;