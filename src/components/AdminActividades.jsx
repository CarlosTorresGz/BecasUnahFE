import React, { useState } from 'react';
import '../styles/AdminActividades.css';
import { MdEdit, MdDelete } from 'react-icons/md';

const AdminActividades = ({ data }) => {
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [actividades, setActividades] = useState(data);

    const handleDelete = (id) => {
        setActividades(actividades.filter(actividad => actividad.id !== id));
        // Aquí puedes implementar la lógica para hacer la llamada a la API para eliminar la actividad.
    };

    const handleEdit = (actividad) => {
        setActividadSeleccionada(actividad);
        // Aquí puedes implementar la lógica para abrir el formulario de edición.
    };

    const handleSave = (actividadEditada) => {
        setActividades(actividades.map(actividad => actividad.id === actividadEditada.id ? actividadEditada : actividad));
        setActividadSeleccionada(null);
        // Aquí puedes implementar la lógica para hacer la llamada a la API para guardar los cambios de la actividad.
    };

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setActividadSeleccionada({ ...actividadSeleccionada, imagen: reader.result });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="actividades-container">
            {actividadSeleccionada ? (
                // Vista expandida para editar actividad
                <div className="actividad-expandida">
                    <div className="actividad-izquierda">
                        <label className="form-label">
                            <strong>Cambiar imagen:</strong>
                            <input type="file" onChange={handleChangeImage} className="form-input"/>
                        </label>
                        <img src={actividadSeleccionada.imagen} alt={actividadSeleccionada.nombre} className="actividad-imagen-exp" />
                        <button className="boton-cancelar" onClick={() => setActividadSeleccionada(null)}>Cancelar</button>
                    </div>
                    <div className="actividad-derecha">
                        <label className="form-label">
                            <strong>Nombre:</strong>
                            <input
                                type="text"
                                value={actividadSeleccionada.nombre}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, nombre: e.target.value })}
                                className="form-input"
                            />
                        </label>
                        <label className="form-label">
                            <strong>Fecha:</strong>
                            <input
                                type="text"
                                value={actividadSeleccionada.fecha}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, fecha: e.target.value })}
                                className="form-input"
                            />
                        </label>
                        <label className="form-label">
                            <strong>Formato:</strong>
                            <input
                                type="text"
                                value={actividadSeleccionada.formato}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, formato: e.target.value })}
                                className="form-input"
                            />
                        </label>
                        <label className="form-label">
                            <strong>Duración:</strong>
                            <input
                                type="text"
                                value={actividadSeleccionada.duracion}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, duracion: e.target.value })}
                                className="form-input"
                            />
                        </label>
                        <label className="form-label">
                            <strong>Idioma:</strong>
                            <input
                                type="text"
                                value={actividadSeleccionada.idioma}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, idioma: e.target.value })}
                                className="form-input"
                            />
                        </label>
                        <label className="form-label">
                            <strong>Descripción:</strong>
                            <textarea
                                value={actividadSeleccionada.descripcion}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, descripcion: e.target.value })}
                                className="form-textarea"
                            />
                        </label>
                        <button className="boton-guardar" onClick={() => handleSave(actividadSeleccionada)}>Guardar</button>
                    </div>
                </div>
            ) : (
                // Vista normal
                <div className="actividades-list">
                    {actividades.map((actividad) => (
                        <div key={actividad.id} className="actividad-box">
                            <img src={actividad.imagen} alt={actividad.nombre} className="actividad-imagen" />
                            <div className="actividad-info">
                                <h3>{actividad.nombre}</h3>
                                <p><strong>Organizador:</strong> {actividad.organizador}</p>
                                <p><strong>Fecha:</strong> {actividad.fecha}</p>
                            </div>
                            <div className="actividad-botones">
                                <button className="boton-editar" onClick={() => handleEdit(actividad)}><MdEdit /></button>
                                <button className="boton-borrar" onClick={() => handleDelete(actividad.id)}><MdDelete /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminActividades;
