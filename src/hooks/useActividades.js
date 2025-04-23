// hooks/useActividades.js
import { useState, useEffect } from 'react';
import fetchAllData from '../services/ActAPI'; // Importamos la función de fetch de la API

export const useActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarActividades = async () => {
      try {
        const  dataFetch  = await fetchAllData(); // Intentamos obtener las actividades de la API
        setActividades(dataFetch.actividades); // Si la API no tiene datos, usamos los de prueba
      } catch (err) {
        console.error("Error al cargar las actividades", err);
        setError("No se pudieron cargar las actividades desde la API"); // Guardamos el error si ocurre
      }
    };

    cargarActividades(); // Llamada para cargar actividades al montar el componente
  }, []); // El hook se ejecutará solo una vez, cuando el componente se monte

  return { actividades, error };
};