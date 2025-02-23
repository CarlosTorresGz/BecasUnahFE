import React, { useState } from 'react';
import '../styles/ActividadesDisponibles.css';



const ActividadesDisponibles = ({ data }) => {
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    
    return (
        <div className="actividades-container">
            {actividadSeleccionada ? (
                // Vista expandida
                <div className="actividad-expandida">
                    <div className="actividad-izquierda">
                        <img src={actividadSeleccionada.imagen} alt={actividadSeleccionada.nombre_actividad} className="actividad-imagen-exp" />
                        <p><strong>Fecha:</strong> {actividadSeleccionada.fecha_actividad}</p>
                        <p><strong>Organizador:</strong> {actividadSeleccionada.organizador}</p>
                        <p><strong>numero_horas:</strong> {actividadSeleccionada.numero_horas}</p>
                        {/* <p><strong>Idioma:</strong> {actividadSeleccionada.idioma}</p> */}
                        <button className="boton-volver" onClick={() => setActividadSeleccionada(null)}></button>
                    </div>
                    <div className="actividad-derecha">
                        <h3>{actividadSeleccionada.nombre_actividad} 🌟📚</h3>
                        <p>{actividadSeleccionada.descripcion}</p>
                    </div>
                </div>
            ) : (
                // Vista normal
                <div className="actividades-list">
                    {data.map((actividad) => (
                        <div key={actividad.id} className="actividad-box" onClick={() => setActividadSeleccionada(actividad)}>
                            <img src={actividad.imagen} alt={actividad.nombre_actividad} className="actividad-imagen" />
                            <div className="actividad-info">
                                <h3>{actividad.nombre_actividad}</h3>
                                <p><strong>Organizador:</strong> {actividad.organizador}</p>
                                <p><strong>Fecha:</strong> {actividad.fecha_actividad}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {actividadSeleccionada && (
                <button className="boton-inscribirse">Inscribirse</button>
            )}
        </div>
    );
    
};

export default ActividadesDisponibles;
