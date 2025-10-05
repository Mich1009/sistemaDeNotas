import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";
import { academicService, gradesService, assignmentService } from "../services/apiStudent";

const AcademicPanel = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar lista de cursos al inicio
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await academicService.getCourses();
        setCourses(data);
        if (data.length > 0) setSelectedCourse(data[0]); // seleccionar el primero por defecto
      } catch (err) {
        console.error("Error al cargar cursos:", err);
      }
    };
    loadCourses();
  }, []);

  // Cargar detalles del curso seleccionado
  useEffect(() => {
    if (!selectedCourse) return;

    const loadCourseDetails = async () => {
      setLoading(true);
      try {
        const [info, gradeList, assignmentList] = await Promise.all([
          academicService.getCourseById(selectedCourse.id),
          gradesService.getGradesByCourse(selectedCourse.id),
          assignmentService.getAssignments({ course_id: selectedCourse.id }),
        ]);

        setCourseInfo(info);
        setGrades(gradeList);
        setAssignments(assignmentList);
      } catch (err) {
        console.error("Error al cargar datos del curso:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetails();
  }, [selectedCourse]);

  return (
    <div className="p-6">
      {/* Encabezado */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BookOpen className="text-indigo-500" />
        Mis Cursos
      </h1>

      {/* Navegación de cursos */}
      <div className="flex overflow-x-auto gap-3 pb-2 border-b border-gray-300 mb-6">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCourse?.id === course.id
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-100 hover:bg-indigo-100 text-gray-700"
            }`}
          >
            {course.name}
          </button>
        ))}
      </div>

      {/* Contenido del curso seleccionado */}
      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Cargando información...
        </div>
      ) : selectedCourse ? (
        <motion.div
          key={selectedCourse.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-lg rounded-2xl p-6"
        >
          {/* Información general del curso */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
              {courseInfo?.name || selectedCourse.name}
            </h2>
            <p className="text-gray-600">
              {courseInfo?.description || "Sin descripción disponible."}
            </p>
          </div>

          {/* Sección de calificaciones */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
              Calificaciones
            </h3>
            {grades.length > 0 ? (
              <table className="w-full border-collapse border border-gray-200 text-sm text-left">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="border p-2">Evaluación</th>
                    <th className="border p-2">Nota</th>
                    <th className="border p-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="border p-2">{grade.assignment_name}</td>
                      <td className="border p-2 font-semibold text-center text-indigo-600">
                        {grade.score ?? "-"}
                      </td>
                      <td className="border p-2">
                        {grade.date
                          ? new Date(grade.date).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No hay calificaciones registradas.</p>
            )}
          </div>

          {/* Sección de tareas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
              Tareas / Asignaciones
            </h3>
            {assignments.length > 0 ? (
              <ul className="space-y-2">
                {assignments.map((task) => (
                  <li
                    key={task.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 transition"
                  >
                    <div className="font-medium text-gray-800">
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {task.description || "Sin descripción"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Fecha límite:{" "}
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "No asignada"}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay tareas disponibles.</p>
            )}
          </div>
        </motion.div>
      ) : (
        <p className="text-gray-500">No hay cursos disponibles.</p>
      )}
    </div>
  );
};

export default AcademicPanel;
