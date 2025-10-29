import { useState, useEffect, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow';
import toast from 'react-hot-toast';
import { reportesService } from '../services/apiAdmin';
import dagre from 'dagre';
import api from '../../../shared/utils/axiosInstance';

export const useReportesDinamicos = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        año: new Date().getFullYear(),
        carrera_id: null
    });
    const [añosDisponibles, setAñosDisponibles] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        total_carreras: 0,
        total_ciclos: 0,
        total_cursos: 0,
        promedio_general: 0
    });

    // Estados para el modal de estudiantes
    const [modalEstudiantes, setModalEstudiantes] = useState({
        isOpen: false,
        cursoId: null,
        cursoNombre: ''
    });

    // Debug: Monitorear cambios en modalEstudiantes
    useEffect(() => {
        console.log('🔄 Estado modalEstudiantes cambió:', modalEstudiantes);
    }, [modalEstudiantes]);

    const nodeWidth = 200;
    const nodeHeight = 100;

    // Cargar años disponibles
    useEffect(() => {
        const cargarAños = async () => {
            try {
                const response = await reportesService.getAñosDisponibles();
                if (response.success) {
                    setAñosDisponibles(response.data);
                }
            } catch (error) {
                console.error('Error al cargar años:', error);
            }
        };
        cargarAños();
    }, []);

    const getLayoutedElements = (nodes, edges, direction = 'LR') => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({
            rankdir: direction,
            ranksep: 250, // Aumentar separación entre niveles
            nodesep: 100, // Separación entre nodos del mismo nivel
            marginx: 50,
            marginy: 50
        });

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, {
                width: nodeWidth,
                height: nodeHeight
            });
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        const layoutedNodes = nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);

            // Verificar que Dagre calculó la posición
            if (nodeWithPosition && nodeWithPosition.x !== undefined && nodeWithPosition.y !== undefined) {
                return {
                    ...node,
                    targetPosition: isHorizontal ? 'left' : 'top',
                    sourcePosition: isHorizontal ? 'right' : 'bottom',
                    position: {
                        x: nodeWithPosition.x - nodeWidth / 2,
                        y: nodeWithPosition.y - nodeHeight / 2,
                    },
                };
            } else {
                // Fallback position si Dagre falla
                console.warn(`Dagre no pudo calcular posición para nodo ${node.id}`);
                return {
                    ...node,
                    targetPosition: isHorizontal ? 'left' : 'top',
                    sourcePosition: isHorizontal ? 'right' : 'bottom',
                    position: { x: 0, y: 0 },
                };
            }
        });

        return { nodes: layoutedNodes, edges };
    };

    // Función para generar nodos y edges desde datos jerárquicos
    const generarGrafo = useCallback((data) => {
        console.log('Generando grafo con datos:', data);

        const newNodes = [];
        const newEdges = [];

        let totalCiclos = 0;
        let totalCursos = 0;
        let sumaPromedios = 0;
        let contadorPromedios = 0;

        // Verificar que tenemos datos válidos
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.log('No hay datos válidos para generar el grafo');
            setNodes([]);
            setEdges([]);
            return;
        }

        data.forEach((carrera, carreraIndex) => {
            const carreraNodeId = `carrera-${carrera.id || carreraIndex}`;

            // Nodo de carrera - SIN posición inicial
            newNodes.push({
                id: carreraNodeId,
                type: 'carrera',
                sourcePosition: 'right',
                targetPosition: 'left',
                // NO asignar posición aquí - Dagre lo hará
                data: {
                    ...carrera,
                    label: carrera.nombre,
                }
            });

            // Verificar que la carrera tiene ciclos
            if (carrera.ciclos && Array.isArray(carrera.ciclos)) {
                carrera.ciclos.forEach((ciclo, cicloIndex) => {
                    const cicloNodeId = `ciclo-${ciclo.id || `${carreraIndex}-${cicloIndex}`}`;
                    totalCiclos++;

                    // Nodo de ciclo - SIN posición inicial
                    newNodes.push({
                        id: cicloNodeId,
                        type: 'ciclo',
                        sourcePosition: 'right',
                        targetPosition: 'left',
                        // NO asignar posición aquí - Dagre lo hará
                        data: {
                            ...ciclo,
                            label: ciclo.nombre,
                        }
                    });

                    // Edge carrera -> ciclo
                    newEdges.push({
                        id: `edge-${carreraNodeId}-${cicloNodeId}`,
                        source: carreraNodeId,
                        target: cicloNodeId,
                        sourceHandle: 'carrera-source',
                        targetHandle: 'ciclo-target',
                        type: 'smoothstep',
                        animated: true,
                        style: {
                            stroke: '#3b82f6',
                            strokeWidth: 3
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: '#3b82f6',
                            width: 20,
                            height: 20
                        }
                    });

                    if (ciclo.promedio && ciclo.promedio > 0) {
                        sumaPromedios += parseFloat(ciclo.promedio);
                        contadorPromedios++;
                    }

                    // Verificar que el ciclo tiene cursos
                    if (ciclo.cursos && Array.isArray(ciclo.cursos)) {
                        ciclo.cursos.forEach((curso, cursoIndex) => {
                            const cursoNodeId = `curso-${curso.id || `${carreraIndex}-${cicloIndex}-${cursoIndex}`}`;
                            totalCursos++;

                            // Nodo de curso - SIN posición inicial
                            newNodes.push({
                                id: cursoNodeId,
                                type: 'curso',
                                sourcePosition: 'right',
                                targetPosition: 'left',
                                // NO asignar posición aquí - Dagre lo hará
                                data: {
                                    ...curso,
                                    label: curso.nombre
                                }
                            });

                            // Edge ciclo -> curso
                            newEdges.push({
                                id: `edge-${cicloNodeId}-${cursoNodeId}`,
                                source: cicloNodeId,
                                target: cursoNodeId,
                                sourceHandle: 'ciclo-source',
                                targetHandle: 'curso-target',
                                type: 'smoothstep',
                                animated: true,
                                style: {
                                    stroke: '#10b981',
                                    strokeWidth: 2.5
                                },
                                markerEnd: {
                                    type: MarkerType.ArrowClosed,
                                    color: '#10b981',
                                    width: 20,
                                    height: 20
                                }
                            });
                        });
                    }
                });
            }
        });

        console.log('Nodos generados:', newNodes.length);
        console.log('Aristas generadas:', newEdges.length);

        setEstadisticas({
            total_carreras: data.length,
            total_ciclos: totalCiclos,
            total_cursos: totalCursos,
            promedio_general: contadorPromedios > 0 ? (sumaPromedios / contadorPromedios).toFixed(2) : 0
        });

        // Aplicar layout de Dagre
        try {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges, 'LR');

            console.log('Nodos con layout aplicado:', layoutedNodes);
            console.log('Aristas con layout aplicado:', layoutedEdges);

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        } catch (error) {
            console.error('Error aplicando layout:', error);
            // Fallback: usar nodos sin layout pero con posiciones básicas
            const fallbackNodes = newNodes.map((node, index) => ({
                ...node,
                position: { x: index * 300, y: 100 }
            }));
            setNodes(fallbackNodes);
            setEdges(newEdges);
        }
    }, [setNodes, setEdges]);

    // Cargar datos jerárquicos
    const cargarDatos = useCallback(async () => {
        if (!filtros.año) return; // No cargar si no hay año seleccionado
        
        setLoading(true);
        try {
            const response = await reportesService.getEstructuraJerarquica(filtros.año);
            if (response.success) {
                generarGrafo(response.data);
                setCarreras(response.data);
            }
        } catch (error) {
            toast.error('Error al cargar datos de reportes');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [filtros.año, generarGrafo]);

    // Función para exportar notas
    const exportarNotas = async (tipo, cicloId = null) => {
        try {
            let url;
            let filename;

            if (tipo === 'todos') {
                url = '/admin/reportes/exportar/notas-todos-ciclos?formato=excel';
                filename = `notas_todos_ciclos_${new Date().toISOString().split('T')[0]}.xlsx`;
            } else {
                url = `/admin/reportes/exportar/notas-por-ciclo/${cicloId}?formato=excel`;
                filename = `notas_ciclo_${cicloId}_${new Date().toISOString().split('T')[0]}.xlsx`;
            }

            const response = await api.get(`${url}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

                toast.success('Archivo descargado exitosamente');
            } else {
                throw new Error('Error en la descarga');
            }
        } catch (error) {
            toast.error('Error al exportar notas');
            console.error('Error:', error);
        }
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const actualizarFiltros = (nuevosFiltros) => {
        setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
    };

    // Funciones para el modal de estudiantes
    const abrirModalEstudiantes = useCallback((cursoId, cursoNombre) => {
        console.log('🔍 abrirModalEstudiantes ejecutado:', { cursoId, cursoNombre });
        setModalEstudiantes({
            isOpen: true,
            cursoId,
            cursoNombre
        });
        console.log('📝 Estado modalEstudiantes actualizado');
    }, []);

    const cerrarModalEstudiantes = useCallback(() => {
        setModalEstudiantes({
            isOpen: false,
            cursoId: null,
            cursoNombre: ''
        });
    }, []);

    return {
        // Estados
        nodes,
        edges,
        loading,
        filtros,
        añosDisponibles,
        carreras,
        estadisticas,
        modalEstudiantes,
        
        // Funciones de ReactFlow
        onNodesChange,
        onEdgesChange,
        onConnect,
        
        // Funciones de negocio
        cargarDatos,
        exportarNotas,
        actualizarFiltros,
        generarGrafo,
        
        // Funciones del modal
        abrirModalEstudiantes,
        cerrarModalEstudiantes
    };
};