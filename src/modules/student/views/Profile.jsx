import React from 'react';
import { User, Calendar, Shield, Save, X, Eye, EyeOff, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import useStudentProfile from '../hooks/useStudentProfile';
import ProfileData from '../components/ProfileData';
import AcademicPerformance from '../components/AcademicPerformance';

const Profile = () => {

    const {
        profile,
        loading,
        editing,
        setEditing,
        changingPassword,
        setChangingPassword,
        showCurrentPassword,
        setShowCurrentPassword,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        formData,
        handleInputChange,
        passwordData,
        handlePasswordChange,
        handleSaveProfile,
        handleChangePassword,
        cancelEdit,
        cancelPasswordChange,
        getRoleDisplayName,
        getRoleColor
    } = useStudentProfile();

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Mi Perfil</h1>
                        <p className="text-secondary-600 mt-2">Gestiona tu información personal</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="card p-8 animate-pulse">
                            <div className="h-6 bg-secondary-200 rounded w-1/3 mb-6"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-4 bg-secondary-200 rounded w-full"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card p-8 animate-pulse">
                        <div className="h-6 bg-secondary-200 rounded w-1/2 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-4 bg-secondary-200 rounded w-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Mi Perfil</h1>
                    <p className="text-secondary-600">Gestiona tu información personal</p>
                </div>
                <div className="flex items-center space-x-2">
                    <User className="w-8 h-8 text-primary-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    {/* Información del perfil */}
                    <ProfileData
                        editing={editing}
                        setEditing={setEditing}
                        handleSaveProfile={handleSaveProfile}
                        profile={profile}
                        cancelEdit={cancelEdit}
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />

                    {/* Rendimiento Académico */}
                    <AcademicPerformance />

                </div>

                {/* Información de la cuenta */}
                <div className="space-y-4">
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Información de la Cuenta</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">DNI</label>
                                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                                    <Shield className="w-4 h-4 text-secondary-500 mr-3" />
                                    <span className="text-secondary-900">{profile.dni}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Rol</label>
                                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                                        {getRoleDisplayName(profile.role)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Estado</label>
                                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                                    {profile.is_active ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                                            <span className="text-green-700 font-medium">Activo</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-4 h-4 text-red-500 mr-3" />
                                            <span className="text-red-700 font-medium">Inactivo</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Fecha de Registro</label>
                                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                                    <Calendar className="w-4 h-4 text-secondary-500 mr-3" />
                                    <span className="text-secondary-900">
                                        {new Date(profile.created_at).toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cambio de contraseña */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-secondary-900">
                                Seguridad
                            </h3>
                            {!changingPassword ? (
                                <button
                                    onClick={() => setChangingPassword(true)}
                                    className="flex items-center px-3 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm"
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Cambiar
                                </button>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleChangePassword}
                                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar
                                    </button>
                                    <button
                                        onClick={cancelPasswordChange}
                                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>

                        {changingPassword ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Contraseña Actual
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Ingresa tu contraseña actual"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="new_password"
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Ingresa tu nueva contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirm_password"
                                            value={passwordData.confirm_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Confirma tu nueva contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <Lock className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                                <p className="text-sm text-secondary-600">
                                    Tu contraseña está protegida
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;