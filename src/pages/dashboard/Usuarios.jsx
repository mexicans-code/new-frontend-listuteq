import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState({
        id: null,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        matricula: '',
        correo: '',
        contrasena: '',
        rol: '',
        programaIds: []
    });

    const API_URL = 'http://localhost:8084/usuarios';
    const PROGRAMAS_URL = 'http://localhost:8082/programas/all';

    useEffect(() => {
        cargarUsuarios();
        cargarProgramas();
    }, []);

    const cargarUsuarios = async () => {
            try {
                const response = await axios.get(`${API_URL}/all`);
                setUsuarios(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
                alert('Error al cargar usuarios');
            }
        };

    const cargarProgramas = async () => {
            try {
                const response = await axios.get(PROGRAMAS_URL);
                console.log("Programas cargados:", response.data);
                setProgramas(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error al cargar programas:', error);
                alert('Error al cargar programas');
            }
        };
        try {
            const response = await axios.get(`${API_URL}/all`);
            setUsuarios(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar usuarios');
        }
    };

    const cargarProgramas = async () => {
        try {
            const response = await axios.get(PROGRAMAS_URL);
            console.log("Programas cargados:", response.data);
            setProgramas(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar programas:', error);
            alert('Error al cargar programas');
        }
    };

    const abrirModal = (usuario = null) => {
        if (usuario) {
            setEditando(true);
            setUsuarioActual({
                id: usuario.id,
                nombre: usuario.nombre,
                apellidoPaterno: usuario.apellidoPaterno,
                apellidoMaterno: usuario.apellidoMaterno,
                matricula: usuario.matricula,
                correo: usuario.correo,
                contrasena: '', // no mostrar contraseña
                rol: usuario.rol,
                programaIds: usuario.programas ? usuario.programas.map(p => p.id) : []
            });
        } else {
            setEditando(false);
            setUsuarioActual({
                id: null,
                nombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                matricula: '',
                correo: '',
                contrasena: '',
                rol: '',
                programaIds: []
            });
        }
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setUsuarioActual({
            id: null,
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            matricula: '',
            correo: '',
            contrasena: '',
            rol: '',
            programaIds: []
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuarioActual(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (programaId) => {
        setUsuarioActual(prev => {
            const current = prev.programaIds;
            return current.includes(programaId)
                ? { ...prev, programaIds: current.filter(id => id !== programaId) }
                : { ...prev, programaIds: [...current, programaId] };
        });
    };

    const guardarUsuario = async (e) => {
            e.preventDefault();
    
            if (!usuarioActual.nombre || !usuarioActual.apellidoPaterno || !usuarioActual.correo || !usuarioActual.rol || !usuarioActual.matricula) {
                alert('Completa los campos obligatorios');
                return;
            }
    
            try {
                if (editando) {
                    await axios.put(`${API_URL}/${usuarioActual.id}`, usuarioActual);
                    alert('Usuario actualizado exitosamente');
                } else {
                    await axios.post(API_URL, usuarioActual);
                    alert('Usuario creado exitosamente');
                }
                cerrarModal();
                cargarUsuarios();
            } catch (error) {
                console.error('Error al guardar usuario:', error);
                alert('Error al guardar el usuario: ' + (error.response?.data?.message || error.message));
            }
        };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <button
                    onClick={() => abrirModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Matricula</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Programas</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay usuarios registrados</td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                            {usuario.matricula}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                            {usuario.nombre} {usuario.apellidoPaterno}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{usuario.correo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{usuario.rol}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {usuario.programas && usuario.programas.length > 0
                                                ? usuario.programas.map(p => p.nombre).join(', ')
                                                : 'Sin programas'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <button
                                                onClick={() => abrirModal(usuario)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1 mx-auto"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-screen overflow-y-auto p-6">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                            <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={guardarUsuario} className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                                <input type="text" name="nombre" value={usuarioActual.nombre} onChange={handleChange} required placeholder="Ej: Juan" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Paterno *</label>
                                <input type="text" name="apellidoPaterno" value={usuarioActual.apellidoPaterno} onChange={handleChange} required placeholder="Ej: Pérez" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno</label>
                                <input type="text" name="apellidoMaterno" value={usuarioActual.apellidoMaterno} onChange={handleChange} placeholder="Ej: García" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Matricula *</label>
                                <input type="text" name="matricula" value={usuarioActual.matricula} onChange={handleChange} required placeholder="Ej: 123456" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Correo *</label>
                                <input type="email" name="correo" value={usuarioActual.correo} onChange={handleChange} required placeholder="ejemplo@uteq.edu.mx" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                                <input type="password" name="contrasena" value={usuarioActual.contrasena} onChange={handleChange} required={!editando} placeholder="••••••••" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                {editando && <p className="text-xs text-gray-500 mt-1">Dejar en blanco para mantener la contraseña actual</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
                                <input type="text" name="rol" value={usuarioActual.rol} onChange={handleChange} required placeholder="Ej: Usuario, Admin" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Programas educativos *</label>
                                <div className="border rounded-lg p-3 max-h-48 overflow-y-auto grid grid-cols-2 gap-2">
                                    {programas.length === 0 ? (
                                        <p className="text-sm text-gray-500">No hay programas disponibles</p>
                                    ) : (
                                        programas.map(programa => (
                                            <label key={programa.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={usuarioActual.programaIds.includes(programa.id)}
                                                    onChange={() => handleCheckboxChange(programa.id)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{programa.nombrePrograma}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        </form>

                        <div className="flex justify-end gap-3 p-6 border-t mt-4">
                            <button onClick={cerrarModal} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                            <button onClick={guardarUsuario} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{editando ? 'Actualizar' : 'Guardar'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
