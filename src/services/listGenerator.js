import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = (list, nameAct) => {
    const font = "times";
    const options = {
        orientation: 'p',
        unit: 'mm',
        format: 'letter'
    }

    // initialize jsPDF
    const doc = new jsPDF(options);

    const tableColumn = ["No.", "No. Cuenta", "Nombre Completo", "Correo Institucional", "Firma"];
    const tableRows = [];

    list.forEach((list, index) => {
        const listData = [
            index + 1,
            list["No. Cuenta"],
            list["Nombre Completo"],
            list["Correo Institucional"],
            list.Asistencia
        ];
        tableRows.push(listData);
    });

    // Obtener ancho de la página
    const pageWidth = doc.internal.pageSize.width;

    // Set font and size
    doc.setFont(font, "bold")
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 10);
    doc.text("Lista de Asistencia", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Actividad: ${nameAct}`, pageWidth / 2, 30, { align: "center" });
    
    // Tabla con autoTable
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: {
            textColor: [0, 0, 10]
        },
        headStyles: {
            fillColor: [0, 57, 107],
            textColor: [255, 255, 255],
            halign: 'center'
        },
        columnStyles: {
            // Adjust column widths as needed
            //0: { cellWidth: 20 }, 
            //1: { cellWidth: 40 },
            //2: { cellWidth: 80 },
            //3: { cellWidth: 60 },
            //4: { cellWidth: 50 },
        },
        alternateRowStyles: {
            textColor: [10, 10, 10]
        },
        bodyStyles: {
            fontSize: 12,
            font: font,
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 },
            textColor: [0, 0, 0],
            rowPageBreak: 'avoid',
        },
        margin: { top: 10, left: 13 },
    });

    //const dateStr = format(new Date(), "yyyyMMdd");
    //doc.save(`Lista_Asistencia_${nameAct.replace(/[^a-zA-Z0-9]/g, "_")} - ${dateStr}.pdf`);
    
    const pdfDataUri = doc.output('datauristring');
    const newTab = window.open();
    newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
};

export default generatePDF;