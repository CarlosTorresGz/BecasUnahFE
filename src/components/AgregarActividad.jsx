import React, { useState } from 'react';
import '../styles/AgregarActividad.css';
import { MdCheckCircle } from "react-icons/md"; // Importa el icono
import { uploadImageToAzure } from '../services/uploadPictureAzure';
import saveActivities from '../services/updateActividad';
import { toast } from 'sonner';


const AgregarActividad = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [horasBeca, setHorasBeca] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [foto, setFoto] = useState(null);
  const [organizador, setOrganizador] = useState('');
  const [estado_actividad, setEstado_actividad] = useState('Disponible');  
  const [mensajeExito, setMensajeExito] = useState(false);

  
  const handleChangeImage = async (e) => {
    const file = e.target.files[0]; // Obtener el archivo seleccionado

    if (file) {
        //subir a Azure Storage
        try {
            const imageUrl = await uploadImageToAzure(file); 
            console.log(imageUrl);        
            toast.success('Imagen subida con éxito.');
            setFoto(imageUrl);
        } catch (error) {
            console.log('Error al subir la imagen. ', error);
            toast.error('Error al subir la imagen.');
        }
    };
}
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para guardar la nueva actividad
    const nuevaActividad = {
      nombre_actividad: nombre,
      descripcion: descripcion,
      fecha_actividad: fecha,
      numero_horas: parseInt(horasBeca),
      ubicacion: ubicacion,
      imagen: foto, // La URL de la imagen subida
      estado_actividad: 'Disponible',
      organizador: organizador

  };

    await saveActivities(nuevaActividad);

    // Mostrar mensaje de éxito
    setMensajeExito(true);

    // Limpiar los campos del formulario
    setNombre('');
    setDescripcion('');
    setFecha('');
    setHorasBeca('');
    setUbicacion('');
    setFoto(null);
    setOrganizador('');

    // Ocultar el mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setMensajeExito(false);
    }, 3000);
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
            onChange={handleChangeImage} //tiene la url esta funcion
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
        <button type="submit" className="boton-guardar">Guardar</button>
      </form>
    </div>
  );
};

export default AgregarActividad;