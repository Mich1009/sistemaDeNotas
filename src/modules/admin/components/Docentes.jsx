import React, { useState, useEffect } from 'react';
import { 
    Users, 
    BookOpen, 
    GraduationCap, 
    Plus, 
    Edit, 
    Trash2, 
    Search, 
    Filter, 
    Save, 
    X,
    CheckCircle,
    XCircle,
    Download,
    Upload,
    Calendar,
    Award
} from 'lucide-react';

// Importar servicios reales
import adminUserService from '../services/apiUsers';
import adminCareerService from '../services/apiCarrera';
import adminCycleService from '../services/apiCiclo';
import adminCourseService from '../services/apiCourse';

const Docente = () => {
    const [activeTab, setActiveTab] = useState('usuarios');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ include_inactive: false });
    const [saving, setSaving] = useState(false); // Estado para controlar el guardado

    // Estados para datos maestros (carreras, ciclos, docentes)
    const [masterData, setMasterData] = useState({
        carreras: [],
        ciclos: [],
        docentes: []
    });

    // Estado del formulario unificado
    const [formData, setFormData] = useState({
        // Usuario/Docente
        dni: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'DOCENTE',
        password: '',
        is_active: true,
        
        // Carrera
        codigo: '',
        nombre: '',
        descripcion: '',
        duracion_ciclos: '',
        
        // Ciclo
        numero: '',
        carrera_id: '',
        nombre_ciclo: '',
        
        // Curso
        codigo_curso: '',
        nombre_curso: '',
        creditos: '',
        horas_teoricas: '',
        horas_practicas: '',
        ciclo_id: '',
        docente_id: ''
    });

    // Configuración de cada entidad (sin estudiantes)
    const entitiesConfig = {
        usuarios: {
            service: adminUserService,
            title: 'Usuarios',
            description: 'Gestión de usuarios del sistema (Docentes y Administradores)',
            columns: [
                { key: 'dni', label: 'DNI', width: 'w-24' },
                { key: 'first_name', label: 'Nombres', width: 'w-32' },
                { key: 'last_name', label: 'Apellidos', width: 'w-32' },
                { key: 'email', label: 'Email', width: 'w-64' },
                { key: 'role', label: 'Rol', width: 'w-32' },
                { key: 'phone', label: 'Teléfono', width: 'w-32' },
                { key: 'is_active', label: 'Estado', width: 'w-24' }
            ],
            getData: () => adminUserService.getUsers({ include_inactive: filters.include_inactive }),
            create: (data) => adminUserService.createUser(data),
            update: (id, data) => adminUserService.updateUser(id, data),
            delete: (id) => adminUserService.deleteUser(id)
        },
        carreras: {
            service: adminCareerService,
            title: 'Carreras',
            description: 'Gestión de programas académicos',
            columns: [
                { key: 'codigo', label: 'Código', width: 'w-24' },
                { key: 'nombre', label: 'Nombre', width: 'w-64' },
                { key: 'duracion_ciclos', label: 'Duración', width: 'w-24' },
                { key: 'total_estudiantes', label: 'Estudiantes', width: 'w-24' },
                { key: 'total_ciclos', label: 'Ciclos', width: 'w-20' },
                { key: 'is_active', label: 'Estado', width: 'w-24' }
            ],
            getData: () => adminCareerService.getCareers({ include_inactive: filters.include_inactive }),
            create: (data) => adminCareerService.createCareer(data),
            update: (id, data) => adminCareerService.updateCareer(id, data),
            delete: (id) => adminCareerService.deleteCareer(id)
        },
        ciclos: {
            service: adminCycleService,
            title: 'Ciclos',
            description: 'Gestión de ciclos académicos',
            columns: [
                { key: 'numero', label: 'Número', width: 'w-20' },
                { key: 'nombre', label: 'Nombre', width: 'w-48' },
                { key: 'carrera_nombre', label: 'Carrera', width: 'w-64' },
                { key: 'total_cursos', label: 'Cursos', width: 'w-20' },
                { key: 'total_matriculas', label: 'Matrículas', width: 'w-24' },
                { key: 'is_active', label: 'Estado', width: 'w-24' }
            ],
            getData: () => adminCycleService.getCycles({ include_inactive: filters.include_inactive }),
            create: (data) => adminCycleService.createCycle(data),
            update: (id, data) => adminCycleService.updateCycle(id, data),
            delete: (id) => adminCycleService.deleteCycle(id)
        },
        cursos: {
            service: adminCourseService,
            title: 'Cursos',
            description: 'Gestión de asignaturas académicas',
            columns: [
                { key: 'codigo', label: 'Código', width: 'w-24' },
                { key: 'nombre', label: 'Nombre', width: 'w-64' },
                { key: 'creditos', label: 'Créditos', width: 'w-20' },
                { key: 'ciclo_nombre', label: 'Ciclo', width: 'w-48' },
                { key: 'docente_nombre', label: 'Docente', width: 'w-64' },
                { key: 'total_matriculas', label: 'Matrículas', width: 'w-24' },
                { key: 'is_active', label: 'Estado', width: 'w-24' }
            ],
            getData: () => adminCourseService.getCourses({ include_inactive: filters.include_inactive }),
            create: (data) => adminCourseService.createCourse(data),
            update: (id, data) => adminCourseService.updateCourse(id, data),
            delete: (id) => adminCourseService.deleteCourse(id)
        }
    };

    // Cargar datos principales
    const loadData = async () => {
        setLoading(true);
        try {
            const config = entitiesConfig[activeTab];
            const result = await config.getData();
            setData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error('Error loading data:', error);
            alert(`Error al cargar los ${activeTab}`);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos maestros para formularios
    const loadMasterData = async () => {
        try {
            const [carreras, ciclos, docentes] = await Promise.all([
                adminCareerService.getCareers({ include_inactive: false }),
                adminCycleService.getCycles({ include_inactive: false }),
                adminUserService.getUsersByRole('DOCENTE')
            ]);
            
            setMasterData({
                carreras: Array.isArray(carreras) ? carreras : [],
                ciclos: Array.isArray(ciclos) ? ciclos : [],
                docentes: Array.isArray(docentes) ? docentes : []
            });
        } catch (error) {
            console.error('Error loading master data:', error);
        }
    };

    useEffect(() => {
        loadData();
        if (['ciclos', 'cursos'].includes(activeTab)) {
            loadMasterData();
        }
    }, [activeTab, filters.include_inactive]);

    // Filtrar datos
    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        return Object.values(item).some(value => 
            value?.toString().toLowerCase().includes(term)
        );
    });

    // Resetear formulario
    const resetForm = () => {
        setFormData({
            dni: '',
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            role: 'DOCENTE',
            password: '',
            is_active: true,
            codigo: '',
            nombre: '',
            descripcion: '',
            duracion_ciclos: '',
            numero: '',
            carrera_id: '',
            nombre_ciclo: '',
            codigo_curso: '',
            nombre_curso: '',
            creditos: '',
            horas_teoricas: '',
            horas_practicas: '',
            ciclo_id: '',
            docente_id: ''
        });
        setEditingItem(null);
    };

    // Abrir modal para crear/editar
    const handleCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        
        // Mapear datos según la entidad
        const formDataMap = {
            usuarios: {
                dni: item.dni,
                email: item.email,
                first_name: item.first_name,
                last_name: item.last_name,
                phone: item.phone,
                role: item.role,
                is_active: item.is_active
            },
            carreras: {
                codigo: item.codigo,
                nombre: item.nombre,
                descripcion: item.descripcion,
                duracion_ciclos: item.duracion_ciclos,
                is_active: item.is_active
            },
            ciclos: {
                numero: item.numero,
                carrera_id: item.carrera_id,
                nombre_ciclo: item.nombre,
                is_active: item.is_active
            },
            cursos: {
                codigo_curso: item.codigo,
                nombre_curso: item.nombre,
                creditos: item.creditos,
                horas_teoricas: item.horas_teoricas,
                horas_practicas: item.horas_practicas,
                ciclo_id: item.ciclo_id,
                docente_id: item.docente_id,
                is_active: item.is_active
            }
        };

        setFormData(formDataMap[activeTab] || {});
        setShowModal(true);
    };

    // Validar formulario antes de guardar
    const validateForm = () => {
        const errors = [];

        switch (activeTab) {
            case 'usuarios':
                if (!formData.dni) errors.push('DNI es requerido');
                if (!formData.email) errors.push('Email es requerido');
                if (!formData.first_name) errors.push('Nombres son requeridos');
                if (!formData.last_name) errors.push('Apellidos son requeridos');
                if (!editingItem && !formData.password) errors.push('Contraseña es requerida');
                break;
            case 'carreras':
                if (!formData.codigo) errors.push('Código es requerido');
                if (!formData.nombre) errors.push('Nombre es requerido');
                if (!formData.duracion_ciclos) errors.push('Duración es requerida');
                break;
            case 'ciclos':
                if (!formData.numero) errors.push('Número es requerido');
                if (!formData.carrera_id) errors.push('Carrera es requerida');
                if (!formData.nombre_ciclo) errors.push('Nombre es requerido');
                break;
            case 'cursos':
                if (!formData.codigo_curso) errors.push('Código es requerido');
                if (!formData.nombre_curso) errors.push('Nombre es requerido');
                if (!formData.creditos) errors.push('Créditos son requeridos');
                if (!formData.ciclo_id) errors.push('Ciclo es requerido');
                break;
        }

        return errors;
    };

    // Guardar (crear o actualizar) - CORREGIDO
    const handleSave = async () => {
        const errors = validateForm();
        if (errors.length > 0) {
            alert(`Errores de validación:\n${errors.join('\n')}`);
            return;
        }

        setSaving(true);
        try {
            const config = entitiesConfig[activeTab];
            
            // Preparar datos según la entidad
            const prepareData = {
                usuarios: {
                    dni: formData.dni,
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    role: formData.role,
                    password: formData.password,
                    is_active: formData.is_active
                },
                carreras: {
                    codigo: formData.codigo,
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    duracion_ciclos: parseInt(formData.duracion_ciclos),
                    is_active: formData.is_active
                },
                ciclos: {
                    numero: parseInt(formData.numero),
                    carrera_id: parseInt(formData.carrera_id),
                    nombre: formData.nombre_ciclo,
                    is_active: formData.is_active
                },
                cursos: {
                    codigo: formData.codigo_curso,
                    nombre: formData.nombre_curso,
                    creditos: parseInt(formData.creditos),
                    horas_teoricas: parseInt(formData.horas_teoricas),
                    horas_practicas: parseInt(formData.horas_practicas),
                    ciclo_id: parseInt(formData.ciclo_id),
                    docente_id: formData.docente_id ? parseInt(formData.docente_id) : null,
                    is_active: formData.is_active
                }
            };

            const dataToSave = prepareData[activeTab];

            let result;
            if (editingItem) {
                result = await config.update(editingItem.id, dataToSave);
            } else {
                result = await config.create(dataToSave);
            }

            console.log('Operación exitosa:', result);
            
            setShowModal(false);
            resetForm();
            await loadData(); // Esperar a que recargue los datos
            
            alert(`${config.title.slice(0, -1)} ${editingItem ? 'actualizado' : 'creado'} correctamente`);
        } catch (error) {
            console.error('Error saving:', error);
            alert(`Error al ${editingItem ? 'actualizar' : 'crear'} ${entitiesConfig[activeTab].title.slice(0, -1)}: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    // Eliminar
    const handleDelete = async (id) => {
        if (window.confirm(`¿Estás seguro de eliminar este ${entitiesConfig[activeTab].title.slice(0, -1)}?`)) {
            try {
                const config = entitiesConfig[activeTab];
                await config.delete(id);
                await loadData();
                alert(`${entitiesConfig[activeTab].title.slice(0, -1)} eliminado correctamente`);
            } catch (error) {
                console.error('Error deleting:', error);
                alert(`Error al eliminar ${entitiesConfig[activeTab].title.slice(0, -1)}: ${error.message}`);
            }
        }
    };

    // Renderizar campos del formulario según la entidad
    const renderFormFields = () => {
        const commonFields = (
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Activo</span>
                </label>
            </div>
        );

        switch (activeTab) {
            case 'usuarios':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">DNI *</label>
                            <input
                                type="text"
                                value={formData.dni}
                                onChange={(e) => setFormData({...formData, dni: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="12345678"
                                maxLength="8"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="usuario@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Juan Carlos"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Pérez García"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="999888777"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="DOCENTE">Docente</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                        {!editingItem && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        )}
                        {commonFields}
                    </div>
                );

            case 'carreras':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                            <input
                                type="text"
                                value={formData.codigo}
                                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="ING-SIS"
                                maxLength="10"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Ingeniería de Sistemas"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duración (ciclos) *</label>
                            <input
                                type="number"
                                value={formData.duracion_ciclos}
                                onChange={(e) => setFormData({...formData, duracion_ciclos: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="10"
                                min="1"
                                max="20"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                                placeholder="Descripción de la carrera..."
                            />
                        </div>
                        {commonFields}
                    </div>
                );

            case 'ciclos':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                            <input
                                type="number"
                                value={formData.numero}
                                onChange={(e) => setFormData({...formData, numero: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="1"
                                max="20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carrera *</label>
                            <select
                                value={formData.carrera_id}
                                onChange={(e) => setFormData({...formData, carrera_id: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccionar carrera</option>
                                {masterData.carreras.map(carrera => (
                                    <option key={carrera.id} value={carrera.id}>
                                        {carrera.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <input
                                type="text"
                                value={formData.nombre_ciclo}
                                onChange={(e) => setFormData({...formData, nombre_ciclo: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Primer Ciclo"
                            />
                        </div>
                        {commonFields}
                    </div>
                );

            case 'cursos':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                            <input
                                type="text"
                                value={formData.codigo_curso}
                                onChange={(e) => setFormData({...formData, codigo_curso: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="MAT101"
                                maxLength="10"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <input
                                type="text"
                                value={formData.nombre_curso}
                                onChange={(e) => setFormData({...formData, nombre_curso: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Matemática Básica"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Créditos *</label>
                            <input
                                type="number"
                                value={formData.creditos}
                                onChange={(e) => setFormData({...formData, creditos: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="1"
                                max="10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Horas Teóricas</label>
                            <input
                                type="number"
                                value={formData.horas_teoricas}
                                onChange={(e) => setFormData({...formData, horas_teoricas: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Horas Prácticas</label>
                            <input
                                type="number"
                                value={formData.horas_practicas}
                                onChange={(e) => setFormData({...formData, horas_practicas: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo *</label>
                            <select
                                value={formData.ciclo_id}
                                onChange={(e) => setFormData({...formData, ciclo_id: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccionar ciclo</option>
                                {masterData.ciclos.map(ciclo => (
                                    <option key={ciclo.id} value={ciclo.id}>
                                        {ciclo.nombre} - {ciclo.carrera_nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                            <select
                                value={formData.docente_id}
                                onChange={(e) => setFormData({...formData, docente_id: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Sin asignar</option>
                                {masterData.docentes.map(docente => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.first_name} {docente.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {commonFields}
                    </div>
                );

            default:
                return <div>Formulario no configurado</div>;
        }
    };

    const config = entitiesConfig[activeTab];
    const iconProps = {
        usuarios: { icon: Users, color: 'blue' },
        carreras: { icon: Award, color: 'purple' },
        ciclos: { icon: Calendar, color: 'orange' },
        cursos: { icon: BookOpen, color: 'green' }
    };

    const { icon: Icon, color } = iconProps[activeTab] || { icon: Users, color: 'blue' };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Icon size={48} className={`text-${color}-500`} />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
                            <p className="text-gray-600">{config.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo {config.title.slice(0, -1)}
                    </button>
                </div>
            </div>

            {/* Tabs de Navegación */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="flex border-b">
                    {Object.keys(entitiesConfig).map((tab) => (
                        <button
                            key={tab}
                            className={`flex items-center px-6 py-4 font-medium text-lg transition-colors ${
                                activeTab === tab
                                    ? `text-${iconProps[tab].color}-600 border-b-2 border-${iconProps[tab].color}-600`
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {React.createElement(iconProps[tab].icon, { className: "w-5 h-5 mr-2" })}
                            {entitiesConfig[tab].title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={`Buscar ${config.title.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button 
                            className={`flex items-center px-4 py-2 border border-green-500 rounded-lg hover:bg-green-600 bg-green-500 text-white ${
                                filters.include_inactive ? 'bg-green-600 border-green-600' : ''
                            }`}
                            onClick={() => setFilters({...filters, include_inactive: !filters.include_inactive})}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            {filters.include_inactive ? 'Mostrando inactivos' : 'Mostrar inactivos'}
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Exportar">
                            <Download className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Importar">
                            <Upload className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {config.columns.map((column) => (
                                            <th 
                                                key={column.key} 
                                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width}`}
                                            >
                                                {column.label}
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.map((item, index) => (
                                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            {config.columns.map((column) => (
                                                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {column.key === 'is_active' ? (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            item[column.key] 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {item[column.key] ? (
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                            ) : (
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                            )}
                                                            {item[column.key] ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    ) : (
                                                        item[column.key] || '-'
                                                    )}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredData.length === 0 && (
                            <div className="text-center py-12">
                                <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No se encontraron {config.title.toLowerCase()}</p>
                                <button
                                    onClick={handleCreate}
                                    className={`mt-4 bg-${color}-600 text-white px-4 py-2 rounded-lg hover:bg-${color}-700 transition-colors flex items-center mx-auto`}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear el primer {config.title.slice(0, -1)}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal para Crear/Editar - CORREGIDO */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold">
                                {editingItem ? 'Editar' : 'Crear'} {config.title.slice(0, -1)}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                                disabled={saving}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {renderFormFields()}
                        </div>
                        <div className="flex justify-end space-x-3 p-6 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave} // ✅ ESTA ES LA CORRECCIÓN - ahora sí llama a handleSave
                                disabled={saving}
                                className={`px-4 py-2 bg-${color}-600 text-white rounded-md hover:bg-${color}-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingItem ? 'Actualizar' : 'Crear'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Docente;