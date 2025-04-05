import { useState } from 'react';
import '../styles/ActividadesDisponibles.css';
import FormularioInscripcion from '../pages/InscripcionActividad';
import CardActivity from '../components/CardActivity';
import { useDashboard } from '../context/DashboardContext';
import SpinnerLoading from '../components/SpinnerLoading';

const ActividadesDisponibles = () => {
    const { userType, dataFetchBecarios, loading } = useDashboard();
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const userRole = userType;

    const handleCardClick = (actividad) => {
        setActividadSeleccionada(actividad);
    };

    const handleInscribirseClick = () => {
        setMostrarFormulario(true);
    };

    const handleCloseFormulario = () => {
        setMostrarFormulario(false);
    };

    if (mostrarFormulario && actividadSeleccionada) {
        return (
            <div className="formulario-fullscreen">
                <FormularioInscripcion
                    actividad={actividadSeleccionada}
                    onClose={handleCloseFormulario}
                />
            </div>
        );
    }

    if ( loading) return <SpinnerLoading />;

    return (
        <div className="actividades-container">
            {actividadSeleccionada ? (
                // Vista expandida
                <div className="actividad-expandida">
                    <div className='informacion-actividad'>
                        <div className="actividad-izquierda">
                            <img src={actividadSeleccionada.imagen} alt={actividadSeleccionada.nombre_actividad} className="actividad-imagen-exp" />
                            <p><strong>Fecha:</strong> {actividadSeleccionada.fecha_actividad}</p>
                            <p><strong>Organizador:</strong> {actividadSeleccionada.organizador}</p>
                            <p><strong>Horas Beca:</strong> {actividadSeleccionada.numero_horas}</p>
                            <button className="boton-volver" onClick={() => setActividadSeleccionada(null)}></button>
                        </div>
                        <div className="actividad-derecha">
                            <h3>{actividadSeleccionada.nombre_actividad} 🌟📚</h3>
                            <p>{actividadSeleccionada.descripcion}</p>
                        </div>
                    </div>
                </div>
            ) : (
                // Vista normal
                <CardActivity
                    data={dataFetchBecarios.actividades.data}
                    userType={userRole? userRole : 'becario'}
                    onClick={handleCardClick}
                />
            )}

            {actividadSeleccionada && (
                <button className="boton-inscribirse" onClick={handleInscribirseClick}>Inscribirse</button>
            )}
        </div>
    );

};

export default ActividadesDisponibles;
