import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (dataSeguimiento, actividadesFiltradas, oldStateBeca, observacionCambioEstado, observacion, selectedPeriodo, anioPeriodo) => {
    console.log('actividadesFiltradas: ', actividadesFiltradas)
    let lastY = 50;
    let totalHoras = 0;

    const font = "helvetica";
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    const options = {
        orientation: 'p',
        unit: 'mm',
        format: 'letter',
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
    }

    // initialize jsPDF
    const doc = new jsPDF(options);

    const marginLeft = 20; // Margen izquierdo
    const marginTop = 20;  // Margen superior

    const tableActividadesColumn = ["No.", "Nombre Actividad", "Fecha Actividad", "Horas"];
    const tableActividadesRows = [];

    const tableInformacionGeneralRows = [
        ["Nombre del Becario:", `${dataSeguimiento.nombre} ${dataSeguimiento.apellido}`],
        ["Número de Cuenta:", dataSeguimiento.no_cuenta],
        ["Correo Institucional:", dataSeguimiento.correo_institucional],
        ["Carrera:", dataSeguimiento.nombre_carrera],
        ["Centro de Estudio:", dataSeguimiento.nombre_centro_estudio],
    ];

    const tableDesempenoColumn = ["Indice Global", "Indice Anual", "Indice del Periodo"];
    const tableDesempenoRows = [
        [
            dataSeguimiento.indice_global,
            dataSeguimiento.indice_anual,
            dataSeguimiento.indice_periodo
        ]
    ];

    const tableEstadoBecaRows = [
        [
            {
                content: "Tipo de Beca:",
                styles: { fontStyle: "bold" }
            },
            {
                content: dataSeguimiento.nombre_beca,
                colSpan: 3
            }
        ],
        [
            {
                content: "Fecha de inicio de beca:",
                styles: { fontStyle: "bold" }
            },
            {
                content: dataSeguimiento.fecha_inicio_beca,
                colSpan: 3
            }
        ],
        [
            { content: "Estado anterior:", styles: { fontStyle: "bold" } },
            { content: oldStateBeca ? oldStateBeca : dataSeguimiento.estado_beca, colSpan: 1 },
            { content: "Estado actual:", styles: { fontStyle: "bold" } },
            { content: dataSeguimiento.estado_beca, colSpan: 1 },
        ],
    ];

    if (actividadesFiltradas.length > 0) {
        actividadesFiltradas.forEach((list, index) => {
            const listData = [
                index + 1,
                list.nombre_actividad,
                list.fecha_actividad,
                list.numero_horas
            ];
            totalHoras += list.numero_horas;
            tableActividadesRows.push(listData);
        });
        tableActividadesRows.push(['', '', 'Total de Horas', totalHoras]);
    }
    

    // Set font and size
    doc.setFont(font, "bold")
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 10);
    doc.text("Reporte de Seguimiento Académico", doc.internal.pageSize.width / 2, marginTop, { align: "center" });
    doc.setFontSize(12);
    doc.text("Programa de Atención Socioeconómica y Estímulos Educativos (PASEE)", doc.internal.pageSize.width / 2, marginTop + 7, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Fecha: ${date}`, marginLeft, marginTop + 15);
    doc.text(`Periodo Académico: ${selectedPeriodo} ${anioPeriodo}`, marginLeft, marginTop + 22);

    doc.text('1. Informacion General', marginLeft, lastY, { align: "left" });
    //Tabla Informacion General
    autoTable(doc, {
        startY: lastY + 5,
        head: [],
        body: tableInformacionGeneralRows,
        theme: "grid",
        styles: { fontSize: 10, textColor: [0, 0, 0] },
        columnStyles: {
            0: { fillColor: [200, 200, 200], fontStyle: "bold", halign: "left" }, // Primera columna sombreada y en negrita
            1: { halign: "left" }, // Segunda columna alineada a la izquierda
        },
        margin: { left: marginLeft, right: marginLeft },
    });
    // Actualizar la posición después de la tabla
    lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : lastY + 5;

    doc.text('2. Desempeño Académico', marginLeft, lastY, { align: "left" });
    //Tabla Desempeño Académico
    autoTable(doc, {
        head: [tableDesempenoColumn],
        body: tableDesempenoRows,
        startY: lastY + 5,
        theme: "grid",
        styles: {
            fontSize: 10,
            textColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [200, 200, 200],
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            fontSize: 10,
            font: font,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        },
        bodyStyles: {
            fontSize: 10,
            font: font,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
            textColor: [0, 0, 0],
        },
        margin: { left: marginLeft, right: marginLeft },
    });
    // Actualizar la posición después de la tabla
    lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : lastY + 5;

    doc.text('3. Estado de la Beca', marginLeft, lastY, { align: "left" });
    //Tabla Estado de la Beca
    autoTable(doc, {
        head: [],
        body: tableEstadoBecaRows,
        startY: lastY + 5,
        theme: "grid",
        styles: { fontSize: 10, textColor: [0, 0, 0] },
        columnStyles: {
            0: { fillColor: [200, 200, 200], fontStyle: "bold", halign: "left" }, // Primera columna sombreada y en negrita
            2: { fillColor: [200, 200, 200], fontStyle: "bold", halign: "left" }, // Tercera columna sombreada y en negrita
            fontSize: 10,
            font: font,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        },
        margin: { left: marginLeft, right: marginLeft },
    });

    // Actualizar la posición después de la tabla
    lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : lastY + 5

    if (oldStateBeca.trim() !== '') {
        //Tabla Observaciones Cambio beca estado
        autoTable(doc, {
            head: [['Motivo del cambio:']],
            body: [[observacionCambioEstado]],
            startY: lastY,
            theme: "grid",
            styles: {
                fontSize: 10,
                textColor: [0, 0, 0],
                lineHeight: 1.5
            },
            headStyles: {
                fillColor: [200, 200, 200],
                fontStyle: 'bold',
                halign: 'center',
            },
            columnStyles: {
                0: { 
                    halign: "justify", 
                    cellWidth: "wrap" ,
                    cellPadding: { top: 5, right: 5, bottom: 5, left: 5 },

                }
            },
            margin: { left: marginLeft, right: marginLeft },
        });

        // Actualizar la posición después de la tabla
        lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : lastY + 5

    }

    doc.text('4. Actividades Realizadas', marginLeft, lastY, { align: "left" });
    // Tabla Actividades Realizadas
    autoTable(doc, {
        head: [tableActividadesColumn],
        body: tableActividadesRows,
        startY: lastY + 5,
        styles: { fontSize: 10, textColor: [0, 0, 0] },
        headStyles: {
            fillColor: [200, 200, 200],
            fontStyle: "bold",
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center' },
            //1: { cellWidth: 40 },
            2: { cellWidth: 40, halign: 'center' },
            3: { cellWidth: 40, halign: 'center' },
            fontSize: 10,
            font: font,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        },
        alternateRowStyles: {
            textColor: [10, 10, 10]
        },
        bodyStyles: {
            fontSize: 10,
            font: font,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
            textColor: [0, 0, 0],
            rowPageBreak: 'avoid',
        },
        margin: { left: marginLeft, right: marginLeft },
        didAddPage: function (data) {
            doc.setFontSize(10);
            doc.text("Continuación de Actividades Realizadas", marginLeft, 30);
            doc.setFontSize(10);
            doc.text(`Página ${data.pageNumber}`, marginLeft, 30);
        }
    });
    // Actualizar la posición después de la tabla
    lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : lastY + 5;

    // Verificar si hay suficiente espacio en la página actual
    const startYObservaciones = lastY + 10; // Posición después de la última tabla
    const pageHeight = doc.internal.pageSize.height;
    const spaceAvailable = pageHeight - startYObservaciones - 20;

    if (spaceAvailable < 30) { // Ajustado para evitar desbordamientos
        doc.addPage();
        doc.text('5. Observaciones', marginLeft, marginTop, { align: "left" });
        lastY = marginTop + 5; // Reiniciar lastY para la nueva página
    } else {
        doc.text('5. Observaciones', marginLeft, startYObservaciones, { align: "left" });
    }

    //Tabla Observaciones
    autoTable(doc, {
        head: [],
        body: [[observacion]],
        startY: lastY,
        theme: "grid",
        styles: {
            fontSize: 10,
            textColor: [0, 0, 0],
            cellPadding: { top: 5, right: 5, bottom: 5, left: 5 },
            lineHeight: 1.5
        },
        columnStyles: {
            0: { halign: "justify", cellWidth: "wrap" }
        },
        margin: { left: marginLeft, right: marginLeft },
    });
    // Actualizar la posición después de la tabla
    lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : lastY + 5;
    
    const pdfBlob = doc.output('blob');
    //const blobUrl = URL.createObjectURL(pdfBlob);
    //window.open(blobUrl);
    return pdfBlob;
};

export default generatePDF;