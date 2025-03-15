import { useEffect, useState } from 'react';
import '../styles/Comunicados.css';
import { FaFileAlt } from 'react-icons/fa';
import fetchAllData from '../services/afichesData';

const Comunicados = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    // Llamar la función fetchAllData para obtener los datos
    const fetchData = async () => {
      try {
        const fetchedData = await fetchAllData();
        const groupedDataByCategory = {};

        // Recorre las claves de la respuesta y agrupa los documentos por categoría
        Object.keys(fetchedData).forEach((key) => {
          const categoryItems = fetchedData[key];
          categoryItems.forEach(item => {
            const categoria = item.nombre_categoria;
            if (!groupedDataByCategory[categoria]) {
              groupedDataByCategory[categoria] = [];
            }
            groupedDataByCategory[categoria].push(item);
          });
        });

        // Establecer el estado con los datos agrupados
        setData(groupedDataByCategory);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="comunicados-container">
      {/* Recorre las categorías y genera una tabla por cada una */}
      {Object.entries(data).map(([categoria, documentos], index) => (
        documentos.length > 0 && (
          <div key={index}>
            <h1>{categoria}</h1>
            <table className="comunicados-table">
              <thead>
                <tr>
                  <th style={{width: '60%', textAlign: 'center'}}>Nombre del Documento</th>
                  <th style={{textAlign: 'center'}}>Información</th>
                  <th style={{textAlign: 'center'}}>Enlace</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((documento, idx) => (
                  <tr key={idx}>
                    <td><FaFileAlt /> {documento.nombre_afiche}</td>
                    <td style={{textAlign: 'center'}}>{documento.fecha_actividad}</td>
                    <td style={{textAlign: 'center'}}>
                      <a href={documento.url_afiche} 
                        className="download-button" target="_blank" 
                        rel="noopener noreferrer">
                        Descargar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ))}
    </div>
  );
};

export default Comunicados;
