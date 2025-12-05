import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Programas() {
    const [programas, setProgramas] = useState([]);
    const [divisiones, setDivisiones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [programaActual, setProgramaActual] = useState({
        id: null,
        idDivision: '',
        nombre: '',
        descripcion: '',
        activo: true
    });

    const API_URL = 'http://localhost:8082/programas';
    const DIVISIONES_URL = 'http://localhost:8081/api/divisiones';

    useEffect(() => {
        cargarProgramas();
        cargarDivisiones();
    }, []);

    const cargarProgramas = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            setProgramas(response.data);
        } catch (error) {
            console.error('Error al cargar programas:', error);
        }
    };

    const cargarDivisiones = async () => {
        try {
            const response = await axios.get(DIVISIONES_URL);
            setDivisiones(response.data);
        } catch (error) {
            console.error('Error al cargar divisiones:', error);
        }
    };


    const abrirModal = (programa = null) => {
    if (programa) {
        setEditando(true);
        setProgramaActual({
            id: programa.id,
            idDivision: programa.idDivision || '',
            nombre: programa.nombrePrograma,
            descripcion: programa.descripcionPrograma,
            activo: programa.activo
        });
    } else {
        setEditando(false);
        setProgramaActual({
            id: null,
            idDivision: '',
            nombre: '',
            descripcion: '',
            activo: true
        });
    }
    setShowModal(true);
};

    const cerrarModal = () => {
        setShowModal(false);
        setProgramaActual({
            id: null,
            idDivision: '',
            nombre: '',
            descripcion: '',
            activo: true
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProgramaActual({
            ...programaActual,
            [name]: value
        });
    };

    const guardarPrograma = async (e) => {
            e.preventDefault();
    
            if (!programaActual.idDivision || !programaActual.nombre) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }
    
            try {
                if (editando) {
                    await axios.put(`${API_URL}/${programaActual.id}`, programaActual);
                    alert('Programa actualizado exitosamente');
                } else {
                    await axios.post(API_URL, {
                        idDivision: parseInt(programaActual.idDivision),
                        nombre: programaActual.nombre,
                        descripcion: programaActual.descripcion
                    });
                    alert('Programa creado exitosamente');
                }
                cargarProgramas();
                cerrarModal();
            } catch (error) {
                console.error('Error al guardar programa:', error);
                alert('Error al guardar el programa: ' + (error.response?.data?.message || error.message));
            }
        };

    const deshabilitarPrograma = async (id) => {
    };

    const habilitarPrograma = async (id) => {
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Programas Educativos</h1>
                <button
                    onClick={() => abrirModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Programa
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">División</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {programas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No hay programas registrados
                                    </td>
                                </tr>
                            ) : (
                                programas.map((programa) => (
                                    <tr key={programa.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{programa.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{programa.nombrePrograma}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 text-center">{programa.descripcionPrograma}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{programa.nombreDivision}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {programa.activo ? (
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
                                            {programa.activo ? (
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => abrirModal(programa)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => deshabilitarPrograma(programa.id)}
                                                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Deshabilitar
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => habilitarPrograma(programa.id)}
                                                    className="text-green-600 hover:text-green-900 flex items-center gap-1 mx-auto"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
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
                                {editando ? 'Editar Programa' : 'Nuevo Programa'}
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

                        <form onSubmit={guardarPrograma}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        División *
                                    </label>
                                    <select
                                        name="idDivision"
                                        value={programaActual.idDivision}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccione una división</option>
                                        {divisiones.map((division) => (
                                            <option key={division.id} value={division.id}>
                                                {division.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={programaActual.nombre}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: Mecatrónica"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={programaActual.descripcion}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Descripción del programa educativo"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
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
