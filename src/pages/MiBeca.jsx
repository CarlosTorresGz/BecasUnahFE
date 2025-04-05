import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { fetchBecaById } from '../services/PerfilBecario/becaAPI';
import { InfoItem } from '../components/InformacionItem';
import { FaCircle } from "react-icons/fa";
import '../styles/MiBeca.css'
import { SpinnerLoading } from '../components/SpinnerLoading';
import { useDashboard } from '../context/DashboardContext';

export const MiBeca = () => {
    const { getUser } = useAuth();
    const { dataFetchBecarios, loading } = useDashboard();
    const [beca, setBeca] = useState(null);const [loadingBeca, setLoadingBeca] = useState(true);
    const [error, setError] = useState(null);

    let user = getUser();

    const assignColorToCobroStatus = estadoEntregaPago => {
        if (estadoEntregaPago.estado_entrega === "Disponible") {
            return "bg-warning";
        } else if (estadoEntregaPago.estado_entrega === "Entregado") {
            return "bg-success";
        } else {
            return "bg-secondary";
        }
    };

    const formatCurrency = (amount) =>
        amount ? `L. ${parseFloat(amount).toFixed(2)}` : 'ND';

    const getData = useCallback(async () => {
        setLoadingBeca(true);
        setError(null);

        try {
            const becaResult = await fetchBecaById({ beca_id: user.beca_id });
            if (becaResult.state) {
                setBeca(becaResult.body);
            }
        } catch (error) {
            console.error('Error al obtener los datos de la beca:', error);
            setError(error);
        } finally {
            setLoadingBeca(false);
        }
    }, [user?.beca_id]);

    useEffect(() => {
        getData();
    }, [getData]);

    if (error) {
        return <div>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</div>;
    }
    return (
        (loading || loadingBeca ? (
            <SpinnerLoading />
        ) : (
            <div className='mi-beca'>
                <div className='mi-beca-informacion'>
                    <h1>Información General</h1>
                    <InfoItem label='Tipo de Beca:' value={beca?.nombre_beca || 'No disponible'} />
                    <InfoItem label='Monto:' value={formatCurrency(beca?.monto) || 'ND'} />
                    <InfoItem label='Fecha de Inicio:' value={new Date(user.fecha_inicio_beca).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })} />
                    <InfoItem label='Estado:' value={dataFetchBecarios.becaEstado} />
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
                            {dataFetchBecarios.planilla.length > 0 ? (
                                dataFetchBecarios.planilla.map(pago => (
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