import React, { useState, useEffect, useCallback } from 'react';
import { X, Users, UserCheck, UserX, Eye, Mail, User, TrendingUp, Download } from 'lucide-react';
import { reportesService } from '../services/apiAdmin';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const EstudiantesModal = ({ isOpen, onClose, cursoId, cursoNombre, cicloId, cicloNombre, tipo = 'curso' }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({});
    const [loading, setLoading] = useState(false);
    const [vistaActual, setVistaActual] = useState('aprobados'); // 'aprobados', 'desaprobados', 'todos'
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

    const cargarEstudiantes = useCallback(async () => {
        const entityId = tipo === 'curso' ? cursoId : cicloId;
        if (!entityId) return;

        setLoading(true);
        try {
            // Cargar estudiantes según el tipo (curso o ciclo)
            const response = tipo === 'curso' 
                ? await reportesService.getEstudiantesPorCurso(entityId, null)
                : await reportesService.getEstudiantesPorCiclo(entityId, null);
                
            if (response.success) {
                setEstudiantes(response.data.estudiantes);
                setEstadisticas(response.data.estadisticas);
            }
        } catch (error) {
            toast.error(`Error al cargar estudiantes del ${tipo}`);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [cursoId, cicloId, tipo]);

    // Efecto para cargar datos cuando se abre el modal
    useEffect(() => {
        const entityId = tipo === 'curso' ? cursoId : cicloId;
        if (isOpen && entityId) {
            cargarEstudiantes();
        }
    }, [isOpen, cursoId, cicloId, tipo, cargarEstudiantes]);

    const exportarAExcel = () => {
        if (estudiantes.length === 0) {
            toast.error('No hay estudiantes para exportar');
            return;
        }

        try {
            // Separar estudiantes aprobados y desaprobados
            const aprobados = estudiantes.filter(est => est.estado === 'aprobado');
            const desaprobados = estudiantes.filter(est => est.estado === 'desaprobado');

            // Crear datos para Excel con aprobados primero, luego desaprobados
            const datosExcel = [];

            // Definir columnas según el tipo
            const columnas = tipo === 'curso' 
                ? ['Nombre Completo', 'DNI', 'Email', 'Estado', 'Promedio Final', 'Evaluaciones', 'Prácticas', 'Parciales']
                : ['Nombre Completo', 'DNI', 'Email', 'Estado', 'Promedio Ponderado'];

            // Agregar encabezado de aprobados
            if (aprobados.length > 0) {
                const headerRow = {};
                columnas.forEach(col => headerRow[col] = col === 'Nombre Completo' ? '=== ESTUDIANTES APROBADOS ===' : '');
                datosExcel.push(headerRow);

                // Agregar estudiantes aprobados
                aprobados.forEach(estudiante => {
                    const row = {
                        'Nombre Completo': estudiante.nombre_completo,
                        'DNI': estudiante.dni,
                        'Email': estudiante.email,
                        'Estado': estudiante.estado.toUpperCase(),
                    };

                    if (tipo === 'curso') {
                        row['Promedio Final'] = estudiante.promedio_final.toFixed(2);
                        row['Evaluaciones'] = estudiante.notas_detalle?.evaluaciones?.join(', ') || '';
                        row['Prácticas'] = estudiante.notas_detalle?.practicas?.join(', ') || '';
                        row['Parciales'] = estudiante.notas_detalle?.parciales?.join(', ') || '';
                    } else {
                        row['Promedio Ponderado'] = estudiante.promedio_ponderado.toFixed(2);
                    }

                    datosExcel.push(row);
                });

                // Agregar fila vacía
                const emptyRow = {};
                columnas.forEach(col => emptyRow[col] = '');
                datosExcel.push(emptyRow);
            }

            // Agregar encabezado de desaprobados
            if (desaprobados.length > 0) {
                const headerRow = {};
                columnas.forEach(col => headerRow[col] = col === 'Nombre Completo' ? '=== ESTUDIANTES DESAPROBADOS ===' : '');
                datosExcel.push(headerRow);

                // Agregar estudiantes desaprobados
                desaprobados.forEach(estudiante => {
                    const row = {
                        'Nombre Completo': estudiante.nombre_completo,
                        'DNI': estudiante.dni,
                        'Email': estudiante.email,
                        'Estado': estudiante.estado.toUpperCase(),
                    };

                    if (tipo === 'curso') {
                        row['Promedio Final'] = estudiante.promedio_final.toFixed(2);
                        row['Evaluaciones'] = estudiante.notas_detalle?.evaluaciones?.join(', ') || '';
                        row['Prácticas'] = estudiante.notas_detalle?.practicas?.join(', ') || '';
                        row['Parciales'] = estudiante.notas_detalle?.parciales?.join(', ') || '';
                    } else {
                        row['Promedio Ponderado'] = estudiante.promedio_ponderado.toFixed(2);
                    }

                    datosExcel.push(row);
                });
            }

            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(datosExcel);

            // Ajustar ancho de columnas según el tipo
            const colWidths = tipo === 'curso' 
                ? [
                    { wch: 25 }, // Nombre Completo
                    { wch: 12 }, // DNI
                    { wch: 25 }, // Email
                    { wch: 12 }, // Estado
                    { wch: 15 }, // Promedio Final
                    { wch: 20 }, // Evaluaciones
                    { wch: 20 }, // Prácticas
                    { wch: 20 }  // Parciales
                ]
                : [
                    { wch: 25 }, // Nombre Completo
                    { wch: 12 }, // DNI
                    { wch: 25 }, // Email
                    { wch: 12 }, // Estado
                    { wch: 18 }  // Promedio Ponderado
                ];
            ws['!cols'] = colWidths;

            // Agregar hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');

            // Generar nombre del archivo
            const fechaActual = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
            const entityName = tipo === 'curso' ? cursoNombre : cicloNombre;
            const nombreArchivo = `Estudiantes_${entityName.replace(/[^a-zA-Z0-9]/g, '_')}_${fechaActual}.xlsx`;

            // Descargar archivo
            XLSX.writeFile(wb, nombreArchivo);

            toast.success(`Archivo ${nombreArchivo} descargado exitosamente`);
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            toast.error('Error al exportar el archivo Excel');
        }
    };
    const handleClose = () => {
        setEstudiantes([]);
        setEstadisticas({});
        setEstudianteSeleccionado(null);
        setVistaActual('aprobados');
        onClose();
    };

    const getEstadoColor = (estado) => {
        return estado === 'aprobado' ? 'text-green-600' : 'text-red-600';
    };

    const getEstadoBadge = (estado) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (estado === 'aprobado') {
            return `${baseClasses} bg-green-100 text-green-800`;
        }
        return `${baseClasses} bg-red-100 text-red-800`;
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] h-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                {tipo === 'curso' ? 'Estudiantes del Curso' : 'Estudiantes del Ciclo'}
                            </h2>
                            <p className="text-blue-100 mt-1">{tipo === 'curso' ? cursoNombre : cicloNombre}</p>
                        </div>
                        <div className="flex items-center mr-4">
                            <button
                                onClick={handleClose}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium">Total</span>
                            <p className="text-2xl font-bold">{estadisticas.total || 0}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            <span className="text-sm font-medium">Aprobados</span>
                            <p className="text-2xl font-bold">{estadisticas.aprobados || 0}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center gap-2">
                            <UserX className="w-5 h-5" />
                            <span className="text-sm font-medium">Desaprobados</span>
                            <p className="text-2xl font-bold">{estadisticas.desaprobados || 0}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-medium">% Aprobación</span>
                            <p className="text-2xl font-bold">{estadisticas.porcentaje_aprobacion || 0}%</p>
                        </div>
                    </div>
                </div>

                {/* Filtros de vista */}
                <div className="border-b bg-gray-50 p-3 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setVistaActual('aprobados')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${vistaActual === 'aprobados'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <UserCheck className="w-4 h-4 inline mr-2" />
                            Aprobados ({estadisticas.aprobados || 0})
                        </button>
                        <button
                            onClick={() => setVistaActual('desaprobados')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${vistaActual === 'desaprobados'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <UserX className="w-4 h-4 inline mr-2" />
                            Desaprobados ({estadisticas.desaprobados || 0})
                        </button>
                        <button
                            onClick={() => setVistaActual('todos')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${vistaActual === 'todos'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Todos ({estadisticas.total || 0})
                        </button>
                    </div>
                    <button
                        onClick={exportarAExcel}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        disabled={loading || estudiantes.length === 0}
                    >
                        <Download className="w-4 h-4" />
                        Exportar Excel
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Cargando estudiantes...</span>
                        </div>
                    ) : estudiantes.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No hay estudiantes en esta categoría</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                            {estudiantes
                                .filter(estudiante => {
                                    if (vistaActual === 'aprobados') return estudiante.estado === 'aprobado';
                                    if (vistaActual === 'desaprobados') return estudiante.estado === 'desaprobado';
                                    return true; // Para 'todos'
                                })
                                .map((estudiante) => (
                                    <div
                                        key={estudiante.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {estudiante.nombre_completo}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{estudiante.dni}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate">{estudiante.email}</span>
                                                </div>
                                            </div>
                                            <span className={getEstadoBadge(estudiante.estado)}>
                                                {estudiante.estado === 'aprobado' ? 'Aprobado' : 'Desaprobado'}
                                            </span>
                                        </div>

                                        <div className="border-t pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {tipo === 'curso' ? 'Promedio Final:' : 'Promedio Ponderado:'}
                                                </span>
                                                <span className={`font-bold ${getEstadoColor(estudiante.estado)}`}>
                                                    {tipo === 'curso' 
                                                        ? estudiante.promedio_final?.toFixed(2) 
                                                        : estudiante.promedio_ponderado?.toFixed(2)
                                                    }
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setEstudianteSeleccionado(estudiante)}
                                                className="w-full mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Eye className="w-3 h-3" />
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Modal de detalles del estudiante */}
                {estudianteSeleccionado && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="bg-gray-50 p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">
                                        Detalles de {estudianteSeleccionado.nombre_completo}
                                    </h3>
                                    <button
                                        onClick={() => setEstudianteSeleccionado(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {tipo === 'curso' ? (
                                    // Vista detallada para cursos
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Evaluaciones */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Evaluaciones (10%)</h4>
                                            <div className="space-y-2">
                                                {estudianteSeleccionado.notas_detalle?.evaluaciones?.map((nota, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span>Eval {index + 1}:</span>
                                                        <span className="font-medium">{nota}</span>
                                                    </div>
                                                )) || <span className="text-gray-500 text-sm">No hay evaluaciones</span>}
                                            </div>
                                        </div>

                                        {/* Prácticas */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Prácticas (30%)</h4>
                                            <div className="space-y-2">
                                                {estudianteSeleccionado.notas_detalle?.practicas?.map((nota, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span>Práctica {index + 1}:</span>
                                                        <span className="font-medium">{nota}</span>
                                                    </div>
                                                )) || <span className="text-gray-500 text-sm">No hay prácticas</span>}
                                            </div>
                                        </div>

                                        {/* Parciales */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Parciales (60%)</h4>
                                            <div className="space-y-2">
                                                {estudianteSeleccionado.notas_detalle?.parciales?.map((nota, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span>Parcial {index + 1}:</span>
                                                        <span className="font-medium">{nota}</span>
                                                    </div>
                                                )) || <span className="text-gray-500 text-sm">No hay parciales</span>}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Vista simplificada para ciclos
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Información del Ciclo</h4>
                                            <p className="text-sm text-gray-600">
                                                Este promedio representa el promedio ponderado de todos los cursos del ciclo.
                                            </p>
                                        </div>
                                        
                                        {estudianteSeleccionado.cursos_detalle && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">Cursos del Ciclo</h4>
                                                <div className="space-y-2">
                                                    {estudianteSeleccionado.cursos_detalle.map((curso, index) => (
                                                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                            <span className="text-sm">{curso.nombre}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium">{curso.promedio.toFixed(2)}</span>
                                                                <span className="text-xs text-gray-500">({curso.creditos} créditos)</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold">
                                            {tipo === 'curso' ? 'Promedio Final:' : 'Promedio Ponderado:'}
                                        </span>
                                        <span className={`text-xl font-bold ${getEstadoColor(estudianteSeleccionado.estado)}`}>
                                            {tipo === 'curso' 
                                                ? estudianteSeleccionado.promedio_final?.toFixed(2) 
                                                : estudianteSeleccionado.promedio_ponderado?.toFixed(2)
                                            }
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <span className={getEstadoBadge(estudianteSeleccionado.estado)}>
                                            {estudianteSeleccionado.estado === 'aprobado' ? 'APROBADO' : 'DESAPROBADO'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EstudiantesModal;