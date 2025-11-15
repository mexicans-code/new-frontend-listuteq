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
    }, []);

    const cargarUsuarios = async () => {
       
    };

    const cargarProgramas = async () => {
       
    };

    const abrirModal = (usuario = null) => {

    };

    const cerrarModal = () => {
       
    };

    const handleChange = (e) => {
       
    };

    const handleCheckboxChange = (programaId) => {
       
    };

    const guardarUsuario = async (e) => {
       
    };

    return (
        <div className="p-6">
        </div>
    );
}
             