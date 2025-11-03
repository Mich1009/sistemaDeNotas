import React, { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Panel, ReactFlowProvider, MarkerType, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Filter, RefreshCw, Network } from 'lucide-react';
import { useReportesDinamicos } from '../hooks';
import { CarreraNodo, CicloNodo, CursoNodo, PanelInfo, PanelCicloPuntos } from './componetReport';
import { interpolateSpectral } from 'd3';

// Componente wrapper memoizado para CursoNodo
const CursoNodoWrapper = React.memo(({ onVerEstudiantes, ...props }) => {
    return <CursoNodo {...props} onVerEstudiantes={onVerEstudiantes} />;
});

// Componente wrapper memoizado para CicloNodo
const CicloNodoWrapper = React.memo(({ onVerEstudiantes, ...props }) => {
    return <CicloNodo {...props} onVerEstudiantes={onVerEstudiantes} />;
});

// Tipos de nodos personalizados
const ReportesDinamicos = ({ abrirModalEstudiantes: abrirModalEstudiantesProp }) => {
    const {
        // Estados
        nodes,
        edges,
        loading,
        filtros,
        añosDisponibles,
        carreras,
        modalEstudiantes,
        estadisticas,

        // Funciones de ReactFlow
        onNodesChange,
        onEdgesChange,
        onConnect,

        // Funciones de negocio
        cargarDatos,
        actualizarFiltros,

        // Funciones del modal
        abrirModalEstudiantes,
        cerrarModalEstudiantes
    } = useReportesDinamicos();

    // Memoizar nodeTypes para evitar recreación en cada render
    const nodeTypes = useMemo(() => ({
        carrera: CarreraNodo,
        ciclo: (props) => <CicloNodoWrapper {...props} onVerEstudiantes={abrirModalEstudiantesProp} />,
        curso: (props) => <CursoNodoWrapper {...props} onVerEstudiantes={abrirModalEstudiantesProp} />,
    }), [abrirModalEstudiantesProp]);

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="h-screen flex-1 bg-white flex flex-col">
            <ReactFlowProvider>
                {/* Panel de controles superior */}
                <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-1"><Network className="w-5 h-5" />Reportes Dinámicos</h2>

                        {/* Filtros */}
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={filtros.año || ''}
                                onChange={(e) => actualizarFiltros({ año: e.target.value ? parseInt(e.target.value) : null })}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="">Todos los años</option>
                                {añosDisponibles.map(año => (
                                    <option key={año} value={año}>{año}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={cargarDatos}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Actualizar</span>
                        </button>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                            <div className="font-semibold text-blue-600">{estadisticas.total_carreras}</div>
                            <div className="text-gray-500">Carreras</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-green-600">{estadisticas.total_ciclos}</div>
                            <div className="text-gray-500">Ciclos</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-purple-600">{estadisticas.total_cursos}</div>
                            <div className="text-gray-500">Cursos</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-orange-600">{estadisticas.promedio_general}</div>
                            <div className="text-gray-500">Promedio</div>
                        </div>
                    </div>
                    
                </div>

                {/* Área del diagrama */}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    className='react-flow__renderer contrast-cursor flex-1'
                    fitView
                    fitViewOptions={{
                        padding: 0.2,
                        includeHiddenNodes: false,
                        minZoom: 0.1,
                        maxZoom: 1.5
                    }}
                    attributionPosition="bottom-left"
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                        style: {
                            strokeWidth: 3,
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 20,
                            height: 20
                        }
                    }}
                    connectionLineType="smoothstep"
                    snapToGrid={true}
                    snapGrid={[15, 15]}
                    deleteKeyCode="Delete"
                    multiSelectionKeyCode="Shift"
                    edgesUpdatable={false}
                    nodesDraggable={true}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    proOptions={{ hideAttribution: true }}
                >
                    <Controls position='top-left'/>
                    <MiniMap
                        nodeColor={(node) => {
                            switch (node.type) {
                                case 'carrera': return '#3b82f6';
                                case 'ciclo': return '#10b981';
                                case 'curso': return '#6b7280';
                                default: return '#eee';
                            }
                        }}
                        className="bg-white"
                    />
                    <Background variant="dots" gap={12} size={1} />

                    <PanelInfo />
                    <PanelCicloPuntos carreras={carreras} filtros={filtros} />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default ReportesDinamicos;