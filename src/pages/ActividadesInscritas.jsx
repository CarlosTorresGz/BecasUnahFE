import React, { useState } from "react";
import imgVOAE from "../img/VOAE2.jpg"; // Ruta de la imagen
import "../styles/ActividadesInscritas.css";

const ActividadCard = ({ nombre, fechaActividad, fechaInscripcion, horasBecas, onCancelar, deshabilitarHover }) => {
  return (
    <div className={`card ${deshabilitarHover ? "deshabilitar-hover" : ""}`}>
      <img className="card-image" src={imgVOAE} alt={nombre} />
      <h2 className="card-title">{nombre}</h2>
      <p className="card-date-activity">Fecha de la actividad: {fechaActividad}</p>
      <p className="card-date-inscription">Fecha de inscripción: {fechaInscripcion}</p>
      <p className="card-scholar-hours">Horas becas: {horasBecas}</p>
      <button className="card-cancel-button" onClick={onCancelar}>
        Cancelar inscripción
      </button>
    </div>
  );
};

const ActividadesInscritas = () => {
  const [actividades, setActividades] = useState([
    {
      id: 1,
      nombre: "Taller de Primeros Auxilios",
      fechaActividad: "2025-09-13",
      fechaInscripcion: "2025-09-01",
      horasBecas: "2 horas",
    },
    {
      id: 2,
      nombre: "Charla sobre Energías Renovables",
      fechaActividad: "2025-03-24",
      fechaInscripcion: "2025-03-01",
      horasBecas: "3 horas",
    },
    {
      id: 3,
      nombre: "Jornada de Limpieza",
      fechaActividad: "2024-03-28",
      fechaInscripcion: "2024-03-10",
      horasBecas: "4 horas",
    },
    {
      id: 4,
      nombre: "Taller de Desarrollo Personal",
      fechaActividad: "2025-05-10",
      fechaInscripcion: "2025-04-20",
      horasBecas: "5 horas",
    },
  ]);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [actividadConfirmacion, setActividadConfirmacion] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  // Función para activar el cuadro de confirmación
  const handleCancelarClick = (actividad) => {
    setActividadConfirmacion(actividad); // Guarda la actividad seleccionada
    setMostrarConfirmacion(true); // Muestra el cuadro de confirmación
  };

  // Función para confirmar y eliminar la actividad
  const handleConfirmar = () => {
    setActividades((prevActividades) =>
      prevActividades.filter((actividad) => actividad.id !== actividadConfirmacion.id)
    );
    setActividadConfirmacion(null); // Limpia la actividad seleccionada
    setMostrarConfirmacion(false); // Oculta el cuadro de confirmación
    setMensajeExito("¡Actividad cancelada con éxito!");
    setTimeout(() => setMensajeExito(""), 3000); // Oculta el mensaje de éxito después de 3 segundos
  };

  // Función para cancelar el cuadro de confirmación
  const handleCancelar = () => {
    setActividadConfirmacion(null);
    setMostrarConfirmacion(false); // Oculta el cuadro de confirmación
  };

  return (
    <div className="vista">
      <div className={`cards-container ${mostrarConfirmacion ? "deshabilitar-hover" : ""}`}>
        {actividades.map((actividad) => (
          <ActividadCard
            key={actividad.id}
            {...actividad}
            deshabilitarHover={mostrarConfirmacion}
            onCancelar={() => handleCancelarClick(actividad)}
          />
        ))}
      </div>

      {mostrarConfirmacion && (
        <div className="confirmacion-global">
          <div className="confirmacion">
            <p>¿Estás seguro de cancelar la actividad inscrita?</p>
            <div className="confirmacion-botones">
              <button className="confirm-button" onClick={handleConfirmar}>
                Sí
              </button>
              <button className="cancel-button" onClick={handleCancelar}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
    </div>
  );
};

export default ActividadesInscritas;
