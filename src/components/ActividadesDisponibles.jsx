import React, { useState } from 'react';
import '../styles/ActividadesDisponibles.css'; // Asegúrate de tener este archivo para los estilos



const ActividadesDisponibles = ({ data }) => {
    const [actividades] = useState(data || []);

    return (
        <div className="actividades-container">
            <div className="actividades-list">
                {actividades.length === 0 ? (
                    <p>No hay actividades disponibles</p>
                ) : (
                    actividades.map((actividad) => (
                        <div key={actividad.id} className="actividad-box">
                            <img src={actividad.imagen} alt={actividad.nombre} className="actividad-imagen" />
                            <div className="actividad-info">
                                <h3>{actividad.nombre}</h3>
                                <p><strong>Organizador:</strong> {actividad.organizador}</p>
                                <p><strong>Fecha:</strong> {actividad.fecha}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
    
};

export default ActividadesDisponibles;
