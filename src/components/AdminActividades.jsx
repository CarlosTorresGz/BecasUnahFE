import { useState } from 'react';
import '../styles/AdminActividades.css';
import { MdEdit, MdDelete } from 'react-icons/md';
import updateActividad from '../services/updateActividad';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { handleDelete } from '../services/deleteActividad';
import { uploadImageToAzure } from '../services/uploadPictureAzure';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegura que tenga dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Asegura que tenga dos dígitos
    return `${year}-${month}-${day}`;
};

const convertirFecha = (fecha) => {
    if (!fecha) return '';
    const meses = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    };
    const partes = fecha.split('-');
    // Si ya está en formato numérico (yyyy-MM-dd)
    if (partes[1]?.length === 2) {
        return fecha;
    }
    const [anio, mesTexto, dia] = partes;
    const mes = meses[mesTexto];
    // Si el mes no existe en el objeto, devuelve la fecha original
    if (!mes) return fecha;

    return `${anio}-${mes}-${dia}`;
};

const AdminActividades = ({ data }) => {
    const { user } = useAuth();
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null); //abrir o cerrar una actividad
    const [actividades, setActividades] = useState(data); //todas las actividades
    const [actividadAEliminar, setActividadAEliminar] = useState(null); //actividad a eliminar
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
        console.log('actividadEditada: ', actividadEditada)
        //setActividadSeleccionada(actividadEditada)
        // Formatear la fecha correctamente
        actividadEditada.fecha_actividad = formatDate(actividadEditada.fecha_actividad);

        const response = updateActividad(actividadEditada);
        if (response) {
            toast.success('Actividad actualizada con éxito!');
            setActividadSeleccionada(null)

            const actividadesActualizadas = actividades.map((actividad) =>
                actividad.actividad_id === actividadEditada.actividad_id ? actividadEditada : actividad
            );
            setActividades(actividadesActualizadas);

        } else {
            toast.error('Hubo un error al actualizar la actividad.');
        }

    };

    const handleChangeImage = async (e) => {
        const file = e.target.files[0]; // Obtener el archivo seleccionado
        console.log('file: ', file);

        if (file) {
            //subir a Azure Storage
            try {
                const imageUrl = await uploadImageToAzure(file);
                console.log('imageUrl: ', imageUrl)
                setActividadSeleccionada((prev) => ({ ...prev, imagen: imageUrl }));
                console.log('Imagen subida con éxito.');
                toast.success('Imagen subida con éxito.');
            } catch (error) {
                console.log('Error al subir la imagen. ', error);
            }
        };
    }

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
                                type="date"
                                value={convertirFecha(actividadSeleccionada.fecha_actividad)}
                                onChange={(e) => setActividadSeleccionada({ ...actividadSeleccionada, fecha_actividad: e.target.value })}
                                className="form-input"
                            />
                        </label>

                        <label className="form-label">
                            <strong>Horas Beca:</strong>
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
