import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchBecaById, fetchStateBecaById } from '../services/becaAPI';
import { InfoItem } from './ProfileBecario';
import { FaCircle } from "react-icons/fa";
import '../styles/MiBeca.css'
import Spinner from 'react-bootstrap/Spinner';
import { fetchPlanillas } from '../services/planillaAPI.JS';

export const MiBeca = () => {
    const { user } = useAuth();
    const [beca, setBeca] = useState(null);
    const [estadoBeca, setEstadoBeca] = useState(null);
    const [planillas, setPlanillas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener datos
    useEffect(() => {
        const fetchBecaData = async () => {
            try {
                if (user?.beca_id) {
                    const becaData = await fetchBecaById({ beca_id: user.beca_id });
                    const becaEstadoData = await fetchStateBecaById({ estado_beca_id: user.estado_beca_id });
                    if (becaData.state) {
                        setBeca(becaData.body);
                        setEstadoBeca(becaEstadoData.body)
                    }
                }

                if (user?.becario_id) {
                    const planillaData = await fetchPlanillas({ becario_id: user.becario_id });
                    if (planillaData.state) {
                        setPlanillas(planillaData.body);
                    }
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBecaData();
    }, [user?.beca_id, user?.becario_id, user?.estado_beca_id]);    

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner animation="border" role="status" style={{ color: "#20527E" }}>
                    <span className="visually-hidden" style={{ color: "#20527E" }}>Loading...</span>
                </Spinner>
            </div>
        );
    }
    return (
        <div className='mi-beca'>
            <div className='mi-beca-informacion'>
                <h1>Información General</h1>
                <InfoItem label='Tipo de Beca:' value={beca.nombre_beca} />
                <InfoItem label='Monto:' value={`L. ${beca.monto.toFixed(2)}`} />
                <InfoItem label='Fecha de Inicio:' value={user.fecha_inicio_beca} />
                <InfoItem label='Estado:' value={estadoBeca} />
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
                        {planillas.length > 0 ? (
                            planillas.map((pago, index) => (
                                <tr key={index}>
                                    <td>{new Date(pago.fecha_planilla).toLocaleString('es-ES', { month: 'long' })}</td>
                                    <td>L. {beca.monto.toFixed(2)}</td>
                                    <td>{pago.estado_entrega === "Entregado" ? '✅' : '❌'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No hay registros de planillas disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className='table-description'>
                    <div>
                        <FaCircle style={{ color: 'gray' }} />
                        <span>Pendiente</span>
                    </div>
                    <div>
                        <FaCircle style={{ color: '#FFC107' }} />
                        <span>Disponible</span>
                    </div>
                    <div>
                        <FaCircle style={{ color: '#28A745' }} />
                        <span>Cobrado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiBeca;