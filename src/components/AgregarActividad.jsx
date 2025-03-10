import React, { useState } from 'react';
import '../styles/AgregarActividad.css';
import { MdCheckCircle } from "react-icons/md"; // Importa el icono

const AgregarActividad = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [horasBeca, setHorasBeca] = useState('');
  const [foto, setFoto] = useState(null);
  const [organizador, setOrganizador] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar la nueva actividad
    console.log({
      nombre,
      descripcion,
      fecha,
      horasBeca,
      foto,
      organizador
    });

    // Mostrar mensaje de éxito
    setMensajeExito(true);

    // Limpiar los campos del formulario
    setNombre('');
    setDescripcion('');
    setFecha('');
    setHorasBeca('');
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
          <label htmlFor="foto">Foto</label>
          <input
            type="file"
            id="foto"
            onChange={(e) => setFoto(e.target.files[0])}
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