import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { fetchBecaById, fetchStateBecaById } from '../services/PerfilBecario/becaAPI';
import { InfoItem } from '../components/InformacionItem';
import { FaCircle } from "react-icons/fa";
import '../styles/MiBeca.css'
import { SpinnerLoading } from '../components/SpinnerLoading';
import { fetchPlanillas } from '../services/Planilla/planillaAPI';

export const MiBeca = () => {
    const { user } = useAuth() || JSON.parse(localStorage.getItem('user'));;
    const [beca, setBeca] = useState(null);
    const [estadoBeca, setEstadoBeca] = useState(null);
    const [planillas, setPlanillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const assignColorToCobroStatus = estadoEntregaPago => {
        if (estadoEntregaPago.estado_entrega === "Disponible") {
            return "p-3 bg-warning";
        } else if (estadoEntregaPago.estado_entrega === "Entregado") {
            return "p-3 bg-success";
        } else {
            return "p-3 bg-secondary";
        }
    };

    const formatCurrency = (amount) =>
        amount ? `L. ${parseFloat(amount).toFixed(2)}` : 'ND';

    const getData = useCallback( async () => {
        setLoading(true);
        setError(null);

        try {
            const [becaResult, planillaResult, becaEstadoResult] = await Promise.all([
                fetchBecaById({ beca_id: user.beca_id }),
                fetchPlanillas({ becario_id: user.becario_id.trim() }),
                fetchStateBecaById({ estado_beca_id: user.estado_beca_id })
            ]);

            if (becaResult.state && planillaResult.state && becaEstadoResult.state) {
                setBeca(becaResult.body);
                setEstadoBeca(becaEstadoResult.body);
                setPlanillas(planillaResult.body);
            }
        } catch (error) {
            console.error('Error al obtener los datos de la beca:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [user?.beca_id, user?.becario_id, user?.estado_beca_id]);

    useEffect(() => {
        getData();
    }, []);

    if (error) {
        return <div>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</div>;
    }
    return (
        (loading ? (
            <SpinnerLoading />
        ) : (
            <div className='mi-beca'>
                <div className='mi-beca-informacion'>
                    <h1>Información General</h1>
                    <InfoItem label='Tipo de Beca:' value={beca?.nombre_beca || 'No disponible'} />
                    <InfoItem label='Monto:' value={formatCurrency(beca?.monto) || 'ND'} />
                    <InfoItem label='Fecha de Inicio:' value={user.fecha_inicio_beca} />
                    <InfoItem label='Estado:' value={estadoBeca} />
                </div>
                <div className='mi-beca-calendario'>
                    <h1>Calendario de Cobro</h1>
                    <table className="table">
                        <thead className='table-calendar-head'>
                            <tr>
                                <th scope="col" style={{ width: '30%' }}>Mes</th>
                                <th scope="col" style={{ width: '30%' }}>Monto</th>
                                <th scope="col" style={{ width: '40%' }}>Cobrado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planillas.length > 0 ? (
                                planillas.map(pago => (
                                    <tr key={pago.planilla_id}>
                                        <td>{new Date(pago.fecha_planilla).toLocaleString('es-ES', { month: 'long' })}</td>
                                        <td>{formatCurrency(beca?.monto)}</td>
                                        <td className={assignColorToCobroStatus(pago)}>{pago.estado_entrega}</td>
                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No hay datos de pagos disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='table-description'>
                        {[
                            { color: 'gray', label: 'No se Presentó' },
                            { color: '#FFC107', label: 'Disponible' },
                            { color: '#28A745', label: 'Entregado' }
                        ].map((item, index) => (
                            <div key={index}>
                                <FaCircle style={{ color: item.color }} />
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))
    );
}

export default MiBeca;