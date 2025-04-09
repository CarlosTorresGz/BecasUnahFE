import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const useGenerarPDF = () => {

    const generarPDF = (planilla, becarios) => {
        const doc = new jsPDF();

        const fecha = new Date(planilla.fecha);
        const mes = fecha.toLocaleString('es-ES', { month: 'long' });
        const año = fecha.getFullYear();

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("UNIVERSIDAD NACIONAL AUTÓNOMA DE HONDURAS", 105, 20, { align: "center" });
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Planilla de Pago de Becarios", 105, 30, { align: "center" });
        doc.setFont("helvetica", "bold");
        doc.text(`Mes de ${mes.charAt(0).toUpperCase() + mes.slice(1)} - Año: ${año}`, 20, 50, { align: "left" });
        doc.text(`ID de Planilla: ${planilla.id}`, 20, 60, { align: "left" });

        autoTable(doc, {
            startY: 70,
            head: [["No.", "ID Becario", "Nombre completo", "Carrera", "Centro de estudio", "Monto", "Estado"]],
            body: becarios.map((becario, index) => [
                index + 1,
                becario.id,
                becario.nombre,
                becario.carrera,
                becario.centro,
                becario.monto,
                becario.estado
            ]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save(`${planilla.titulo}.pdf`);
    };

    return generarPDF;
};

export default useGenerarPDF;

