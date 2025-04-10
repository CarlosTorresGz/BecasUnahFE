

export const obtenerAniosDisponibles = () => {
    const anioActual = new Date().getFullYear();
    const anioMinimo = anioActual - 1;
    const anioMaximo = anioActual + 3;
    return Array.from({ length: anioMaximo - anioMinimo + 1 }, (_, index) => anioMinimo + index);
  };

  export const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };