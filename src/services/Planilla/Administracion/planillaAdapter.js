export const adaptarPlanillas = (dataAPI) => {
    return dataAPI.map((p, index) => ({
      planilla_id: p.planilla_id,
      titulo: p.descripcionPlanilla,
      fecha: p.fecha_planilla_creacion,
      vistas: Math.floor(Math.random() * 10) + 1,      
      anio:p.anio,
      mes:p.mes,
      administrador: p.NombreCompleto || "Desconocido",
      nombre_centro_estudio:p.nombre_centro_estudio || "General"
    }));
  };
  