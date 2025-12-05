import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Horarios() {
    const [horarios, setHorarios] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [horarioActual, setHorarioActual] = useState({
        id: null,
        diaSemana: '',
        horaInicio: '',
        horaFin: '',
        aula: '',
        activo: true,
        grupoId: null,
        materiaId: null
    });

    const API_URL = 'http://localhost:8087/horarios';
    const GRUPOS_URL = 'http://localhost:8086/grupos/all';
    const MATERIAS_URL = 'http://localhost:8083/materias/all';

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const horariosDelDia = [
        { inicio: '05:00', fin: '06:00' },
        { inicio: '06:00', fin: '07:00' },
        { inicio: '07:00', fin: '08:00' },
        { inicio: '08:00', fin: '09:00' },
        { inicio: '09:00', fin: '10:00' },
        { inicio: '10:00', fin: '11:00' },
    ];

    useEffect(() => {
        cargarGrupos();
        cargarMaterias();
    }, []);

    useEffect(() => {
        if (grupoSeleccionado) {
            cargarHorariosPorGrupo(grupoSeleccionado);
        }
    }, [grupoSeleccionado]);

    const cargarHorariosPorGrupo = async (grupoId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/grupo/${grupoId}`);
            setHorarios(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar horarios:', error);
            setHorarios([]);
        } finally {
            setLoading(false);
        }
    };

    const cargarGrupos = async () => {
        try {
            const response = await axios.get(GRUPOS_URL);
            setGrupos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar grupos:', error);
        }
    };

    const cargarMaterias = async () => {
        try {
            const response = await axios.get(MATERIAS_URL);
            setMaterias(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar materias:', error);
        }
    };

    const obtenerHorario = (dia, horaInicio, horaFin) => {
        return horarios.find(h =>
            h.diaSemana === dia &&
            h.horaInicio === horaInicio &&
            h.horaFin === horaFin
        );
    };

    //pepito
    const abrirModalParaCelda = (dia, horaInicio, horaFin) => {
        if (!grupoSeleccionado) {
            alert('Selecciona un grupo primero');
            return;
        }

        const horarioExistente = obtenerHorario(dia, horaInicio, horaFin);

        if (horarioExistente) {
            setHorarioActual({
                id: horarioExistente.id,
                diaSemana: dia,
                horaInicio: horaInicio,
                horaFin: horaFin,
                aula: horarioExistente.aula || '',
                activo: horarioExistente.activo,
                grupoId: grupoSeleccionado,
                materiaId: horarioExistente.materia?.id || null
            });
        } else {
            setHorarioActual({
                id: null,
                diaSemana: dia,
                horaInicio: horaInicio,
                horaFin: horaFin,
                aula: '',
                activo: true,
                grupoId: grupoSeleccionado,
                materiaId: null
            });
        }

        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setHorarioActual({
            id: null,
            diaSemana: '',
            horaInicio: '',
            horaFin: '',
            aula: '',
            activo: true,
            grupoId: null,
            materiaId: null
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const finalValue = (name === 'grupoId' || name === 'materiaId')
            ? (value ? Number(value) : null)
            : value;

        setHorarioActual(prev => ({ ...prev, [name]: finalValue }));
    };

    const guardarHorario = async (e) => {
        e.preventDefault();

        if (!horarioActual.materiaId) {
            alert('Selecciona una materia');
            return;
        }

        setLoading(true);
        console.log('📤 Enviando:', horarioActual);

        try {
            if (horarioActual.id) {
                await axios.put(`${API_URL}/${horarioActual.id}`, horarioActual);
                alert('✅ Horario actualizado exitosamente');
            } else {
                await axios.post(API_URL, horarioActual);
                alert('✅ Horario creado exitosamente');
            }
            cerrarModal();
            cargarHorariosPorGrupo(grupoSeleccionado);
        } catch (error) {
            console.error('Error al guardar horario:', error);
            alert('❌ Error al guardar el horario: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const eliminarHorario = async () => {
        if (!window.confirm('⚠️ ¿Estás seguro de eliminar este horario?')) return;

        setLoading(true);
        try {
            await axios.delete(`${API_URL}/${horarioActual.id}`);
            alert('✅ Horario eliminado exitosamente');
            cerrarModal();
            cargarHorariosPorGrupo(grupoSeleccionado);
        } catch (error) {
            console.error('Error al eliminar horario:', error);
            alert('❌ Error al eliminar el horario');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Obtener color según materia
    const getColorPorMateria = (materiaId) => {
        const colores = [
            'bg-blue-100 hover:bg-blue-200 border-blue-300',
            'bg-green-100 hover:bg-green-200 border-green-300',
            'bg-purple-100 hover:bg-purple-200 border-purple-300',
            'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
            'bg-pink-100 hover:bg-pink-200 border-pink-300',
            'bg-indigo-100 hover:bg-indigo-200 border-indigo-300',
            'bg-red-100 hover:bg-red-200 border-red-300',
            'bg-orange-100 hover:bg-orange-200 border-orange-300'
        ];
        return colores[materiaId % colores.length];
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">📅 Gestión de Horarios</h1>
                <p className="text-gray-600">Organiza los horarios de tus grupos de manera visual</p>
            </div>

            {/* Selector de Grupo */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🎓 Seleccionar Grupo
                        </label>
                        <select
                            value={grupoSeleccionado || ''}
                            onChange={(e) => setGrupoSeleccionado(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="">-- Selecciona un grupo --</option>
                            {grupos.map(grupo => (
                                <option key={grupo.id} value={grupo.id}>
                                    {grupo.nombre} - {grupo.cuatrimestre}
                                </option>
                            ))}
                        </select>
                    </div>
                    {grupoSeleccionado && (
                        <div className="bg-blue-50 px-4 py-3 rounded-lg border-2 border-blue-200">
                            <p className="text-sm text-gray-600">Total de clases</p>
                            <p className="text-2xl font-bold text-blue-600">{horarios.length}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Calendario */}
            {grupoSeleccionado && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                                        <th className="border border-blue-400 px-4 py-4 text-sm font-bold text-white w-32">
                                            🕐 Horario
                                        </th>
                                        {diasSemana.map(dia => (
                                            <th key={dia} className="border border-blue-400 px-4 py-4 text-sm font-bold text-white">
                                                {dia}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {horariosDelDia.map(({ inicio, fin }) => (
                                        <tr key={`${inicio}-${fin}`}>
                                            <td className="border border-gray-300 px-4 py-4 text-sm font-semibold text-gray-700 bg-gray-50 text-center">
                                                {inicio}
                                                <div className="text-xs text-gray-500">a</div>
                                                {fin}
                                            </td>
                                            {diasSemana.map(dia => {
                                                const horario = obtenerHorario(dia, inicio, fin);
                                                return (
                                                    <td
                                                        key={`${dia}-${inicio}`}
                                                        onClick={() => abrirModalParaCelda(dia, inicio, fin)}
                                                        className={`border-2 px-3 py-4 text-center cursor-pointer transition-all duration-200 ${horario
                                                                ? `${getColorPorMateria(horario.materia?.id)} border-l-4`
                                                                : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        {horario ? (
                                                            <div className="text-sm">
                                                                <div className="font-bold text-gray-800 mb-1">
                                                                    {horario.materia?.nombre || 'Sin materia'}
                                                                </div>
                                                                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                    </svg>
                                                                    {horario.aula || 'Sin aula'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-400 text-xs font-medium flex flex-col items-center gap-1">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                                Agregar
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!grupoSeleccionado && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-16 text-center border-2 border-dashed border-blue-300">
                    <svg className="mx-auto h-20 w-20 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Comienza seleccionando un grupo</h3>
                    <p className="text-gray-600">Elige un grupo de la lista para visualizar y gestionar su horario</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        {/* Header del Modal */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {horarioActual.id ? (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar Horario
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Agregar Materia
                                        </>
                                    )}
                                </h2>
                                <button
                                    onClick={cerrarModal}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={guardarHorario}>
                            <div className="p-6 space-y-5">
                                {/* Info del horario */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm font-semibold text-gray-700">Información del horario</p>
                                    </div>
                                    <p className="text-sm text-gray-700 ml-7">
                                        <strong>📅 Día:</strong> {horarioActual.diaSemana}
                                    </p>
                                    <p className="text-sm text-gray-700 ml-7">
                                        <strong>🕐 Horario:</strong> {horarioActual.horaInicio} - {horarioActual.horaFin}
                                    </p>
                                </div>

                                {/* Select de Materia */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        📚 Materia *
                                    </label>
                                    <select
                                        name="materiaId"
                                        value={horarioActual.materiaId || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="">-- Seleccionar materia --</option>
                                        {materias.map(materia => (
                                            <option key={materia.id} value={materia.id}>
                                                {materia.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Input de Aula */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        🏫 Aula
                                    </label>
                                    <input
                                        type="text"
                                        name="aula"
                                        value={horarioActual.aula}
                                        onChange={handleChange}
                                        placeholder="Ej: Salón 301, Lab 2, Auditorio"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Footer del Modal */}
                            <div className="flex justify-between items-center p-6 border-t bg-gray-50 rounded-b-2xl">
                                {horarioActual.id && (
                                    <button
                                        type="button"
                                        onClick={eliminarHorario}
                                        disabled={loading}
                                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Eliminar
                                    </button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <button
                                        type="button"
                                        onClick={cerrarModal}
                                        disabled={loading}
                                        className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {horarioActual.id ? 'Actualizar' : 'Guardar'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
