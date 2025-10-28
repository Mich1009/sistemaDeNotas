import React, { useState, useEffect } from 'react';
import { FileText, Download, BarChart3, TrendingUp, Users, BookOpen, GraduationCap, Filter, RefreshCw, } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReportes } from '../hooks';

const Reports = () => {
    const {
        loading,
    } = useReportes();


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-3 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">Reportes y Estadísticas</h1>
                <p className="text-secondary-600 mt-2">Visualiza estadísticas y exporta datos del sistema</p>
            </div>

        </div>
    );
};

export default Reports;