import React from 'react';
import { BarChart3, TrendingUp, BookOpen, } from 'lucide-react';
import ReactFlow, { Handle, Position } from 'reactflow';
import { MdOutlineViewInAr } from "react-icons/md";

// Componentes de nodos personalizados
export const CarreraNodo = ({ data }) => {
    return (
        <aside className="px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-300 min-w-[200px] relative">
            <Handle
                type="source"
                position={Position.Right}
                id="carrera-source"
                style={{
                    background: '#ffffff',
                    border: '2px solid #3b82f6',
                    width: 12,
                    height: 12,
                }}
            />
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-bold text-lg">{data.nombre}</div>
                    <div className="text-sm opacity-90">Código: {data.codigo}</div>
                    <div className="text-xs opacity-80">{data.estudiantes_count} estudiantes</div>
                </div>
                <BarChart3 className="w-6 h-6" />
            </div>
        </aside>
    );
};

export const CicloNodo = ({ data }) => {
    const getColorByPromedio = (promedio) => {
        if (promedio >= 16) return 'from-green-500 to-green-600 border-green-300';
        if (promedio >= 13) return 'from-green-500 to-green-600 border-green-300';
        return 'from-red-500 to-red-600 border-red-300';
    };

    return (
        <aside className={`px-3 py-2 shadow-md rounded-lg bg-gradient-to-r ${getColorByPromedio(data.promedio)} text-white border-2 min-w-[180px] relative`}>
            <Handle
                type="target"
                position={Position.Left}
                id="ciclo-target"
                style={{
                    background: '#ffffff',
                    border: '2px solid #10b981',
                    width: 12,
                    height: 12,
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="ciclo-source"
                style={{
                    background: '#ffffff',
                    border: '2px solid #10b981',
                    width: 12,
                    height: 12,
                }}
            />
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-semibold">{data.nombre}</div>
                    <div className="text-sm opacity-90">Año: {data.año} | Ciclo: {data.numero}</div>
                    <div className="text-xs opacity-80">
                        {data.estudiantes_count} estudiantes | Promedio: {data.promedio}
                    </div>
                    <div className="text-xs opacity-80">
                        <span className="text-white">{data.aprobados || 0} Aprobados</span> | <span className="text-red-500">{data.desaprobados || 0} Desaprobados</span>
                    </div>
                </div>
            </div>
            <TrendingUp className="w-5 h-5 absolute top-1 right-1 bg-white text-blue-500 p-1 rounded-md" />
        </aside>
    );
};
export const CursoNodo = ({ data, onVerEstudiantes }) => {
    const handleVerEstudiantes = (e) => {
        e.stopPropagation();
        console.log('🎯 CursoNodo - handleVerEstudiantes ejecutado:', { data, onVerEstudiantes });
        if (onVerEstudiantes) {
            console.log('✅ Ejecutando onVerEstudiantes con:', data.id, data.nombre);
            onVerEstudiantes(data.id, data.nombre);
        } else {
            console.log('❌ onVerEstudiantes no está definido');
        }
    };

    return (
        <aside className="group px-3 py-2 shadow-sm rounded-md bg-white border-2 border-gray-200 hover:border-gray-300 min-w-[160px] relative transition-all duration-200">
            {/* Handle de conexión */}
            <Handle
                type="target"
                position={Position.Left}
                id="curso-target"
                style={{
                    background: '#ffffff',
                    border: '2px solid #6b7280',
                    width: 12,
                    height: 12,
                }}
            />

            {/* Contenido */}
            <div className="text-sm font-semibold text-gray-800 flex items-center">
                <BookOpen className="w-4 h-4 mr-1" /> {data.nombre}
            </div>
            <div className="text-xs text-gray-600">Docente: {data.docente}</div>
            <div className="text-xs text-gray-500">
                {data.estudiantes_count} estudiantes | Promedio: {data.promedio}
            </div>
            <div className="text-xs text-gray-500">
                <span className="text-green-600">{data.aprobados || 0} Aprobados</span> |{" "}
                <span className="text-red-600">{data.desaprobados || 0} Desaprobados</span>
            </div>

            {/* Botón oculto que aparece al pasar el mouse */}
            <button
                onClick={handleVerEstudiantes}
                className="
                    absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-sm
                    transition-opacity duration-300
                    hover:bg-blue-600
                "
                title="Ver estudiantes"
            >
                <MdOutlineViewInAr className="w-4 h-4" />
            </button>
        </aside>
    );
};

// componente de vista de estudiante

