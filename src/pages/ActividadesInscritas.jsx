import { useState } from "react";
import "../styles/ActividadesInscritas.css";
import { useAuth } from '../context/AuthContext';
import ActividadesCancelarInscripcion from "../services/ActividadesBecario/ActividadesCancelarInscripcion";
import { useDashboard } from '../context/DashboardContext';
import SpinnerLoading from '../components/SpinnerLoading';

const ActividadCard = ({ nombre, fechaActividad, fechaInscripcion, horasBecas, imagen, organizador, ubicacion, onCancelar, deshabilitarHover }) => {
  return (
    <div className={`cardActInscrita ${deshabilitarHover ? "deshabilitar-hover" : ""}`}>
      <img className="cardActInscrita-image" src={imagen} alt={nombre} />
      <h2 className="cardActInscrita-title">{nombre}</h2>
      <p className="cardActInscrita-organizer">Organizador: {organizador}</p>
      <p className="cardActInscrita-location">Ubicación: {ubicacion}</p>
      <p className="cardActInscrita-date-activity">Fecha de la actividad: {new Date(fechaActividad).toLocaleDateString()}</p>
      <p className="cardActInscrita-date-inscription">Fecha de inscripción: {new Date(fechaInscripcion).toLocaleDateString()}</p>
      <p className="cardActInscrita-scholar-hours">Horas beca: {horasBecas}</p>
      <button className="cardActInscrita-cancel-button" onClick={onCancelar}>
        Cancelar inscripción
      </button>
    </div>
  );
};

const ActividadesInscritas = () => {
  const { getUser } = useAuth();
  const { loading, dataFetchBecarios, refreshActInscritas } = useDashboard();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [actividadConfirmacion, setActividadConfirmacion] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  let user = getUser();

  const handleCancelarClick = (actividad) => {
    setActividadConfirmacion(actividad);
    setMostrarConfirmacion(true);
  };

  const handleCancelar = () => {
    setActividadConfirmacion(null);
    setMostrarConfirmacion(false);
    setMensajeError("");
  };

  const handleConfirmar = async () => {
    try {
      await ActividadesCancelarInscripcion(actividadConfirmacion.actividad_id, user.becario_id);

      refreshActInscritas();
      setActividadConfirmacion(null);
      setMostrarConfirmacion(false);
      setMensajeExito("¡Actividad cancelada con éxito!");
      setTimeout(() => setMensajeExito(""), 3000);
      
    } catch (error) {
      console.error("Error al cancelar la inscripción:", error);
      setMensajeError("Hubo un error al cancelar la inscripción.");
      setTimeout(() => setMensajeError(""), 3000); // Mensaje de error por 3 segundos
    }
  };

  if (loading) return <SpinnerLoading />;

  return (
    (!loading) ? (
      <div className="vista">
        {dataFetchBecarios.inscritas.data.length === 0 ? (
          <p>No hay actividades inscritas.</p>
        ) : (
          <div className={`cards-container ${mostrarConfirmacion ? "deshabilitar-hover" : ""}`}>
            {dataFetchBecarios.inscritas.data.map((actividad, index) => (
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
    ) : (
      <div className="colorful"></div>
    )
  );
};

export default ActividadesInscritas;
