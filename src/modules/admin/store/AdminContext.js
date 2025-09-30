import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
    // Dashboard data
    dashboardData: {
        totalEstudiantes: 0,
        totalDocentes: 0,
        totalCursos: 0,
        totalCarreras: 0,
        estudiantesActivos: 0,
        docentesActivos: 0
    },

    // Data arrays
    estudiantes: [],
    docentes: [],
    cursos: [],
    carreras: [],
    ciclos: [],
    notas: [],

    // UI state
    loading: {
        dashboard: false,
        estudiantes: false,
        docentes: false,
        cursos: false,
        notas: false,
        reportes: false
    },

    // Error state
    errors: {
        dashboard: null,
        estudiantes: null,
        docentes: null,
        cursos: null,
        notas: null,
        reportes: null
    },

    // Selected items
    selectedEstudiante: null,
    selectedDocente: null,
    selectedCurso: null,

    // Filters and search
    filters: {
        estudiantes: { search: '', status: 'all' },
        docentes: { search: '', status: 'all' },
        cursos: { search: '', carrera: 'all', ciclo: 'all' }
    }
};

// Action types
export const ADMIN_ACTIONS = {
    // Loading actions
    SET_LOADING: 'SET_LOADING',

    // Error actions
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',

    // Dashboard actions
    SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',

    // Estudiantes actions
    SET_ESTUDIANTES: 'SET_ESTUDIANTES',
    ADD_ESTUDIANTE: 'ADD_ESTUDIANTE',
    UPDATE_ESTUDIANTE: 'UPDATE_ESTUDIANTE',
    DELETE_ESTUDIANTE: 'DELETE_ESTUDIANTE',
    SET_SELECTED_ESTUDIANTE: 'SET_SELECTED_ESTUDIANTE',

    // Docentes actions
    SET_DOCENTES: 'SET_DOCENTES',
    ADD_DOCENTE: 'ADD_DOCENTE',
    UPDATE_DOCENTE: 'UPDATE_DOCENTE',
    DELETE_DOCENTE: 'DELETE_DOCENTE',
    SET_SELECTED_DOCENTE: 'SET_SELECTED_DOCENTE',

    // Cursos actions
    SET_CURSOS: 'SET_CURSOS',
    SET_CARRERAS: 'SET_CARRERAS',
    SET_CICLOS: 'SET_CICLOS',
    ADD_CURSO: 'ADD_CURSO',
    UPDATE_CURSO: 'UPDATE_CURSO',
    DELETE_CURSO: 'DELETE_CURSO',
    ADD_CARRERA: 'ADD_CARRERA',
    UPDATE_CARRERA: 'UPDATE_CARRERA',
    ADD_CICLO: 'ADD_CICLO',
    UPDATE_CICLO: 'UPDATE_CICLO',
    SET_SELECTED_CURSO: 'SET_SELECTED_CURSO',

    // Notas actions
    SET_NOTAS: 'SET_NOTAS',
    ADD_NOTA: 'ADD_NOTA',
    UPDATE_NOTA: 'UPDATE_NOTA',
    DELETE_NOTA: 'DELETE_NOTA',

    // Filter actions
    SET_FILTER: 'SET_FILTER',
    CLEAR_FILTERS: 'CLEAR_FILTERS'
};

// Reducer function
const adminReducer = (state, action) => {
    switch (action.type) {
        case ADMIN_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.section]: action.payload.isLoading
                }
            };

        case ADMIN_ACTIONS.SET_ERROR:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.section]: action.payload.error
                }
            };

        case ADMIN_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.section]: null
                }
            };

        case ADMIN_ACTIONS.SET_DASHBOARD_DATA:
            return {
                ...state,
                dashboardData: action.payload
            };

        case ADMIN_ACTIONS.SET_ESTUDIANTES:
            return {
                ...state,
                estudiantes: action.payload
            };

        case ADMIN_ACTIONS.ADD_ESTUDIANTE:
            return {
                ...state,
                estudiantes: [...state.estudiantes, action.payload]
            };

        case ADMIN_ACTIONS.UPDATE_ESTUDIANTE:
            return {
                ...state,
                estudiantes: state.estudiantes.map(est =>
                    est.id === action.payload.id ? action.payload : est
                )
            };

        case ADMIN_ACTIONS.DELETE_ESTUDIANTE:
            return {
                ...state,
                estudiantes: state.estudiantes.filter(est => est.id !== action.payload)
            };

        case ADMIN_ACTIONS.SET_SELECTED_ESTUDIANTE:
            return {
                ...state,
                selectedEstudiante: action.payload
            };

        case ADMIN_ACTIONS.SET_DOCENTES:
            return {
                ...state,
                docentes: action.payload
            };

        case ADMIN_ACTIONS.ADD_DOCENTE:
            return {
                ...state,
                docentes: [...state.docentes, action.payload]
            };

        case ADMIN_ACTIONS.UPDATE_DOCENTE:
            return {
                ...state,
                docentes: state.docentes.map(doc =>
                    doc.id === action.payload.id ? action.payload : doc
                )
            };

        case ADMIN_ACTIONS.DELETE_DOCENTE:
            return {
                ...state,
                docentes: state.docentes.filter(doc => doc.id !== action.payload)
            };

        case ADMIN_ACTIONS.SET_SELECTED_DOCENTE:
            return {
                ...state,
                selectedDocente: action.payload
            };

        case ADMIN_ACTIONS.SET_CURSOS:
            return {
                ...state,
                cursos: action.payload
            };

        case ADMIN_ACTIONS.SET_CARRERAS:
            return {
                ...state,
                carreras: action.payload
            };

        case ADMIN_ACTIONS.SET_CICLOS:
            return {
                ...state,
                ciclos: action.payload
            };

        case ADMIN_ACTIONS.ADD_CURSO:
            return {
                ...state,
                cursos: [...state.cursos, action.payload]
            };

        case ADMIN_ACTIONS.UPDATE_CURSO:
            return {
                ...state,
                cursos: state.cursos.map(curso =>
                    curso.id === action.payload.id ? action.payload : curso
                )
            };

        case ADMIN_ACTIONS.DELETE_CURSO:
            return {
                ...state,
                cursos: state.cursos.filter(curso => curso.id !== action.payload)
            };

        case ADMIN_ACTIONS.ADD_CARRERA:
            return {
                ...state,
                carreras: [...state.carreras, action.payload]
            };

        case ADMIN_ACTIONS.UPDATE_CARRERA:
            return {
                ...state,
                carreras: state.carreras.map(carr =>
                    carr.id === action.payload.id ? action.payload : carr
                )
            };

        case ADMIN_ACTIONS.ADD_CICLO:
            return {
                ...state,
                ciclos: [...state.ciclos, action.payload]
            };

        case ADMIN_ACTIONS.UPDATE_CICLO:
            return {
                ...state,
                ciclos: state.ciclos.map(ciclo =>
                    ciclo.id === action.payload.id ? action.payload : ciclo
                )
            };

        case ADMIN_ACTIONS.SET_SELECTED_CURSO:
            return {
                ...state,
                selectedCurso: action.payload
            };

        case ADMIN_ACTIONS.SET_NOTAS:
            return {
                ...state,
                notas: action.payload
            };

        case ADMIN_ACTIONS.ADD_NOTA:
            return {
                ...state,
                notas: [...state.notas, action.payload]
            };

        case ADMIN_ACTIONS.UPDATE_NOTA:
            return {
                ...state,
                notas: state.notas.map(nota =>
                    nota.id === action.payload.id ? action.payload : nota
                )
            };

        case ADMIN_ACTIONS.DELETE_NOTA:
            return {
                ...state,
                notas: state.notas.filter(nota => nota.id !== action.payload)
            };

        case ADMIN_ACTIONS.SET_FILTER:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [action.payload.section]: {
                        ...state.filters[action.payload.section],
                        ...action.payload.filters
                    }
                }
            };

        case ADMIN_ACTIONS.CLEAR_FILTERS:
            return {
                ...state,
                filters: {
                    estudiantes: { search: '', status: 'all' },
                    docentes: { search: '', status: 'all' },
                    cursos: { search: '', carrera: 'all', ciclo: 'all' }
                }
            };

        default:
            return state;
    }
};

// Create context
const AdminContext = createContext();

// Provider component
export const AdminProvider = ({ children }) => {
    const [state, dispatch] = useReducer(adminReducer, initialState);

    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook to use the context
export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
};