import '../styles/TableReport.css'
import { FaFilePdf } from "react-icons/fa6";
import { tableReportPropTypes } from "../util/propTypes";
import { getSasToken } from "../util/getSasToken";

export const TableReport = ({ data }) => {
    const handleDescargar = async (enlace) => {
        const sasToken = await getSasToken({ containerName: 'contenedorreportes', permissions: 'r', expiresInMinutes: 5 });
        window.open(`${enlace}?${sasToken.sasToken}`, '_blank', 'noopener', 'noreferrer');
    };

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
                                    <button
                                        className="table-button"
                                        title={`Descargar ${report.nombre_reporte}`}
                                        onClick={() => handleDescargar(report.enlace)}
                                    >
                                        Descargar
                                    </button>
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