import { useState, useMemo } from 'react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const actividades = useMemo(() => {
        return dataFetchBecarios?.actividades?.data || [];
    }, [dataFetchBecarios]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = actividades.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(actividades.length / itemsPerPage);
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

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

    if (loading) return <SpinnerLoading />;
    if (actividades.length === 0) return <div className="no-activities">No hay actividades disponibles actualmente</div>;

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
                <>
                    <CardActivity
                        data={currentData}
                        userType={userRole ? userRole : 'becario'}
                        onClick={handleCardClick}
                    />
                    {/* Botones de Paginación */}
                    <div className="pagination">
                        {pageNumbers.map(page => (
                            <button
                                className={`pagination-button ${page === currentPage ? 'pagination-button-active' : ''}`}
                                key={page}
                                onClick={() => paginate(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {actividadSeleccionada && (
                <button className="boton-inscribirse" onClick={handleInscribirseClick}>Inscribirse</button>
            )}
        </div>
    );

};

export default ActividadesDisponibles;
