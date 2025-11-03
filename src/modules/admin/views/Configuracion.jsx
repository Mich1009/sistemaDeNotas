import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { RefreshCw, Upload, Settings, Image, Save } from 'lucide-react';
import { configService } from '../../auth/services/configService';
import upnoteLogo from '../../../assets/upnote.png';

const Configuracion = () => {
    const [logoUrl, setLogoUrl] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('Logo de inicio de sesión');

    useEffect(() => {
        fetchLogoConfig();
    }, []);

    const fetchLogoConfig = async () => {
        try {
            setLoading(true);
            const logoConfig = await configService.getLogoConfig();
            if (logoConfig && logoConfig.value) {
                // Asegurarse de que la URL sea absoluta
                const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                // Eliminar /api/v1 de la URL base si existe
                const baseUrl = backendUrl.replace(/\/api\/v1$/, '');
                const logoValue = logoConfig.value.startsWith('http') 
                    ? logoConfig.value 
                    : `${baseUrl}${logoConfig.value}`;
                
                setLogoUrl(logoConfig.value);
                setLogoPreview(logoValue);
                
                if (logoConfig.description) {
                    setDescription(logoConfig.description);
                }
                
                console.log('Logo cargado:', logoValue);
            }
        } catch (error) {
            console.error('Error al cargar la configuración del logo:', error);
            toast.error('No se pudo cargar la configuración del logo');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Validar el tipo de archivo
                if (!file.type.startsWith('image/')) {
                    toast.error('Por favor seleccione un archivo de imagen válido');
                    return;
                }

                // Validar el tamaño del archivo (máximo 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    toast.error('El archivo es demasiado grande. El tamaño máximo es 2MB');
                    return;
                }

                setLogoFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error al procesar el archivo:', error);
                toast.error('Error al procesar el archivo');
            }
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            let logoData = {
                description: description
            };

            if (logoFile) {
                const reader = new FileReader();
                const base64Promise = new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(logoFile);
                });

                const base64Data = await base64Promise;
                logoData.value = base64Data;
            } else if (logoUrl) {
                logoData.value = logoUrl;
            }

            await configService.updateLogoConfig(logoData);
            toast.success('Logo actualizado correctamente');
            
            // Recargar la configuración
            await fetchLogoConfig();
        } catch (error) {
            console.error('Error al guardar el logo:', error);
            toast.error('Error al guardar el logo');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!logoFile && !logoUrl) {
            toast.error('Por favor selecciona un logo');
            return;
        }

        try {
            setLoading(true);
            
            let logoValue = logoUrl;
            
            // Si hay un nuevo archivo, convertirlo a base64
            if (logoFile) {
                const reader = new FileReader();
                logoValue = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(logoFile);
                });
            }
            
            await configService.updateLogoConfig({
                value: logoValue,
                description: description
            });
            
            setLogoUrl(logoValue);
            setLogoFile(null);
            
            toast.success('Logo actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el logo:', error);
            toast.error('No se pudo actualizar el logo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center mb-6">
                    <Settings size={32} className="text-gray-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">
                        Configuración del Sistema
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sección de configuración del logo */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Image className="w-5 h-5 mr-2" />
                            Configuración del Logo
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Logo actual
                                </label>
                                <div className="flex justify-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-32">
                                            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                                        </div>
                                    ) : logoPreview ? (
                                        <img 
                                            src={logoPreview} 
                                            alt="Logo de inicio de sesión" 
                                            className="max-h-32 object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Subir nuevo logo
                                </label>
                                <div className="flex items-center justify-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                                    <label className="cursor-pointer flex flex-col items-center space-y-2">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-sm text-gray-500">Haz clic para seleccionar un archivo</span>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={loading}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Formatos recomendados: PNG, JPG, SVG. Tamaño máximo: 2MB.
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Descripción del logo"
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={fetchLogoConfig}
                                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Espacio para futuras configuraciones */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Otras Configuraciones
                        </h3>
                        <p className="text-gray-600">
                            Aquí podrás configurar otros parámetros del sistema, ajustar configuraciones generales, 
                            gestionar permisos globales, configurar notificaciones y personalizar el comportamiento del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;