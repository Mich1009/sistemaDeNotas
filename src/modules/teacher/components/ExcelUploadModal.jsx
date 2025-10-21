import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import useExcelGrades from '../hooks/useExcelGrades';

const ExcelUploadModal = ({ 
    isOpen, 
    onClose, 
    courseId, 
    onUploadSuccess 
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const { isUploading, uploadGradesFromExcel } = useExcelGrades();

    const handleFileSelect = (file) => {
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
        } else {
            alert('Por favor selecciona un archivo Excel (.xlsx o .xls)');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Por favor selecciona un archivo');
            return;
        }

        try {
            const result = await uploadGradesFromExcel(courseId, selectedFile);
            onUploadSuccess?.(result);
            handleClose();
        } catch (error) {
            console.error('Error en upload:', error);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        onClose();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Cargar Notas desde Excel
                            </h3>
                            <p className="text-sm text-gray-500">
                                Sube un archivo Excel con las calificaciones
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                    {/* Instrucciones */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                        <h4 className="font-medium text-blue-900 mb-2">📋 Instrucciones:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Descarga la plantilla Excel para ver el formato correcto</li>
                            <li>• Completa las columnas DNI, NOMBRE, APELLIDO y las notas</li>
                            <li>• Las notas deben estar en el rango de 0 a 20</li>
                            <li>• Guarda el archivo como .xlsx antes de subirlo</li>
                        </ul>
                    </div>

                    {/* Zona de carga */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                            dragActive 
                                ? 'border-blue-400 bg-blue-50' 
                                : selectedFile 
                                    ? 'border-green-400 bg-green-50' 
                                    : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {selectedFile ? (
                            <div className="space-y-1">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                                <div>
                                    <p className="font-medium text-green-900">{selectedFile.name}</p>
                                    <p className="text-sm text-green-700">{formatFileSize(selectedFile.size)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Cambiar archivo
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Upload className="w-7 h-7 text-gray-400 mx-auto" />
                                <div>
                                    <p className="text-md font-medium text-gray-900">
                                        Arrastra tu archivo Excel aquí
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        o haz clic para seleccionar
                                    </p>
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Seleccionar archivo
                                </button>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Información del formato */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <h4 className="font-medium text-gray-900 mb-1">📊 Formato esperado:</h4>
                        <div className="text-sm text-gray-700">
                            <p><strong>Columnas requeridas:</strong> DNI, NOMBRE, APELLIDO</p>
                            <p><strong>Columnas opcionales:</strong> EVALUACION1-8, PRACTICA1-4, PARCIAL1-2</p>
                            <p><strong>Ejemplo:</strong></p>
                            <div className="bg-white border rounded p-1 mt-1 font-mono text-xs">
                                DNI | NOMBRE | APELLIDO | EVALUACION1 | EVALUACION2 | PRACTICA1<br/>
                                12345678 | Juan | Pérez | 18 | 16 | 15
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isUploading && (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>{isUploading ? 'Procesando...' : 'Cargar Notas'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploadModal;
