import { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../styles/ActividadesRealizadas.css';
import { useDashboard } from '../context/DashboardContext';
import SpinnerLoading from '../components/SpinnerLoading';

const ActividadesRealizadas = () => {
    const { dataFetchBecarios, loading } = useDashboard();
    const mesActual = new Date().getMonth() + 1;
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
    const [mesSeleccionado, setMesSeleccionado] = useState(mesAnterior);
    const [actividadesMesActual, setActividadesMesActual] = useState([]);
    const [actividadesOtrosMeses, setActividadesOtrosMeses] = useState([]);

    useEffect(() => {
        if (!loading && dataFetchBecarios.realizadas.data.length > 0) {
            const actividadesMes = dataFetchBecarios.realizadas.data.filter(act => new Date(act.fecha_actividad).getMonth() + 1 === mesActual);
            const otrasActividades = dataFetchBecarios.realizadas.data.filter(act => new Date(act.fecha_actividad).getMonth() + 1 === mesSeleccionado && new Date(act.fecha_actividad).getMonth() + 1 !== mesActual);
            setActividadesMesActual(actividadesMes);
            setActividadesOtrosMeses(otrasActividades);
        }
    }, [dataFetchBecarios.realizadas, mesSeleccionado, loading, mesActual]);


    const totalHorasMesActual = actividadesMesActual.reduce((total, act) => total + act.numero_horas, 0);
    const totalHorasOtrosMeses = actividadesOtrosMeses.reduce((total, act) => total + act.numero_horas, 0);

    if (loading) return <SpinnerLoading />;

    return (
        <div className="actividades-realizadas-container">
            {/* Tabla de actividades del mes actual */}
            <h3 className="titulo-centrado">Actividades en este mes</h3>
            {actividadesMesActual.length === 0 ? (
                <p className="no-actividades-mes">No realizaste actividades este mes</p>
            ) : (
                <Table striped bordered hover className="tabla-mes-actual">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Actividad</th>
                            <th>Fecha</th>
                            <th>Horas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actividadesMesActual.map((act, index) => (
                            <tr key={index}>
                                <td><img src={act.imagen} alt={act.nombre_actividad} className="imagen-actividad" /></td>
                                <td>{act.nombre_actividad}</td>
                                <td>{new Date(act.fecha_actividad).toLocaleDateString('es-Es', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                <td>{act.numero_horas}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <p className="total-horas-1">Total de horas en este mes: {totalHorasMesActual}</p>

            <h3 className="titulo-mes">{`Mes de ${new Date(2023, mesSeleccionado - 1).toLocaleString('default', { month: 'long' })}`}</h3>

            {/* Selector de mes */}
            <div className="selector-container">
                <Form.Group controlId="mesSeleccionado" className="selector-mes">
                    <Form.Control as="select" value={mesSeleccionado} onChange={e => setMesSeleccionado(parseInt(e.target.value))}>
                        {[...Array(12).keys()].map(mes => {
                            if (mes + 1 !== mesActual) {
                                return (
                                    <option key={mes + 1} value={mes + 1}>
                                        {new Date(2023, mes).toLocaleString('default', { month: 'long' })}
                                    </option>
                                );
                            }
                            return null;
                        })}
                    </Form.Control>
                </Form.Group>
                <p className="total-horas-2">Total de horas en el mes seleccionado: {totalHorasOtrosMeses}</p>
            </div>

            {/* Tabla de actividades de otros meses */}
            {actividadesOtrosMeses.length === 0 ? (
                <p className="no-actividades-mes">No realizaste actividades en el mes seleccionado</p>
            ) : (
                <Table className="tabla-otros-meses">
                    <thead>
                        <tr>
                            <th>Actividad</th>
                            <th>Fecha</th>
                            <th>Horas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actividadesOtrosMeses.map((act, index) => (
                            <tr key={index}>
                                <td>{act.nombre_actividad}</td>
                                <td>{new Date(act.fecha_actividad).toLocaleDateString('es-Es', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                <td>{act.numero_horas}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

ActividadesRealizadas.propTypes = {
    actividades: PropTypes.arrayOf(PropTypes.shape({
        nombre_actividad: PropTypes.string.isRequired,
        fecha_actividad: PropTypes.string.isRequired,
        numero_horas: PropTypes.number.isRequired,
        imagen: PropTypes.string
    })).isRequired
};

export default ActividadesRealizadas;
