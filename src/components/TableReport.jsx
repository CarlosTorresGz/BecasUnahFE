import '../styles/TableReport.css'
import { FaFilePdf } from "react-icons/fa6";

export const TableReport = ({ data }) => {
    console.log('data recibida: ', data);
    const descargarPDF = (enlace) => {
        //Lógica para descargar o abrir pdf en una nueva pestaña
        console.log('Enlace recibido: ', enlace)

    };

    return (
        <div className='table-report'>
            <h1>Reportes de Seguimiento de Beca</h1>
            <table className='table'>
                <thead className='table-head'>
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Nombre del Documento</th>
                        <th scope="col">Información</th>
                        <th scope="col">Enlace</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((report, index) => (
                        <tr key={report.reporte_id}>
                            <td>{index + 1}</td>
                            <td style={{textAlign: 'left'}}><FaFilePdf /> {report.nombre_reporte}</td>
                            <td >{new Date(report.fecha_reporte).toLocaleString('es-ES')}</td>
                            <td >
                                <button className='table-button' onClick={() => { descargarPDF(report.enlace) }}>
                                    Descargar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableReport;