import { toast } from "sonner";
import { Button } from "react-bootstrap";
import { eliminarPlanilla } from "../EliminarPlanilla";
//import { useDashboard } from "../../../../context/DashboardContext";

export const handleEliminarPlanilla = async (planilla_id, refreshFn, refreshPlanilla) => {
    toast.custom((t) => (
      <div className="p-3 bg-white rounded shadow" style={{ width: '350px', zIndex: 10000 }}>
        <h5 className="mb-3">Confirmar eliminación</h5>
        <p>¿Estás seguro que deseas eliminar esta planilla? Esta acción no se puede deshacer.</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => toast.dismiss(t)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await eliminarPlanilla(planilla_id);
                
                if (response.state) {
                  refreshFn?.();
                  refreshPlanilla();
                  toast.success("Planilla eliminada correctamente");
                } else {
                  toast.error(response.errorMessage || "Error al eliminar la planilla");
                }
              } catch (error) {
                toast.error("Error al eliminar la planilla");
                console.error("Error completo:", error);
              }
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'center-center'
    });
  };