import { useState, useEffect } from 'react';
import '../styles/AgregarActividad.css';
import { MdCheckCircle } from "react-icons/md";
import { uploadImageToAzure } from '../services/uploadPictureAzure';
import saveActivities from '../services/updateActividad';
import { toast } from 'sonner';
import { activityPropTypes } from "../util/propTypes";

const AgregarActividad = ({ data }) => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horasBeca, setHorasBeca] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [foto, setFoto] = useState(null);
  const [organizador, setOrganizador] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [fecha, setFecha] = useState();

  const today = new Date();
  // Restar un día por defecto le quita un dia si hora de otro pais
  today.setDate(today.getDate() - 1);
  // Convertir a formato YYYY-MM-DD
  const previousDay = today.toISOString().split("T")[0];

  useEffect(() => {
    if (Array.isArray(data)) {
      setActividades(data);
    }
  }, [data]);

  useEffect(() => {
    if (Array.isArray(actividades)) {
      const existeActividad = actividades.some(
        (actividad) => actividad.nombre_actividad.trim().toLowerCase() === nombre.trim().toLowerCase()
      );
      if (existeActividad) {
        setError('¡El nombre de la actividad ya existe!');
        setIsDisabled(true);
      } else {
        setError('');
        setIsDisabled(false);
      }
    }
  }, [nombre, actividades]);

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const nombreActividad = nombre;

      try {
        const imageUrl = await uploadImageToAzure(file, nombreActividad);
        console.log(imageUrl);
        toast.success('Imagen subida con éxito.');
        setFoto(imageUrl);
      } catch (error) {
        console.log('Error al subir la imagen. ', error);
        toast.error('Error al subir la imagen.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMostrarConfirmacion(true);
  };

  const confirmarGuardar = async () => {
    const nuevaActividad = {
      nombre_actividad: nombre,
      descripcion: descripcion,
      fecha_actividad: fecha,
      numero_horas: parseInt(horasBeca),
      ubicacion: ubicacion,
      imagen: foto,
      estado_actividad: 'Disponible',
      organizador: organizador
    };

    await saveActivities(nuevaActividad);
    setActividades((prevActividades) => [...prevActividades, nuevaActividad]);

    setMensajeExito(true);
    setNombre('');
    setDescripcion('');
    setFecha('');
    setHorasBeca('');
    setUbicacion('');
    setFoto(null);
    setOrganizador('');

    setTimeout(() => {
      setMensajeExito(false);
    }, 3000);

    setMostrarConfirmacion(false); // Cerrar la confirmación
  };

  const cancelarGuardar = () => {
    setMostrarConfirmacion(false); // Cerrar la confirmación sin guardar
  };

  return (
    <div className="agregar-actividad">
      <h2>Agregar Nueva Actividad</h2>
      {mensajeExito && (
        <div className="notificacion-exito">
          <MdCheckCircle className="icono" />
          <p>Actividad guardada con éxito</p>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Estás seguro de que deseas guardar la actividad?</h3>
            <div className="modal-buttons">
              <button className="boton-guardar" onClick={confirmarGuardar}>Sí, guardar</button>
              <button className="boton-cancelar" onClick={cancelarGuardar}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la actividad</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            min={previousDay}
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1.5))
              .toISOString()
              .split("T")[0]}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="horasBeca">Horas Becas</label>
          <input
            type="text"
            id="horasBeca"
            value={horasBeca}
            onChange={(e) => setHorasBeca(e.target.value)}
            pattern="\d*"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ubicacion">Ubicacion</label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="foto">Foto</label>
          <input
            type="file"
            id="foto"
            onChange={handleChangeImage}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="organizador">Organizador</label>
          <input
            type="text"
            id="organizador"
            value={organizador}
            onChange={(e) => setOrganizador(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="boton-guardar" disabled={isDisabled}>
          Guardar
        </button>
      </form>
    </div>
  );
};

AgregarActividad.propTypes = activityPropTypes;
export default AgregarActividad;
