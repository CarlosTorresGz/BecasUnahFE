import { toast } from "sonner";
import { Button } from "react-bootstrap";
import crearPlanilla from "../../../services/Planilla/Administracion/CrearPlanilla";

export const confirmarYCrearPlanilla = async ({ formData, refresh, cerrarModal }) => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="p-3 bg-white rounded shadow" style={{ width: '350px', zIndex: 10000 }}>
        <h5 className="mb-3">Confirmar creación</h5>
        <p>¿Estás seguro que deseas crear la planilla para {formData.mes} {formData.anio}?</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              toast.dismiss(t);
              resolve(false);
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await crearPlanilla(
                  formData.mes,
                  formData.anio,
                  formData.centro_estudio_id
                );

                if (response.success) {
                  refresh();
                  toast.success("Planilla creada exitosamente");
                  cerrarModal();
                  resolve(true);
                } else {
                  toast.error(`Error al crear planilla: ${response.errorMessage}`);
                  resolve(false);
                }
              } catch (error) {
                console.error("Error al crear la planilla:", error);
                toast.error("Error crítico al crear la planilla");
                resolve(false);
              }
            }}
          >
            Confirmar
          </Button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'center-center'
    });
  });
};
