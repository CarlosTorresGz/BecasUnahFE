import React, { useState } from 'react';
import { useEffect } from "react";
import '../styles/ActividadesDisponibles.css';
import FormularioInscripcion from './Inscripcion';

const ActividadesDisponibles = ({ data }) => {
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

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
                <div className="actividades-list">
                    {data.map((actividad) => (
                        <div key={actividad.actividad_id} className="actividad-box" onClick={() => setActividadSeleccionada(actividad)}>
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
                <button className="boton-inscribirse" onClick={handleInscribirseClick}>Inscribirse</button>
            )}
        </div>
    );

};

export default ActividadesDisponibles;
