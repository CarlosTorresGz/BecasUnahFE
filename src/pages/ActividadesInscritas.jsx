import { useState } from "react";
import "../styles/ActividadesInscritas.css";
import { useAuth } from '../context/AuthContext';
import ActividadesCancelarInscripcion from "../services/ActividadesBecario/ActividadesCancelarInscripcion";
import { useDashboard } from '../context/DashboardContext';
import SpinnerLoading from '../components/SpinnerLoading';
import Modal from '../components/Modal';
import { CardActInscritaPropTypes } from "../util/propTypes";

const ActividadCard = ({ nombre, fechaActividad, fechaInscripcion, horasBecas, imagen, organizador, ubicacion, onCancelar, deshabilitarHover }) => {
  return (
    <div className={`card-act-inscrita ${deshabilitarHover ? "deshabilitar-hover" : ""}`}>
      <img className="card-act-inscrita-image" src={imagen} alt={nombre} />
      <h2 className="card-act-inscrita-title">{nombre}</h2>
      <p className="card-act-inscrita-organizer">Organizador: {organizador}</p>
      <p className="card-act-inscrita-location">Ubicación: {ubicacion}</p>
      <p className="card-act-inscrita-date-activity">Fecha de la actividad: {new Date(fechaActividad).toLocaleDateString()}</p>
      <p className="card-act-inscrita-date-inscription">Fecha de inscripción: {new Date(fechaInscripcion).toLocaleDateString()}</p>
      <p className="card-act-inscrita-scholar-hours">Horas beca: {horasBecas}</p>
      <button className="card-act-inscrita-cancel-button" onClick={onCancelar}>
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
          <Modal
            isOpen={mostrarConfirmacion}
            title="¿Cancelar inscripción?"
            onConfirm={handleConfirmar}
            onCancel={handleCancelar}
          >
            <p>¿Estás seguro de cancelar la actividad inscrita: <strong>{actividadConfirmacion.nombre_actividad}</strong>?</p>
          </Modal>
        )}

        {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
        {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
      </div>
    ) : (
      <div className="colorful"></div>
    )
  );
};

ActividadCard.propTypes = CardActInscritaPropTypes;
export default ActividadesInscritas;
