import React from 'react';
import { 
    Activity,
    Cpu,
    HardDrive,
    Database,
    RefreshCw
} from 'lucide-react';
import { useSistema } from '../hooks';
import {
    SystemHealthCard,
    ActivityChart,
    GradeDistributionChart,
    SystemInfoCard,
    DatabaseMetricsCard
} from '../components/SistemaComponents';

const Sistema = () => {
    const {
        systemHealth,
        performanceMetrics,
        activityTimeline,
        loading,
        error,
        refreshMetrics,
        getSystemStatus
    } = useSistema();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Rendimiento del Sistema</h1>
                    <p className="text-secondary-600 mt-2">
                        Monitoreo en tiempo real del estado y rendimiento del sistema
                    </p>
                </div>
                <button
                    onClick={refreshMetrics}
                    className="btn-secondary flex items-center space-x-2"
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error al cargar métricas
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SystemHealthCard
                    title="Uso de CPU"
                    value={systemHealth?.system?.cpu?.usage_percent ? 
                        systemHealth.system.cpu.usage_percent.toFixed(1) : 
                        'Midiendo...'
                    }
                    unit={systemHealth?.system?.cpu?.usage_percent ? "%" : ""}
                    status={
                        !systemHealth?.system?.cpu?.usage_percent ? 'normal' :
                        systemHealth.system.cpu.usage_percent < 70 ? 'normal' :
                        systemHealth.system.cpu.usage_percent < 90 ? 'high' : 'critical'
                    }
                    icon={Cpu}
                    color="bg-blue-500"
                />
                <SystemHealthCard
                    title="Uso de Memoria"
                    value={systemHealth?.system?.memory?.usage_percent ? 
                        systemHealth.system.memory.usage_percent.toFixed(1) : 
                        'Midiendo...'
                    }
                    unit={systemHealth?.system?.memory?.usage_percent ? "%" : ""}
                    status={
                        !systemHealth?.system?.memory?.usage_percent ? 'normal' :
                        systemHealth.system.memory.usage_percent < 80 ? 'normal' :
                        systemHealth.system.memory.usage_percent < 95 ? 'high' : 'critical'
                    }
                    icon={HardDrive}
                    color="bg-green-500"
                />
                <SystemHealthCard
                    title="Espacio en Disco"
                    value={systemHealth?.system?.disk?.usage_percent ? 
                        systemHealth.system.disk.usage_percent.toFixed(1) : 
                        'Midiendo...'
                    }
                    unit={systemHealth?.system?.disk?.usage_percent ? "%" : ""}
                    status={
                        !systemHealth?.system?.disk?.usage_percent ? 'normal' :
                        systemHealth.system.disk.usage_percent < 85 ? 'normal' :
                        systemHealth.system.disk.usage_percent < 95 ? 'high' : 'critical'
                    }
                    icon={Database}
                    color="bg-purple-500"
                />
                <SystemHealthCard
                    title="Estado del Sistema"
                    value={getSystemStatus(systemHealth).text}
                    status={getSystemStatus(systemHealth).status}
                    icon={Activity}
                    color="bg-orange-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityChart
                    data={activityTimeline || []}
                    title="Actividad del Sistema (Últimos 7 días)"
                />
                <GradeDistributionChart
                    data={performanceMetrics?.grade_distribution || []}
                />
            </div>

            {/* Database Metrics */}
            <DatabaseMetricsCard performanceMetrics={performanceMetrics} />

            {/* System Information */}
            <SystemInfoCard systemHealth={systemHealth} />
        </div>
    );
};

export default Sistema;