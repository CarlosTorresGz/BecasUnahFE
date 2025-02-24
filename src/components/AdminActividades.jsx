import { useState } from 'react';
import '../styles/AdminActividades.css';
import { MdEdit, MdDelete } from 'react-icons/md';
import updateActividad from '../services/updateActividad';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { handleDelete } from '../services/deleteActividad';

const AdminActividades = ({ data }) => {
    const { user } = useAuth();
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [actividades, setActividades] = useState(data);
    const [actividadAEliminar, setActividadAEliminar] = useState(null);
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState(null);

    const cancelDelete = () => {
        setActividadAEliminar(null);
    };

    const handleDeleteActivity = (id) => {
        setActividadAEliminar(actividades.find(actividad => actividad.actividad_id === id));
    };

    const confirmDelete = async () => {
        const actividadId = actividadAEliminar.actividad_id;
        const empleadoId = user.empleado_id.trim();

        const deleteActividad = await handleDelete({ empleado_id: empleadoId, actividad_id: actividadId });

        if (deleteActividad.state) {
            setActividades(actividades.filter(actividad => actividad.actividad_id !== actividadAEliminar.actividad_id));
            setMensajeConfirmacion(`La actividad "${actividadAEliminar.nombre_actividad}" ha sido eliminada correctamente.`);
            setActividadAEliminar(null);

            // Oculta el mensaje después de 3 segundos
            setTimeout(() => setMensajeConfirmacion(""), 3000);

        } else {
            toast.error('Error al eliminar la actividad.');
        }


    };

    const handleEdit = (actividad) => {
        setActividadSeleccionada(actividad);
        const actividadId = actividad.actividad_id;


        // O actividad.actividad_id, dependiendo de cómo lo llames
        console.log('Editar actividad con ID:', actividadId);
        // Aquí puedes implementar la lógica para abrir el formulario de edición.
    };

    const handleSave = async (actividadEditada) => {

        setActividadSeleccionada(actividadEditada)


        // const entrante = {
        //     actividad_id: 'A00003', // string
        //     nombre_actividad: "Taller de React", // string
        //     descripcion: "Aprende React desde cero", // string
        //     fecha_actividad: "2023-10-15", // string (formato fecha)
        //     numero_horas: 4, // number
        //     ubicacion: "Sala 101", // string
        //     imagen: "url_de_la_imagen", // string (URL o base64)
        //     estado_actividad: "activo", // string
        //     organizador: "Juan Pérez", // string
        // };


        const response = updateActividad(actividadEditada);
        if (response) {
            alert('Actividad actualizada con éxito!');
        } else {
            alert('Hubo un error al actualizar la actividad.');
        }

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
            {mensajeConfirmacion && (
                <div className="mensaje-confirmacion">
                    {mensajeConfirmacion}
                </div>
            )}
            {actividadSeleccionada ? (
                // Vista expandida para editar actividad
                <div className="actividad-expandida">
                    <div className="actividad-izquierda">
                        <label className="form-label">
                            <strong>Cambiar imagen:</strong>
                            <input type="file" onChange={handleChangeImage} className="form-input" />
                        </label>
                        <img src={actividadSeleccionada.imagen} alt={actividadSeleccionada.nombre_actividad} className="actividad-imagen-exp" />
                        <button className="boton-cancelar" onClick={() => setActividadSeleccionada(null)}>Cancelar</button>
                    </div>
                    <div className="actividad-derecha">
                        <label className="form-label">
                            <strong>Nombre:</strong>
                            <input
                                type="text"
                                value={actividadSeleccionada.nombre_actividad}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, nombre_actividad: e.target.value })}
                                className="form-input"
                            />
                        </label>
                        <label className="form-label">
                            <strong>Fecha:</strong>
                            <input
                                type="text"
                                value={actividadSeleccionada.fecha_actividad}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, fecha_actividad: e.target.value })}
                                className="form-input"
                            />
                        </label>

                        <label className="form-label">
                            <strong>Duración:</strong>
                            <input
                                type="number"
                                value={actividadSeleccionada.numero_horas}
                                onChange={(e) => setActividadSeleccionada({
                                    ...actividadSeleccionada,
                                    numero_horas: Number(e.target.value) // Convertir a número
                                })}
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
                        <label className="form-label">
                            <strong>Estado de la actividad:</strong>
                        </label>
                        <div className="flex flex-col space-y-2">
                            {["Disponible", "Cancelada", "Terminada"].map((estado) => (
                                <label key={estado} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="estado_actividad" // Mantén el mismo nombre para que formen un grupo
                                        value={estado} // Aquí asignamos correctamente el valor del estado
                                        checked={actividadSeleccionada.estado_actividad === estado}
                                        onChange={(e) =>
                                            setActividadSeleccionada({ ...actividadSeleccionada, estado_actividad: e.target.value })
                                        }
                                        className="form-radio"
                                    />
                                    <span>{estado}</span>
                                </label>
                            ))}
                        </div>

                        <button className="boton-guardar" onClick={() => handleSave(actividadSeleccionada)}>Guardar</button>
                    </div>
                </div>
            ) : (
                // Vista normal
                <div className="actividades-list">
                    {actividades.map((actividad) => (
                        <div key={actividad.id} className="actividad-box">
                            <img src={actividad.imagen} alt={actividad.nombre_actividad} className="actividad-imagen" />
                            <div className="actividad-info">
                                <h3>{actividad.nombre_actividad}</h3>
                                <p><strong>Organizador:</strong> {actividad.organizador}</p>
                                <p><strong>Fecha:</strong> {actividad.fecha_actividad}</p>
                                <p><strong>Estado de la Actividad: </strong> {actividad.estado_actividad}</p>
                            </div>
                            <div className="actividad-botones">
                                <button className="boton-editar" onClick={() => handleEdit(actividad)}><MdEdit /></button>
                                <button className="boton-borrar" onClick={() => handleDeleteActivity(actividad.actividad_id)}><MdDelete /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {actividadAEliminar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>¿Estás seguro de que deseas eliminar la actividad "{actividadAEliminar.nombre_actividad}"?</h3>
                        <div className="modal-buttons">
                            <button className="boton-confirmar" onClick={confirmDelete}>Sí, eliminar</button>
                            <button className="boton-cancelar" onClick={cancelDelete}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminActividades;