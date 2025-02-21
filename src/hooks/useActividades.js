// hooks/useActividades.js
import { useState, useEffect } from 'react';
import { datosDePrueba } from '../testeos/MockDataActividadesDisponibles'; // Datos de prueba
import { fetchData } from '../services/actAPI'; // Importamos la función de fetch de la API

export const useActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarActividades = async () => {
      try {
        const { dataFetch } = await fetchData(); // Intentamos obtener las actividades de la API
        setActividades(dataFetch.actividades || datosDePrueba.actividades); // Si la API no tiene datos, usamos los de prueba
      } catch (err) {
        console.error("Error al cargar las actividades", err);
        setActividades(datosDePrueba.actividades); // Si hay un error, usamos los datos de prueba
        setError("No se pudieron cargar las actividades desde la API"); // Guardamos el error si ocurre
      }
    };

    cargarActividades(); // Llamada para cargar actividades al montar el componente
  }, []); // El hook se ejecutará solo una vez, cuando el componente se monte

  return { actividades, error };
};
