import useGenerarPDF from "../../../../hooks/useGenerarPDF";
import { informacionplanilla_byId } from "../informacionplanilla_byId";
import { toast } from "sonner";


const generarPDF = useGenerarPDF();
export const handleDescargarPDF = async (planilla) => {
    try {
      const response = await informacionplanilla_byId({ planilla_id: planilla.planilla_id });
      
      if (response.state) {
        generarPDF(response.body); 
        toast.success("Generando PDF...");
      } else {
        toast.error("Error al cargar los becarios de la planilla");
      }
    } catch (error) {
      toast.error("Error al generar el PDF");
      console.error("Error al generar PDF:", error);
    }
  };