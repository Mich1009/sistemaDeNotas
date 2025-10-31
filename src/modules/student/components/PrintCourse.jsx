import React from 'react';
import { gradeUtils } from '../services/apiStudent';
// También exportamos la función directamente para uso como hook
export const usePrintCourse = (onPrint) => {
    const handlePrintCourse = (curso) => {
        if (!curso) return;
        
        const printWindow = window.open('', '_blank');
        const cursoStats = gradeUtils.calculateGradesStatistics(curso.notas);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Boleta de Notas - ${curso.curso_nombre}</title>
                <style>
                    * { box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, sans-serif;
                        margin: 20px auto;
                        max-width: 900px;
                        color: #1f2937;
                        background-color: #fff;
                        line-height: 1.5;
                    }

                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 10px;
                    }

                    .header h1 {
                        margin: 0;
                        font-size: 26px;
                        color: #1e40af;
                    }

                    .course-info {
                        background: #f3f4f6;
                        padding: 18px;
                        margin-bottom: 25px;
                        border-left: 4px solid #2563eb;
                    }

                    .course-info h2 {
                        margin: 0 0 10px;
                        color: #111827;
                    }

                    .stats-grid {
                        display: flex;
                        justify-content: space-around;
                        flex-wrap: wrap;
                        gap: 20px;
                        margin: 25px 0;
                    }

                    .stat-card {
                        flex: 1 1 200px;
                        background: white;
                        padding: 15px 10px;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.08);
                    }

                    .stat-card h3 {
                        margin: 0 0 10px;
                        font-size: 14px;
                        color: #4b5563;
                    }

                    .stat-card p {
                        font-size: 22px;
                        font-weight: bold;
                    }

                    .section-title {
                        font-size: 18px;
                        background-color: #e5e7eb;
                        padding: 10px 15px;
                        border-left: 4px solid #2563eb;
                        margin: 30px 0 15px;
                    }

                    .grades-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 13px;
                        min-width: 800px;
                    }

                    .grades-table th, .grades-table td {
                        border: 1px solid #d1d5db;
                        padding: 8px;
                        text-align: center;
                    }

                    .grades-table th {
                        background-color: #f1f5f9;
                        font-weight: bold;
                        color: #374151;
                    }

                    .status {
                        font-weight: bold;
                        padding: 8px 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        margin-left: 10px;
                    }

                    .approved { background-color: #dcfce7; color: #166534; }
                    .failed { background-color: #fee2e2; color: #991b1b; }

                    .final-average {
                        text-align: center;
                        margin: 30px 0;
                        font-size: 22px;
                        font-weight: bold;
                        color: #2563eb;
                    }

                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #6b7280;
                        margin-top: 40px;
                        border-top: 1px solid #e5e7eb;
                        padding-top: 10px;
                    }

                    @media print {
                        body {
                            margin: 1mm;
                        }
                        .table-container {
                            overflow-x: visible;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>BOLETA DE NOTAS ACADÉMICAS</h1>
                    <p>Sistema de Gestión Académica</p>
                </div>

                <div class="course-info">
                    <h2>${curso.curso_nombre}</h2>
                    <p><strong>Docente:</strong> ${curso.docente_nombre}</p>
                    <p><strong>Ciclo:</strong> ${curso.ciclo_nombre} ${curso.ciclo_año ? `- ${curso.ciclo_año}` : ''}</p>
                    <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total de Evaluaciones</h3>
                        <p style="color:#2563eb;">${cursoStats.total}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Aprobadas</h3>
                        <p style="color:#16a34a;">${cursoStats.aprobados}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Promedio Curso</h3>
                        <p style="color:#dc2626;">${curso.promedio_curso || '--'}</p>
                    </div>
                </div>

                <div class="section-title">DETALLE DE EVALUACIONES</div>

                ${curso.notas.map(nota => {
                    const average = gradeUtils.calculateAverage(nota);
                    const status = average >= 13 ? 'approved' : 'failed';
                    return `
                        <table class="grades-table">
                            <thead>
                                <tr>
                                    ${Array.from({ length: 8 }, (_, i) => `<th>Eval ${i + 1}</th>`).join('')}
                                    ${Array.from({ length: 4 }, (_, i) => `<th>Pract ${i + 1}</th>`).join('')}
                                    ${Array.from({ length: 2 }, (_, i) => `<th>Parc ${i + 1}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    ${Array.from({ length: 8 }, (_, i) => `<td>${nota[`evaluacion${i + 1}`] || '--'}</td>`).join('')}
                                    ${Array.from({ length: 4 }, (_, i) => `<td>${nota[`practica${i + 1}`] || '--'}</td>`).join('')}
                                    ${Array.from({ length: 2 }, (_, i) => `<td>${nota[`parcial${i + 1}`] || '--'}</td>`).join('')}
                                </tr>
                            </tbody>
                        </table>
                
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                            <div><strong>Promedio:</strong> ${average || '--'}</div>
                            <div class="status ${status}">
                                ${average >= 13 ? 'APROBADO' : 'DESAPROBADO'}
                            </div>
                        </div>
                
                        ${nota.observaciones ? `
                            <div style="margin-top: 10px; padding: 10px; background: #f1f5f9; border-radius: 5px;">
                                <strong>Observaciones:</strong> ${nota.observaciones}
                            </div>
                        ` : ''}
                    </div>
                  `;
                }).join('')}
            
                <div class="final-average">
                    PROMEDIO FINAL DEL CURSO: ${curso.promedio_curso || '--'}
                </div>
            
                <div class="footer">
                    <p>Documento generado automáticamente el ${new Date().toLocaleString()}</p>
                    <p>Este documento es una constancia oficial del sistema académico</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
        
        // Callback opcional para notificar al componente padre
        if (onPrint) {
            onPrint(curso);
        }
    };

    return { handlePrintCourse };
};