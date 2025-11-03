import React, { useState } from 'react';
import { Wifi, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getCourses, debugService } from '../services/apiTeacher';
import toast from 'react-hot-toast';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    setConnectionStatus('testing');
    const results = {};

    try {
      // Test 1: Health Check básico
      console.log('🔍 Test 1: Health Check...');
      try {
        const response = await fetch('http://localhost:8000/health');
        const data = await response.json();
        results.healthCheck = {
          status: 'success',
          data: data,
          message: 'Servidor respondiendo correctamente'
        };
        console.log('✅ Health Check exitoso:', data);
      } catch (error) {
        results.healthCheck = {
          status: 'error',
          message: 'No se puede conectar al servidor en puerto 8000'
        };
        console.error('❌ Health Check falló:', error);
      }

      // Test 2: Autenticación
      console.log('🔍 Test 2: Autenticación...');
      try {
        const authTest = await debugService.testAuthConnection();
        results.auth = {
          status: 'success',
          data: authTest,
          message: `Usuario autenticado: ${authTest.first_name} ${authTest.last_name}`
        };
        console.log('✅ Auth Test exitoso:', authTest);
      } catch (error) {
        results.auth = {
          status: 'error',
          message: 'Error de autenticación - Token inválido o expirado'
        };
        console.error('❌ Auth Test falló:', error);
      }

      // Test 3: Cargar cursos
      console.log('🔍 Test 3: Cargar cursos...');
      try {
        const coursesResponse = await getCourses();
        results.courses = {
          status: 'success',
          data: coursesResponse.data,
          message: `${coursesResponse.data?.length || 0} cursos encontrados`
        };
        console.log('✅ Cursos cargados:', coursesResponse.data);
      } catch (error) {
        results.courses = {
          status: 'error',
          message: 'Error al cargar cursos del profesor'
        };
        console.error('❌ Cursos falló:', error);
      }

      // Test 4: Debug de cursos
      console.log('🔍 Test 4: Debug de cursos...');
      try {
        const debugInfo = await debugService.debugCourses();
        results.debug = {
          status: 'success',
          data: debugInfo,
          message: `Debug: ${debugInfo.teacher_courses_count} cursos asignados al profesor`
        };
        console.log('✅ Debug exitoso:', debugInfo);
      } catch (error) {
        results.debug = {
          status: 'error',
          message: 'Error en debug de cursos'
        };
        console.error('❌ Debug falló:', error);
      }

      setTestResults(results);

      // Determinar estado general
      const hasErrors = Object.values(results).some(r => r.status === 'error');
      setConnectionStatus(hasErrors ? 'error' : 'success');

      toast.success('Tests de conectividad completados');

    } catch (error) {
      console.error('❌ Error general en tests:', error);
      setConnectionStatus('error');
      toast.error('Error ejecutando tests de conectividad');
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    try {
      setLoading(true);
      console.log('🔧 Creando datos de ejemplo...');

      const result = await debugService.createSampleCourse();
      console.log('✅ Curso de ejemplo creado:', result);

      toast.success(`Curso creado: ${result.course_name}`);

      // Volver a ejecutar tests
      setTimeout(runConnectionTest, 1000);

    } catch (error) {
      console.error('❌ Error creando curso:', error);
      toast.error('Error creando curso de ejemplo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTestResult = (testName, result) => {
    if (!result) return null;

    const icon = result.status === 'success'
      ? <CheckCircle className="text-green-500" size={20} />
      : <XCircle className="text-red-500" size={20} />;

    return (
      <div className="flex items-start space-x-3 p-3 border rounded-lg">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{testName}</h4>
          <p className={`text-sm ${result.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {result.message}
          </p>
          {result.data && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer">Ver detalles</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Wifi className="mr-3 text-blue-600" size={24} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Test de Conectividad
              </h1>
              <p className="text-gray-600">
                Diagnosticar problemas de conexión del módulo del profesor
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {connectionStatus === 'success' && (
              <CheckCircle className="text-green-500" size={24} />
            )}
            {connectionStatus === 'error' && (
              <XCircle className="text-red-500" size={24} />
            )}
            {connectionStatus === 'testing' && (
              <RefreshCw className="text-blue-500 animate-spin" size={24} />
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={runConnectionTest}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="animate-spin mr-2" size={16} />
                Ejecutando tests...
              </span>
            ) : (
              'Ejecutar Tests de Conectividad'
            )}
          </button>

          {testResults.courses?.status === 'success' &&
           testResults.courses.data?.length === 0 && (
            <button
              onClick={createSampleData}
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
            >
              Crear Curso de Ejemplo
            </button>
          )}
        </div>

        {/* Resultados de los tests */}
        <div className="space-y-4">
          {renderTestResult('1. Health Check del Servidor', testResults.healthCheck)}
          {renderTestResult('2. Autenticación de Usuario', testResults.auth)}
          {renderTestResult('3. Carga de Cursos', testResults.courses)}
          {renderTestResult('4. Debug de Información', testResults.debug)}
        </div>

        {/* Instrucciones */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Instrucciones de Solución:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Health Check falla:</strong> Ejecutar servidor backend con: <code>python -m uvicorn main:app --reload</code></li>
            <li>• <strong>Autenticación falla:</strong> Cerrar sesión y volver a iniciar sesión</li>
            <li>• <strong>Cursos vacío:</strong> El profesor no tiene cursos asignados - usar el botón "Crear Curso de Ejemplo"</li>
            <li>• <strong>Debug falla:</strong> Problema con la base de datos o modelos</li>
          </ul>
        </div>

        {/* Estado del sistema */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Estado del Sistema:</h3>
          <div className="text-sm text-gray-600">
            <p>• Servidor Backend: {testResults.healthCheck?.status === 'success' ? '✅ Conectado' : '❌ Desconectado'}</p>
            <p>• Autenticación: {testResults.auth?.status === 'success' ? '✅ Válida' : '❌ Inválida'}</p>
            <p>• Datos del Profesor: {testResults.courses?.status === 'success' ? '✅ Disponibles' : '❌ No disponibles'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
