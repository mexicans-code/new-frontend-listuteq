import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Grupos() {
    const [grupos, setGrupos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [profesoresGrupo, setProfesoresGrupo] = useState([]);
    const [showProfesoresModal, setShowProfesoresModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAlumnosModal, setShowAlumnosModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [grupoActual, setGrupoActual] = useState({
        id: null,
        nombre: '',
        cuatrimestre: '',
        estado: true,
        alumnoIds: []
    });
    const [alumnosGrupo, setAlumnosGrupo] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

    const API_URL = 'http://localhost:8086/grupos';
    const USUARIOS_URL = 'http://localhost:8084/usuarios/all';

    useEffect(() => {
            cargarGrupos();
            cargarUsuarios();
        }, []);

    const cargarGrupos = async () => {
            try {
                const response = await axios.get(`${API_URL}/all`);
                setGrupos(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error al cargar grupos:', error);
                alert('Error al cargar grupos');
            }
        };

    const cargarUsuarios = async () => {
            try {
                const response = await axios.get(USUARIOS_URL);
                const alumnos = response.data.filter(u => u.rol === 'Usuario' || u.rol === 'Alumno');
                setUsuarios(Array.isArray(alumnos) ? alumnos : []);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };

    const verAlumnos = async (grupo) => {
            try {
                const response = await axios.get(`${API_URL}/${grupo.id}`);
                setGrupoSeleccionado(grupo);
                setAlumnosGrupo(response.data.alumnos || []);
                setShowAlumnosModal(true);
            } catch (error) {
                console.error('Error al cargar alumnos del grupo:', error);
                alert('Error al cargar alumnos');
            }
        };
        cargarGrupos();
        cargarUsuarios();
        cargarProfesores();
    }, []);

    const cargarGrupos = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            setGrupos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar grupos:', error);
            alert('Error al cargar grupos');
        }
    };

    const cargarUsuarios = async () => {
        try {
            const response = await axios.get(USUARIOS_URL);
            const alumnos = response.data.filter(u => u.rol === 'Usuario' || u.rol === 'Alumno' || u.rol === 'ESTUDIANTE');
            setUsuarios(Array.isArray(alumnos) ? alumnos : []);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    const cargarProfesores = async () => {
        try {
            const response = await axios.get(`${API_URL}/profesores-disponibles`);
            setProfesores(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar profesores:', error);
        }
    };

    const verAlumnos = async (grupo) => {
        try {
            const response = await axios.get(`${API_URL}/${grupo.id}`);
            setGrupoSeleccionado(grupo);
            setAlumnosGrupo(response.data.alumnos || []);
            setShowAlumnosModal(true);
        } catch (error) {
            console.error('Error al cargar alumnos del grupo:', error);
            alert('Error al cargar alumnos');
        }
    };

    const cerrarAlumnosModal = () => {
        setShowAlumnosModal(false);
        setAlumnosGrupo([]);
        setGrupoSeleccionado(null);
    };

    const abrirModal = async (grupo = null) => {
            if (grupo) {
                setEditando(true);
                
                try {
                    const response = await axios.get(`${API_URL}/${grupo.id}`);
                    setGrupoActual({
                        id: grupo.id,
                        nombre: grupo.nombre,
                        cuatrimestre: grupo.cuatrimestre,
                        estado: grupo.estado,
                        alumnoIds: response.data.alumnos ? response.data.alumnos.map(a => a.id) : []
                    });
                } catch (error) {
                    console.error('Error al cargar detalles del grupo:', error);
                }
            } else {
                setEditando(false);
                setGrupoActual({
                    id: null,
                    nombre: '',
                    cuatrimestre: '',
                    estado: true,
                    alumnoIds: []
                });
            }
            setShowModal(true);
        };

    const cerrarModal = () => {
        setShowModal(false);
        setGrupoActual({
            id: null,
            nombre: '',
            cuatrimestre: '',
            estado: true,
            alumnoIds: []
        });
    };

    // ================================
    // FUNCIONES PARA PROFESORES
    // ================================

    const verProfesores = async (grupo) => {
        try {
            const response = await axios.get(`${API_URL}/${grupo.id}/profesores`);
            setGrupoSeleccionado(grupo);
            setProfesoresGrupo(response.data || []);
            setShowProfesoresModal(true);
        } catch (error) {
            console.error('Error al cargar profesores del grupo:', error);
            alert('Error al cargar profesores');
        }
    };

    const cerrarProfesoresModal = () => {
        setShowProfesoresModal(false);
        setProfesoresGrupo([]);
        setGrupoSeleccionado(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrupoActual(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (usuarioId) => {
        setGrupoActual(prev => {
            const current = prev.alumnoIds;
            return current.includes(usuarioId)
                ? { ...prev, alumnoIds: current.filter(id => id !== usuarioId) }
                : { ...prev, alumnoIds: [...current, usuarioId] };
        });
    };

    const guardarGrupo = async (e) => {
            e.preventDefault();
    
            if (!grupoActual.nombre || !grupoActual.cuatrimestre) {
                alert('Completa los campos obligatorios');
                return;
            }
    
            try {
                if (editando) {
                    await axios.put(`${API_URL}/${grupoActual.id}`, {
                        nombre: grupoActual.nombre,
                        cuatrimestre: grupoActual.cuatrimestre,
                        estado: grupoActual.estado
                    });
                    
                    await axios.post(`${API_URL}/${grupoActual.id}/asignar-usuarios`, grupoActual.alumnoIds);
                    
                    alert('Grupo actualizado exitosamente');
                } else {
                    const response = await axios.post(API_URL, {
                        nombre: grupoActual.nombre,
                        cuatrimestre: grupoActual.cuatrimestre,
                        estado: grupoActual.estado
                    });
                    
                    if (response.data.id && grupoActual.alumnoIds.length > 0) {
                        await axios.post(`${API_URL}/${response.data.id}/asignar-usuarios`, grupoActual.alumnoIds);
                    }
                    
                    alert('Grupo creado exitosamente');
                }
                cerrarModal();
                cargarGrupos();
            } catch (error) {
                console.error('Error al guardar grupo:', error);
                alert('Error al guardar el grupo: ' + (error.response?.data || error.message));
            }
        };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Grupos</h1>
                <button
                    onClick={() => abrirModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Grupo
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cuatrimestre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cuatrimestre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {grupos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No hay grupos registrados</td>
                                </tr>
                            ) : (
                                grupos.map((grupo) => (
                                    <tr 
                                        key={grupo.id} 
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => verAlumnos(grupo)}
                                    >
                                    <tr key={grupo.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                            {grupo.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {grupo.cuatrimestre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {grupo.estado ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirModal(grupo);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1 mx-auto"
                                            >
                                                Editar
                                            </button>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => verAlumnos(grupo)}
                                                    className="text-green-600 hover:text-green-900 flex items-center gap-1 text-xs"
                                                    title="Ver alumnos"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Alumnos
                                                </button>
                                                <button
                                                    onClick={() => verProfesores(grupo)}
                                                    className="text-orange-600 hover:text-orange-900 flex items-center gap-1 text-xs"
                                                    title="Ver profesores"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                    </svg>
                                                    Profesores
                                                </button>
                                                //botones
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Crear/Editar Grupo */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editando ? 'Editar Grupo' : 'Nuevo Grupo'}
                            </h2>
                            <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
            {/* Modal para Ver Alumnos */}
            {showAlumnosModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
                            <h2 className="text-xl font-semibold text-white">
                                Alumnos del Grupo: {grupoSeleccionado?.nombre}
                            </h2>
                            <button onClick={cerrarAlumnosModal} className="text-white hover:text-gray-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={guardarGrupo}>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Grupo *
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={grupoActual.nombre}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ej: Grupo A, ISC-301-A"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cuatrimestre *
                                        </label>
                                        <input
                                            type="text"
                                            name="cuatrimestre"
                                            value={grupoActual.cuatrimestre}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ej: 2024-1, Sept-Dic 2024"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alumnos asignados
                                    </label>
                                    <div className="border rounded-lg p-3 max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
                                        {usuarios.length === 0 ? (
                                            <p className="text-sm text-gray-500">No hay alumnos disponibles</p>
                                        ) : (
                                            usuarios.map(usuario => (
                                                <label key={usuario.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={grupoActual.alumnoIds.includes(usuario.id)}
                                                        onChange={() => handleCheckboxChange(usuario.id)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {usuario.nombre} {usuario.apellidoPaterno}
                                                    </span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                >
                                    {editando ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                        <div className="p-6">
                            <div className="mb-4 text-sm text-gray-600">
                                <p><strong>Cuatrimestre:</strong> {grupoSeleccionado?.cuatrimestre}</p>
                                <p><strong>Total de alumnos:</strong> {alumnosGrupo.length}</p>
                            </div>

                            {alumnosGrupo.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="mt-2">No hay alumnos asignados a este grupo</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {alumnosGrupo.map((alumno, index) => (
                                                <tr key={alumno.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.correo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button onClick={cerrarAlumnosModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAlumnosModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
                            <h2 className="text-xl font-semibold text-white">
                                Alumnos del Grupo: {grupoSeleccionado?.nombre}
                            </h2>
                            <button onClick={cerrarAlumnosModal} className="text-white hover:text-gray-200">
            {/* Modal para Ver Profesores */}
            {showProfesoresModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
                            <h2 className="text-xl font-semibold text-white">
                                Profesores del Grupo: {grupoSeleccionado?.nombre}
                            </h2>
                            <button onClick={cerrarProfesoresModal} className="text-white hover:text-gray-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4 text-sm text-gray-600">
                                <p><strong>Cuatrimestre:</strong> {grupoSeleccionado?.cuatrimestre}</p>
                                <p><strong>Total de alumnos:</strong> {alumnosGrupo.length}</p>
                            </div>

                            {alumnosGrupo.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="mt-2">No hay alumnos asignados a este grupo</p>
                                <p><strong>Total de profesores:</strong> {profesoresGrupo.length}</p>
                            </div>

                            {profesoresGrupo.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                    <p className="mt-2">No hay profesores asignados a este grupo</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {alumnosGrupo.map((alumno, index) => (
                                                <tr key={alumno.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {alumno.correo}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Núm. Empleado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {profesoresGrupo.map((profesor, index) => (
                                                <tr key={profesor.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {profesor.numeroEmpleado}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {profesor.nombreCompleto}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profesor.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <button
                                                            onClick={() => removerProfesor(profesor.id)}
                                                            className="text-red-600 hover:text-red-900 text-xs"
                                                        >
                                                            Remover
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button
                                onClick={cerrarAlumnosModal}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                            >
                            <button onClick={cerrarProfesoresModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
