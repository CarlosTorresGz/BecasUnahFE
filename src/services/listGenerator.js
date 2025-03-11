import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
            list.Asistencia ? 'Asistió' : ''
            
        ];
        tableRows.push(listData);
    });

    // Obtener ancho de la página
    const pageWidth = doc.internal.pageSize.width;

    // Set font and size
    doc.setFont(font, "bold")
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 10);
    doc.text("Lista de Asistencia", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Actividad: ${nameAct}`, pageWidth / 2, 27, { align: "center" });
    
    // Tabla con autoTable
    autoTable(doc, { 
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "grid",
        styles: {
            textColor: [0, 0, 10]
        },
        headStyles: {
            fillColor: [200, 200, 200],
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center' }, 
            //1: { cellWidth: 40 },
            //2: { cellWidth: 60 },
            //3: { cellWidth: 60 },
            4: { cellWidth: 55, halign: 'center' },
            fontSize: 10.5,
            font: font,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        },
        alternateRowStyles: {
            textColor: [10, 10, 10]
        },
        bodyStyles: {
            fontSize: 10.5,
            font: font,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
            textColor: [0, 0, 0],
            rowPageBreak: 'avoid',
        },
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
        didDrawCell: (data) => {
            const { doc, cell } = data;
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.05);
            doc.rect(cell.x, cell.y, cell.width, cell.height, "S"); // Redibuja el borde
        },
    });

    //const dateStr = format(new Date(), "yyyyMMdd");
    //doc.save(`Lista_Asistencia_${nameAct.replace(/[^a-zA-Z0-9]/g, "_")} - ${dateStr}.pdf`);
    
    const pdfDataUri = doc.output('datauristring');
    const newTab = window.open();
    newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
};

export default generatePDF;