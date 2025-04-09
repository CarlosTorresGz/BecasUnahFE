import { useState, useEffect } from 'react';
import '../styles/AgregarActividad.css';
import { uploadImageToAzure } from '../util/uploadPictureAzure';
import saveActivities from '../services/ActividadesAdministrador/saveActivities';
import { toast } from 'sonner';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const AgregarActividad = () => {
  const { getUser } = useAuth();
  const { dataFetch, refreshData } = useDashboard();
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horasBeca, setHorasBeca] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [foto, setFoto] = useState(null);
  const [organizador, setOrganizador] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [fecha, setFecha] = useState();

  let user = getUser();

  const today = new Date();
  today.setDate(today.getDate() - 1);
  const previousDay = today.toISOString().split("T")[0];

  useEffect(() => {
    if (Array.isArray(dataFetch.actividades.data)) {
      const existeActividad = dataFetch.actividades.data.some(
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
  }, [nombre, dataFetch.actividades]);

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
      organizador: organizador,
      centro_id: parseInt(user.centro_id)
    };

    const result = await saveActivities(nuevaActividad);
    if (result.state) {
      refreshData();
      setNombre('');
      setDescripcion('');
      setFecha('');
      setHorasBeca('');
      setUbicacion('');
      setFoto(null);
      setOrganizador('');
      setMostrarConfirmacion(false);

      toast.success(result.body.message);

    } else {
      toast.error(result.body);
    }

  };

  const cancelarGuardar = () => {
    setMostrarConfirmacion(false);
  };

  return (
    <div className="agregar-actividad">
      <h2 className='agregar-actividad-title'>Agregar Nueva Actividad</h2>
      {mostrarConfirmacion && (
        <Modal
          isOpen={mostrarConfirmacion}
          type="save"
          title="Confirmar nueva actividad"
          onConfirm={confirmarGuardar}
          onCancel={cancelarGuardar}
        >
          <p>{`¿Estás seguro de que deseas guardar la siguiente actividad: `}<strong>{nombre}</strong>?</p>
        </Modal>
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
        {/*Pendiente: Habria que deshabilitador el boton si el nombre de la actividad esta vacio */}
        <div className={`form-group ${!nombre ? "disabled" : ""}`}>
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

export default AgregarActividad;
