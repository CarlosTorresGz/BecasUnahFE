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
    const [error, setError] = useState(null);
    const [fechaInicioBeca, setFechaInicioBeca] = useState(null);

    const getData = async () => {
        const userLocal = JSON.parse(localStorage.getItem('user'));
        console.log('userLocal: ', userLocal);

        const becaId = userLocal ? userLocal.beca_id : null;
        const estadoBecaId = userLocal ? userLocal.estado_beca_id : null;
        const becarioId = userLocal ? userLocal.becario_id : null;

        if (!userLocal) {
            console.error('No se encontró user en localStorage');
            setError('No se encontró la información del usuario.');
            setLoading(false);
            return;
        }

        try {
            const becaData = await fetchBecaById({ beca_id: becaId });
            console.log("API Response:", becaData);

            const planillaData = await fetchPlanillas({ becario_id: becarioId });
            console.log("API Response:", planillaData);

            if (becaData.state) {
                setBeca(becaData.body);
                setFechaInicioBeca(userLocal ? userLocal.fecha_inicio_beca : null)
                if (estadoBecaId) {
                    const becaEstadoData = await fetchStateBecaById({ estado_beca_id: estadoBecaId });
                    console.log("API Response:", becaEstadoData);
                    if (becaEstadoData.state) {
                        setEstadoBeca(becaEstadoData.body)
                    }
                }
            }
            if (planillaData.state) {
                setPlanillas(planillaData.body);
            }
        } catch (error) {
            console.error('Error al obtener los datos de la persona:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner animation="border" role="status" style={{ color: "#20527E" }}>
                    <span className="visually-hidden" style={{ color: "#20527E" }}>Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <div>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</div>;
    }
    return (
        <div className='mi-beca'>
            <div className='mi-beca-informacion'>
                <h1>Información General</h1>
                <InfoItem label='Tipo de Beca:' value={beca.nombre_beca} />
                <InfoItem label='Monto:' value={beca.monto ? `L. ${beca.monto.toFixed(2)}` : 'ND'} />
                <InfoItem label='Fecha de Inicio:' value={fechaInicioBeca} />
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
                                    <td>{beca.monto ? `L. {beca.monto.toFixed(2)}` : 'ND'}</td>
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