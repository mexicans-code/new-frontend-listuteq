import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Materias() {
    const [materias, setMaterias] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [materiaActual, setMateriaActual] = useState({
        id: null,
        nombre: '',
        activo: true,
        programaId: '',
    });

    const API_URL = 'http://localhost:8083/materias';
    const PROGRAMAS_URL = 'http://localhost:8082/programas/all';

    useEffect(() => {
            cargarMaterias();
            cargarProgramas();
        }, []);

    const cargarMaterias = async () => {
            try {
                const response = await axios.get(`${API_URL}/all`);
                setMaterias(response.data);
            } catch (error) {
                console.error('Error al cargar materias:', error);
                alert('Error al cargar las materias');
            }
        };

    const cargarProgramas = async () => {
            try {
                const response = await axios.get(PROGRAMAS_URL);
                setProgramas(response.data);
            } catch (error) {
                console.error('Error al cargar programas:', error);
            }
        };
        cargarMaterias();
        cargarProgramas();
    }, []);

    const cargarMaterias = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            setMaterias(response.data);
        } catch (error) {
            console.error('Error al cargar materias:', error);
            alert('Error al cargar las materias');
        }
    };

    const cargarProgramas = async () => {
        try {
            const response = await axios.get(PROGRAMAS_URL);
            setProgramas(response.data);
        } catch (error) {
            console.error('Error al cargar programas:', error);
        }
    };

    const abrirModal = (materia = null) => {
        if (materia) {
            setEditando(true);
            setMateriaActual({
                id: materia.id || null,
                nombre: materia.nombre || '',
                activo: materia.activo || true,
                programaId: materia.programaId || '',
            });
        } else {
            setEditando(false);
            setMateriaActual({
                id: null,
                nombre: '',
                activo: true,
                programaId: '',
            });
        }
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setMateriaActual({
            id: null,
            nombre: '',
            activo: true,
            programaId: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMateriaActual((prev) => ({ ...prev, [name]: value }));
    };

    const guardarMateria = async (e) => {
            e.preventDefault();
    
            if (!materiaActual.nombre || !materiaActual.programaId) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }
    
            try {
                if (editando) {
                    await axios.put(`${API_URL}/${materiaActual.id}`, materiaActual);
                    alert('Materia actualizada exitosamente');
                } else {
                    await axios.post(API_URL, {
                        nombre: materiaActual.nombre,
                        activo: materiaActual.activo,
                        programaId: Number(materiaActual.programaId),
                    });
                    alert('Materia creada exitosamente');
                }
                cargarMaterias();
                cerrarModal();
            } catch (error) {
                console.error('Error al guardar materia:', error);
                alert('Error al guardar la materia: ' + (error.response?.data?.message || error.message));
            }
        };
    const guardarMateria = async (e) => { };

    const deshabilitarMateria = async (id) => {
    };

    const habilitarMateria = async (id) => {
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Materias</h1>
                <button
                    onClick={() => abrirModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Materia
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Programa</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {materias.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay materias registradas</td>
                                </tr>
                            ) : (
                                materias.map((materia) => (
                                    <tr key={materia.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{materia.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{materia.nombrePrograma}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {materia.activo ? (
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
                                                onClick={() => abrirModal(materia)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                            >
                                                Editar
                                            </button>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            {materia.activo ? (
                                                <button
                                                    onClick={() => deshabilitarMateria(materia.id)}
                                                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                >
                                                    Deshabilitar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => habilitarMateria(materia.id)}
                                                    className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                                >
                                                    Habilitar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editando ? 'Editar Materia' : 'Nueva Materia'}
                            </h2>
                            <button
                                onClick={cerrarModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={guardarMateria}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={materiaActual.nombre}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: Matemáticas"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Programa educativo *
                                    </label>
                                    <select
                                        name="programaId"
                                        value={materiaActual.programaId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccione un programa</option>
                                        {programas.map((programa) => (
                                            <option key={programa.id} value={programa.id}>
                                                {programa.nombrePrograma}
                                            </option>
                                        ))}
                                    </select>
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
                    </div>
                </div>
            )}
        </div>
    );
}
