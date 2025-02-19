import { InfoItem } from './ProfileBecario';
import { FaCircle } from "react-icons/fa";
import '../styles/MiBeca.css'

const becario = {
    becario_id: 'B0',
    persona_id: 0,
    no_cuenta: '20171001103',
    carrera_id: 'CAR19',
    beca_id: 0,
    estado_beca_id: 0, //usado
    fecha_inicio_beca: '2023-01-01', //date usado
    contrasena: '1234',
    ultimo_acceso: '2024-01-01 00:00:00.000',
    primer_ingreso: 1
}

const becas = {
    beca_id: 0,
    nombre_beca: 'Beca Excelencia Académica Categoría "A"', //usado
    descripcion: 'Es una asignación mensual no reembolsable de L2,000.00 que se otorga durante el año académico a estudiantes de Primer Ingreso  cuyo promedio académico de Educación Secundaria sea igual o superior a 90%. \n Para los estudiantes de Reingreso  índice debe ser de 90% de un mínimo de 10 asignaturas aprobadas en el año académico anterior.',
    monto: 2000.00 //usado
}

const estado_beca = {
    estado_beca_id: 0,
    estado_beca: 'Activa', //usado
}


export const MiBeca = () => {

    return (
        <div className='mi-beca'>
            <div className='mi-beca-informacion'>
                <h1>Información General</h1>
                <InfoItem label='Tipo de Beca:' value={becas.nombre_beca} />
                <InfoItem label='Monto:' value={becas.monto} />
                <InfoItem label='Fecha de Inicio:' value={becario.fecha_inicio_beca} />
                <InfoItem label='Estado:' value={estado_beca.estado_beca} />
            </div>
            <div className='mi-beca-calendario'>
                <h1>Calendario de Cobro</h1>
                <table className='table-calendar'>
                    <thead className='table-calendar-head'>
                        <tr>
                            <th>Mes</th>
                            <th>Monto</th>
                            <th>Cobrado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*
                    {pagos.map((pago, index) => (
                        <tr key={index} style={{ backgroundColor: pago.estado_entrega === "Cobrado" ? '#c8e6c9' : pago.estado_entrega === "Disponible" ? '#ffecb3' : '#f8d7da' }}>
                            <td>{pago.mes}</td>
                            <td>L. {pago.monto.toFixed(2)}</td>
                            <td>{pago.estado_entrega === "Cobrado" ? '✅' : '❌'}</td>
                        </tr>
                    ))}
                    */}
                        <tr style={{ backgroundColor: '#c8e6c9' }}>
                            <td>Enero</td>
                            <td>L. </td>
                            <td>`❌`</td>
                        </tr>
                        <tr style={{ backgroundColor: '#c8e6c9' }}>
                            <td>Febrero</td>
                            <td>L. </td>
                            <td>`✅`</td>
                        </tr>
                    </tbody>
                </table>
                <div className='table-description'>
                    <div>
                        <FaCircle />
                        <span>Pendiente</span>
                    </div>
                    <div>
                        <FaCircle />
                        <span>Disponible</span>
                    </div>
                    <div>
                        <FaCircle />
                        <span>Cobrado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiBeca;