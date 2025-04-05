import '../styles/TableReport.css'
import { FaFilePdf } from "react-icons/fa6";
import { tableReportPropTypes } from "../util/propTypes";

export const TableReport = ({ data }) => {
    return (
        <div className='table-report'>
            <h1>Reportes de Seguimiento de Beca</h1>
            <table className='table'>
                <thead className='table-head'>
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Nombre del Documento</th>
                        <th scope="col">Fecha del reporte</th>
                        <th scope="col">Enlace</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((report, index) => (
                            <tr key={report.reporte_id} className={((index + 1) % 2) === 0 ? 'alter-tr' : ''}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: 'left' }}><FaFilePdf /> {report.nombre_reporte}</td>
                                <td >{new Date(report.fecha_reporte).toLocaleDateString('es-Es', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                <td>
                                    <a href={report.enlace} download target="_blank" rel="noopener noreferrer">
                                        <button className="table-button">Descargar</button>
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>Sin Resultados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

TableReport.propTypes = tableReportPropTypes;
export default TableReport;