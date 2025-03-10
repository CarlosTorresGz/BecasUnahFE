import React from 'react';
import '../styles/Comunicados.css';
import { FaFileAlt } from 'react-icons/fa';

const Comunicados = () => {
  const comunicados = [
    { nombre: 'Comunicado PASEE NO-3-2024', fecha: '18/10/2024 18:00:01' },
    { nombre: 'Comunicado PASEE NO-2-2024', fecha: '18/05/2024 18:00:01' },
    { nombre: 'Aviso-Seguimiento', fecha: '01/02/2024 09:30:01' },
    { nombre: 'Comunicado-Seguimiento', fecha: '18/01/2024 10:00:01' },
    { nombre: 'Convocatoria', fecha: '18/05/2024 18:00:01' },
    { nombre: 'Comunicado PASEE NO-4-2023', fecha: '18/11/2023 15:00:01' },
  ];

  const convocatorias = [
    { nombre: 'Comunicado PASEE NO-3-2024', fecha: '18/10/2024 18:00:01' },
    { nombre: 'Comunicado PASEE NO-2-2024', fecha: '18/05/2024 18:00:01' },
    { nombre: 'Aviso-Seguimiento', fecha: '01/02/2024 09:30:01' },
    { nombre: 'Comunicado-Seguimiento', fecha: '18/01/2024 10:00:01' },
    { nombre: 'Comunicado PASEE NO-4-2023', fecha: '18/11/2023 15:00:01' },
  ];

  const circulares = [
    { nombre: 'Circular-VOAE-No-001', fecha: '17/01/2024 14:12:01' },
  ];

  return (
    <div className="comunicados-container">
      <h2>Comunicados</h2>
      <table className="comunicados-table">
        <thead>
          <tr>
            <th>Nombre del Documento</th>
            <th>Información</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {comunicados.map((comunicado, index) => (
            <tr key={index}>
              <td><FaFileAlt /> {comunicado.nombre}</td>
              <td>{comunicado.fecha}</td>
              <td><button className="download-button">Descargar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Convocatoria</h2>
      <table className="convocatoria-table">
        <thead>
          <tr>
            <th>Nombre del Documento</th>
            <th>Información</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {convocatorias.map((convocatoria, index) => (
            <tr key={index}>
              <td><FaFileAlt /> {convocatoria.nombre}</td>
              <td>{convocatoria.fecha}</td>
              <td><button className="download-button">Descargar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Circulares</h2>
      <table className="circulares-table">
        <thead>
          <tr>
            <th>Nombre del Documento</th>
            <th>Información</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {circulares.map((circular, index) => (
            <tr key={index}>
              <td><FaFileAlt /> {circular.nombre}</td>
              <td>{circular.fecha}</td>
              <td><button className="download-button">Descargar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Comunicados;