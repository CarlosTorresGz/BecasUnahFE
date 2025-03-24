import React, { useState, useEffect } from "react";
import "../styles/ActividadesInscritas.css";
import ActividadesInscritasData from "../services/ActividadesInscritasBecario";
import { useAuth } from '../context/AuthContext';
import ActividadesCancelarInscripcion from "../services/ActividadesCancelarInscripcion";

const ActividadCard = ({ nombre, fechaActividad, fechaInscripcion, horasBecas, imagen, organizador, ubicacion, onCancelar, deshabilitarHover }) => {
  return (
    <div className={`card ${deshabilitarHover ? "deshabilitar-hover" : ""}`}>
      <img className="card-image" src={imagen} alt={nombre} />
      <h2 className="card-title">{nombre}</h2>
      <p className="card-organizer">Organizador: {organizador}</p>
      <p className="card-location">Ubicación: {ubicacion}</p>
      <p className="card-date-activity">Fecha de la actividad: {new Date(fechaActividad).toLocaleDateString()}</p>
      <p className="card-date-inscription">Fecha de inscripción: {new Date(fechaInscripcion).toLocaleDateString()}</p>
      <p className="card-scholar-hours">Horas beca: {horasBecas}</p>
      <button className="card-cancel-button" onClick={onCancelar}>
        Cancelar inscripción
      </button>
    </div>
  );
};

const ActividadesInscritas = () => {
  const { user } = useAuth();
  const [actividades, setActividades] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [actividadConfirmacion, setActividadConfirmacion] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    const loadActividades = async () => {
      try {
        if (user?.no_cuenta) {
          const ActividadesIncrito = await ActividadesInscritasData(user.no_cuenta);
          console.log("Respuesta de la API:", ActividadesIncrito);
          setActividades(ActividadesIncrito.actividades);
        }
      } catch (error) {
        console.error("Error al cargar las actividades:", error);
      }
    };

    loadActividades();
  }, [user?.no_cuenta]);  // Recargar cuando cambia el usuario

  const handleCancelarClick = (actividad) => {
    setActividadConfirmacion(actividad);
    setMostrarConfirmacion(true);
  };

  const handleCancelar = () => {

    setActividadConfirmacion(null);
    setMostrarConfirmacion(false);
    setMensajeError(""); // Limpiar mensaje de error si se cierra la confirmación
  };

  const handleConfirmar = async () => {
    try {
      // Llamada al servicio para cancelar la inscripción en la base de datos
      console.log("actividad Id es: ",actividadConfirmacion.actividad_id)
      await ActividadesCancelarInscripcion(actividadConfirmacion.actividad_id, user.becario_id);
      
      // Eliminar la actividad de la lista local si la cancelación fue exitosa
      setActividades((prevActividades) =>
        prevActividades.filter((actividad) => actividad.nombre_actividad !== actividadConfirmacion.nombre_actividad)
      );
      
      setActividadConfirmacion(null);
      setMostrarConfirmacion(false);
      setMensajeExito("¡Actividad cancelada con éxito!");
      setTimeout(() => setMensajeExito(""), 3000); // Mensaje de éxito por 3 segundos
    } catch (error) {
      console.error("Error al cancelar la inscripción:", error);
      setMensajeError("Hubo un error al cancelar la inscripción.");
      setTimeout(() => setMensajeError(""), 3000); // Mensaje de error por 3 segundos
    }
  };

  return (
    <div className="vista">
      {actividades.length === 0 ? (  // Condición para cuando no hay actividades
        <p>No tienes actividades inscritas.</p>
      ) : (
        <div className={`cards-container ${mostrarConfirmacion ? "deshabilitar-hover" : ""}`}>
          {actividades.map((actividad, index) => (
            <ActividadCard
              key={index}
              nombre={actividad.nombre_actividad}
              fechaActividad={actividad.fecha_actividad}
              fechaInscripcion={actividad.fecha_inscripcion}
              horasBecas={actividad.numero_horas}
              imagen={actividad.imagen}
              organizador={actividad.organizador}
              ubicacion={actividad.ubicacion}
              deshabilitarHover={mostrarConfirmacion}
              onCancelar={() => handleCancelarClick(actividad)}
            />
          ))}
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="confirmacion-global">
          <div className="confirmacion">
            <p>¿Estás seguro de cancelar la actividad inscrita: <strong>{actividadConfirmacion.nombre_actividad}</strong>?</p>
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
      {mensajeError && <div className="mensaje-error">{mensajeError}</div>} {/* Mostrar mensaje de error */}
    </div>
  );
};

export default ActividadesInscritas;
