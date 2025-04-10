import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const useGenerarPDF = () => {
  const generarPDF = (data) => {
    // Verificar si data existe
    if (!data) {
      console.error("No se proporcionaron datos para generar el PDF");
      return;
    }

    // Acceder correctamente a los datos de los becarios
    const becarios = data.planillas || [];
    if (becarios.length === 0) {
      console.error("No hay becarios para generar PDF");
      return;
    }

    // Obtener el primer becario para datos generales
    const primerBecario = becarios[0];

    // Verificar que el primer becario tenga los datos necesarios
    if (!primerBecario || !primerBecario.mes || !primerBecario.fecha_planilla_creacion) {
      console.error("Datos incompletos en el primer becario:", primerBecario);
      return;
    }

    try {
      // Crear el documento PDF
      const doc = new jsPDF();

      // Establecer márgenes y encabezados
      const año = new Date(primerBecario.fecha_planilla_creacion).getFullYear();
      const fechaCreacion = new Date(primerBecario.fecha_planilla_creacion).toLocaleDateString();

      // Título y descripción
      doc.setFontSize(16);
      doc.setTextColor(41, 128, 185); // Color azul para el título
      doc.text(`Planilla de Pago de ${primerBecario.mes} ${año}`, 14, 20);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Color negro para el texto
      doc.text(`Descripción: ${primerBecario.descripcionPlanilla || 'Sin descripción'}`, 14, 28);
      doc.text(`Fecha de Creación: ${fechaCreacion}`, 14, 36);

      // Línea horizontal
      doc.setLineWidth(0.5);
      doc.line(14, 40, 200, 40);

      // Cabecera de la tabla
      const headers = [
        ["Nombre Completo", "Carrera", "Monto Beca", "¿Fue Cobrado?", "Días Restantes"]
      ];

      // Filtrar los datos de los becarios para la tabla
      const rows = becarios.map(b => {
        return [
          b.NombreCompleto || 'N/A',
          b.nombre_carrera || 'N/A',
          ` L. ${b.MontoBeca || 0} `,
          typeof b.entregado === 'boolean' ? (b.entregado ? 'Sí' : 'No') : 'N/A',
          b.dias_restantes?.toString() || 'N/A'
        ];
      });

      // Calcular el total de los montos
      const totalMonto = becarios.reduce((acc, b) => acc + (b.MontoBeca || 0), 0);

      // Configuración de la tabla con bordes, colores y estilos
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 45,
        styles: { 
          fontSize: 10, 
          halign: 'center', 
          valign: 'middle', 
          lineColor: [41, 128, 185], 
          lineWidth: 0.2, 
          cellPadding: 3
        },
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: [255, 255, 255], // Color blanco para el texto del encabezado
          fontSize: 12, 
          fontStyle: 'bold'
        },
        columnStyles: {
          2: { cellWidth: 40 }, // Ajusta el ancho de la columna "Monto Beca"
        },
        margin: { top: 45, left: 14, right: 14 },
        didDrawPage: function (data) {
          // Logo o pie de página (si es necesario)
          doc.setFontSize(10);
          doc.text('Generado por: Sistema de Control de Becas', 14, doc.internal.pageSize.height - 10);
        }
      });

      // Agregar total al final
      const totalY = doc.lastAutoTable.finalY + 10; // Determinar la posición debajo de la tabla
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Color negro para el texto
      doc.text(`El monto total de la Planilla de Becas es de: L. ${totalMonto.toFixed(2)}`, 14, totalY);

      // Guardar el archivo PDF con nombre seguro
      const nombreArchivo = `Planilla_${primerBecario.mes || 'Sin-Mes'}_${año || 'Sin-Año'}.pdf`;
      doc.save(nombreArchivo);

      console.log("PDF generado exitosamente:", nombreArchivo);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return generarPDF;
};

export default useGenerarPDF;
