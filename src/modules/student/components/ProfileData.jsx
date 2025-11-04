import React from 'react'
import { User, Mail, Phone, Calendar, Shield, Edit3, Save, X, Eye, EyeOff, CheckCircle, AlertCircle, Lock } from 'lucide-react';

const ProfileData = ({ editing, setEditing, profile, cancelEdit, formData, handleInputChange, handleSaveProfile }) => {

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-secondary-900">Información Personal</h2>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                    </button>
                ) : (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleSaveProfile}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Nombres
                    </label>
                    {editing ? (
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="Ingresa tus nombres"
                        />
                    ) : (
                        <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                            <User className="w-4 h-4 text-secondary-500 mr-3" />
                            <span className="text-secondary-900">
                                {profile.first_name || 'No especificado'}
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Apellidos
                    </label>
                    {editing ? (
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="Ingresa tus apellidos"
                        />
                    ) : (
                        <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                            <User className="w-4 h-4 text-secondary-500 mr-3" />
                            <span className="text-secondary-900">
                                {profile.last_name || 'No especificado'}
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email
                    </label>
                    {editing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="Ingresa tu email"
                        />
                    ) : (
                        <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                            <Mail className="w-4 h-4 text-secondary-500 mr-3" />
                            <span className="text-secondary-900">
                                {profile.email || 'No especificado'}
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Teléfono
                    </label>
                    {editing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="Ingresa tu teléfono"
                        />
                    ) : (
                        <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                            <Phone className="w-4 h-4 text-secondary-500 mr-3" />
                            <span className="text-secondary-900">
                                {profile.phone || 'No especificado'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileData