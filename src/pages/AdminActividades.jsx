import { useState } from 'react';
import '../styles/AdminActividades.css';
import '../styles/ActividadesDisponibles.css';
import updateActividad from '../services/ActividadesAdministrador/updateActividad';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { handleDelete } from '../services/ActividadesAdministrador/deleteActividad';
import { uploadImageToAzure } from '../util/uploadPictureAzure';
import CardActivity from '../components/CardActivity';
import { deletePictureAzure } from '../util/deletePictureAzure';
import { useDashboard } from '../context/DashboardContext';
import SpinnerLoading from '../components/SpinnerLoading';
import Modal from '../components/Modal';

const AdminActividades = () => {
    const { userType, dataFetch, loading, refreshData, error } = useDashboard();
    const { getUser } = useAuth();
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [actividadAEliminar, setActividadAEliminar] = useState(null);
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState(null);

    let user = getUser();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const previousDay = today.toISOString().split("T")[0];

    const cancelDelete = () => {
        setActividadAEliminar(null);
    };

    const handleDeleteActivity = (id) => {
        setActividadAEliminar(dataFetch.actividades.data.find(actividad => actividad.actividad_id === id));
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
            setMensajeConfirmacion(`La actividad "${actividadAEliminar.nombre_actividad}" ha sido eliminada correctamente.`);
            setActividadAEliminar(null);

            setTimeout(() => setMensajeConfirmacion(""), 6000);
            refreshData();
        } else {
            toast.error('Error al eliminar la actividad.');
        }
    };

    const handleEdit = (actividad) => {
        setActividadSeleccionada(actividad);
    };

    const handleSave = async (actividadEditada) => {
        try {
            const response = await updateActividad(actividadEditada);
            if (response.state) {
                toast.success(`${response.body}`);
                setActividadSeleccionada(null);
                await refreshData();
            } else {
                toast.error(`${response.body}`);
            }
        } catch (error) {
            console.error('Error al obtener actividades:', error);
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

    if (loading) return <SpinnerLoading />;
    if (error) return <div>Error: {error}</div>;

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
                                    value={actividadSeleccionada.fecha_actividad}
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
                    data={dataFetch.actividades.data}
                    userType={userType ? userType : 'admin'}
                    handleEdit={handleEdit}
                    handleDeleteActivity={handleDeleteActivity}
                />
            )}

            {actividadAEliminar && (
                <>
                    <Modal
                        isOpen={actividadAEliminar}
                        title="¿Eliminar Actividad?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    >
                        <p>{`¿Estás seguro de que deseas eliminar la siguiente actividad: `}<strong>{actividadAEliminar.nombre_actividad}</strong>?</p>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default AdminActividades;
