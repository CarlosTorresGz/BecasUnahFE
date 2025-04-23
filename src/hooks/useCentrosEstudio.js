import { useState, useEffect } from 'react';
import Centros from "../services/Planilla/Administracion/Centros.json" // Importa el archivo JSON

const useCentrosEstudio = () => {
  const [centrosEstudio, setCentrosEstudio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simula la carga de datos desde un archivo JSON local
    try {
      setLoading(true);
      setCentrosEstudio(Centros.Centros); // Cargamos los centros directamente desde el archivo JSON
    } catch (error) {
      setError('Error al cargar los centros de estudio');
    } finally {
      setLoading(false);
    }
  }, []);

  return { centrosEstudio, loading, error };
};

export default useCentrosEstudio;
