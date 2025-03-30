import { useState, useEffect } from 'react';
import '../styles/AdminActividades.css';
import '../styles/ActividadesDisponibles.css';
import updateActividad from '../services/ActividadesAdministrador/updateActividad';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { handleDelete } from '../services/ActividadesAdministrador/deleteActividad';
import { uploadImageToAzure } from '../util/uploadPictureAzure';
import CardActivity from '../components/CardActivity';
import { activityPropTypes } from "../util/propTypes";
import fetchAllData from '../services/ActividadesAdministrador/ActividadesAdminAPI';
import { deletePictureAzure } from '../util/deletePictureAzure';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
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
    if (partes[1]?.length === 2) {
        return fecha;
    }
    const [anio, mesTexto, dia] = partes;
    const mes = meses[mesTexto];
    if (!mes) return fecha;

    return `${anio}-${mes}-${dia}`;
};

const AdminActividades = () => {
    const { user } = useAuth();
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [actividadAEliminar, setActividadAEliminar] = useState(null);
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState(null);
    const userRole = localStorage.getItem('userRole');
    
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const previousDay = today.toISOString().split("T")[0];

    useEffect(() => {
        const loadActividades = async () => {
            try {
                const dataFetch = await fetchAllData();
                setActividades(dataFetch.actividades);
            } catch (error) {
                toast.error(`Error al cargar las actividades: ${error}`);
            }
        };
        loadActividades();
    }, []);

    const cancelDelete = () => {
        setActividadAEliminar(null);
    };

    const handleDeleteActivity = (id) => {
        setActividadAEliminar(actividades.find(actividad => actividad.actividad_id === id));
    };

    const confirmDelete = async () => {
        const actividadId = actividadAEliminar.actividad_id;
        const empleadoId = user.empleado_id.trim();
        const urlImagen = actividadAEliminar.imagen;

        //Eliminar imagen
        const cleanUrl = urlImagen.split('?')[0];
        const blobName = decodeURIComponent(cleanUrl.split('/').pop());

        await deletePictureAzure(blobName);
        const deleteActividad = await handleDelete({ empleado_id: empleadoId, actividad_id: actividadId });

        if (deleteActividad.state) {
            setActividades(actividades.filter(actividad => actividad.actividad_id !== actividadAEliminar.actividad_id));
            setMensajeConfirmacion(`La actividad "${actividadAEliminar.nombre_actividad}" ha sido eliminada correctamente.`);
            setActividadAEliminar(null);

            setTimeout(() => setMensajeConfirmacion(""), 6000);

        } else {
            toast.error('Error al eliminar la actividad.');
        }
    };

    const handleEdit = (actividad) => {
        setActividadSeleccionada(actividad);
    };

    const handleSave = async (actividadEditada) => {
        actividadEditada.fecha_actividad = formatDate(actividadEditada.fecha_actividad);

        const response = await updateActividad(actividadEditada);
        console.log('response: ', response);
        if (response.state) {
            toast.success(`${response.body}`);
            setActividadSeleccionada(null);

            const actividadesActualizadas = actividades.map((actividad) =>
                actividad.actividad_id === actividadEditada.actividad_id ? actividadEditada : actividad
            );
            setActividades(actividadesActualizadas);

        } else {
            toast.error('Hubo un error al actualizar la actividad.');
        }
    };

    const handleChangeImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const nombreActividad = actividadSeleccionada.nombre_actividad;

            try {
                const imageUrl = await uploadImageToAzure(file, nombreActividad);
                setActividadSeleccionada((prev) => ({ ...prev, imagen: imageUrl }));
                toast.success('Imagen subida con éxito.');
            } catch (error) {
                console.log('Error al subir la imagen. ', error);
                toast.error('Error al subir la imagen.');
            }
        };
    };

    return (
        <div className="actividades-container">
            {mensajeConfirmacion && (
                <div className="mensaje-confirmacion">
                    {mensajeConfirmacion}
                </div>
            )}
            {actividadSeleccionada ? (
                <div className="actividad-expandida">
                    <div className='informacion-actividad'>
                        <div className="actividad-izquierda">
                            <img src={actividadSeleccionada.imagen} alt={actividadSeleccionada.nombre_actividad} className="actividad-imagen-exp" />
                            <label className="form-label">
                                <strong>Cambiar imagen:</strong>
                                <input type="file" onChange={handleChangeImage} className="form-input" />
                            </label>
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
                                    min={previousDay}
                                    max={new Date(new Date(actividadSeleccionada.fecha_actividad).setFullYear(new Date(actividadSeleccionada.fecha_actividad).getFullYear() + 1))
                                        .toISOString()
                                        .split("T")[0]}
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
                                        numero_horas: Number(e.target.value)
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
                            <div className="radio-inputs">
                                {["Disponible", "Cancelada", "Terminada"].map((estado) => (
                                    <label key={estado} className="radio">
                                        <input
                                            type="radio"
                                            name="estado_actividad"
                                            value={estado}
                                            checked={actividadSeleccionada.estado_actividad === estado}
                                            onChange={(e) =>
                                                setActividadSeleccionada({ ...actividadSeleccionada, estado_actividad: e.target.value })
                                            }
                                        />
                                        <span className='name'>{estado}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='actividad-button'>
                        <button className="boton-cancelar" onClick={() => setActividadSeleccionada(null)}>Cancelar</button>
                        <button className="boton-guardar" onClick={() => handleSave(actividadSeleccionada)}>Guardar</button>
                    </div>
                </div>
            ) : (
                <CardActivity
                    data={actividades}
                    userType={userRole ? userRole : 'admin'}
                    handleEdit={handleEdit}
                    handleDeleteActivity={handleDeleteActivity}
                />
            )}

            {actividadAEliminar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{`¿Estás seguro de que deseas eliminar la siguiente actividad: `}<strong>{actividadAEliminar.nombre_actividad}</strong>?</h3>
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

AdminActividades.propTypes = activityPropTypes;
export default AdminActividades;
