import React from 'react';
import { BarChart3, TrendingUp, BookOpen, } from 'lucide-react';
import ReactFlow, { Handle, Position, Panel } from 'reactflow';
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

export const CicloNodo = ({ data, onVerEstudiantes }) => {
    
    const getColorByPromedio = (promedio) => {
        if (promedio >= 16) return 'from-green-500 to-green-600 border-green-300';
        if (promedio >= 13) return 'from-green-500 to-green-600 border-green-300';
        return 'from-red-500 to-red-600 border-red-300';
    };

    const handleVerEstudiantes = (e) => {
        e.stopPropagation();

        // No hacer nada si hay cursos pendientes
        if (data.cursos_pendientes) {
            return;
        }

        if (onVerEstudiantes) {
            onVerEstudiantes(data.id, data.nombre);
        }
    };

    return (
        <aside className={`group px-3 py-2 shadow-md rounded-lg bg-gradient-to-r ${getColorByPromedio(data.promedio)} text-white border-2 min-w-[180px] relative transition-all duration-200`}>
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

            {/* Contenido */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-semibold">{data.nombre}</div>
                    <div className="text-sm opacity-90">Año: {data.año} | Ciclo: {data.numero}</div>
                    <div className="text-xs opacity-80">
                        {data.estudiantes_count} estudiantes | Promedio: {parseFloat(data.promedio || 0).toFixed(2)}
                    </div>
                    <div className="text-xs opacity-80">
                        {data.cursos_pendientes ? (
                            <span className="text-orange-500">Promedio: Pendiente de cursos</span>
                        ) : (
                            <>
                                <span className="text-white">{data.aprobados || 0} Aprobados</span> | <span className="text-red-500">{data.desaprobados || 0} Desaprobados</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <TrendingUp className="w-5 h-5 absolute top-1 right-1 bg-white text-blue-500 p-1 rounded-md" />

            {/* Botón oculto que aparece al pasar el mouse - igual que CursoNodo */}
            <button
                onClick={handleVerEstudiantes}
                disabled={data.cursos_pendientes}
                className={`
                    absolute -bottom-2 -right-2 p-1 rounded-sm
                    transition-opacity duration-300
                    ${data.cursos_pendientes
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                `}
                title={data.cursos_pendientes ? "Pendiente de cursos" : "Ver estudiantes"}
            >
                <MdOutlineViewInAr className="w-4 h-4" />
            </button>
        </aside>
    );
};
export const CursoNodo = ({ data, onVerEstudiantes }) => {
    const handleVerEstudiantes = (e) => {
        e.stopPropagation();
        if (onVerEstudiantes) {
            onVerEstudiantes(data.id, data.nombre);
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

// componente de panel de información
export const PanelInfo = () => {
    return (
        <Panel position="top-right" className="bg-white p-3 rounded-lg shadow-lg" >
            <div className="text-sm space-y-1">
                <div className="font-semibold text-gray-800">Leyenda</div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs">Carreras</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">Ciclos (Promedio ≥13)</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">Ciclos (Promedio &lt;13)</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span className="text-xs">Cursos</span>
                </div>
            </div>
        </Panel >
    )
}


// Panel de graficos para ver el ciclo con mas puntos
export const PanelCicloPuntos = ({ carreras = [], filtros = {} }) => {
    // Extraer todos los ciclos de todas las carreras
    const todosLosCiclos = carreras.flatMap(carrera => 
        carrera.ciclos?.map(ciclo => ({
            ...ciclo,
            carrera_nombre: carrera.nombre
        })) || []
    );

    // Ordenar ciclos por promedio descendente (incluir todos los ciclos, incluso con promedio 0)
    const ciclosOrdenados = todosLosCiclos
        .filter(ciclo => ciclo.promedio !== null && ciclo.promedio !== undefined)
        .sort((a, b) => parseFloat(b.promedio || 0) - parseFloat(a.promedio || 0));

    // Función para obtener color según el promedio
    const getColorByPromedio = (promedio) => {
        const promedioNum = parseFloat(promedio);
        if (promedioNum >= 16) return 'bg-green-600';
        if (promedioNum >= 13) return 'bg-green-500';
        if (promedioNum >= 11) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Panel position="bottom-left" className="bg-white p-3 rounded-lg shadow-lg max-w-sm" >
            <aside className="text-sm space-y-2">
                <h4 className="font-semibold text-gray-800">
                    Promedios por Ciclos {filtros.año && `- ${filtros.año}`}
                </h4>
                
                {ciclosOrdenados.length === 0 ? (
                    <div className="text-xs text-gray-500 italic">
                        No hay datos de ciclos disponibles
                    </div>
                ) : (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                        {ciclosOrdenados.slice(0, 8).map((ciclo, index) => (
                            <div key={`${ciclo.id}-${index}`} className="flex items-center justify-between space-x-2">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <div className={`w-3 h-3 rounded ${getColorByPromedio(ciclo.promedio)}`}></div>
                                    <span className="text-xs truncate">
                                        {ciclo.nombre} - {ciclo.año}
                                    </span>
                                </div>
                                <span className={`text-xs text-white px-2 py-0.5 rounded ${getColorByPromedio(ciclo.promedio)}`}>
                                    {parseFloat(ciclo.promedio || 0).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {ciclosOrdenados.length > 8 && (
                            <div className="text-xs text-gray-500 italic text-center pt-1">
                                +{ciclosOrdenados.length - 8} ciclos más
                            </div>
                        )}
                    </div>
                )}
                
                {ciclosOrdenados.length > 0 && (
                    <div className="border-t pt-2 mt-2">
                        <div className="text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>Total ciclos:</span>
                                <span className="font-medium">{ciclosOrdenados.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Promedio más alto:</span>
                                <span className="font-medium text-green-600">
                                    {parseFloat(ciclosOrdenados[0].promedio || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </Panel >
    )
}
