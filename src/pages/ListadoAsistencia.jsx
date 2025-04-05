import { useState, useEffect } from "react";
import { Card, Table, Button, ListGroup, Form, Row, Col } from "react-bootstrap";
import "../styles/ListadoAsistencia.css"
import generatePDF from "../util/listGenerator";
import { fetchParticipantesActividadById, actualizarAsistencia } from "../services/participantesActividadAPI";
import { toast } from "sonner";
import { MdSearch } from "react-icons/md";
import { useDashboard } from "../context/DashboardContext";
import SearchBar from "../components/SearchBar";

const ListadoAsistencia = () => {
    const { dataFetch } = useDashboard();
    const [actividadSeleccionada, setActividadSeleccionada] = useState(dataFetch.actividades.data[0].actividad_id);
    const [participantesActividad, setParticipantesActividad] = useState([]);
    const [numeroParticipantes, setNumeroParticipantes] = useState(0);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [nombreActividad, setNombreActividad] = useState(dataFetch.actividades.data[0].nombre_actividad);
    const [loading, setLoading] = useState(false);

    const estadoDeActivididad = ( actividad_id) => {
        return dataFetch.actividades.data.find(
            estado => estado.actividad_id === actividad_id).estado_actividad;
    }

    const obtenerParticipantesActividad = async (actividad_id, nombre_actividad) => {
        setActividadSeleccionada(actividad_id);
        setNombreActividad(nombre_actividad);
        setLoading(true);
        const response = await fetchParticipantesActividadById({ actividad_id });
        if (response.state) {
            setParticipantesActividad(response.body);
            setNumeroParticipantes(response.body.length);
            setLoading(false);
        } else {
            setParticipantesActividad([]);
            setError(response.body.error);
            setNumeroParticipantes(0);
            setLoading(false);
        }
    }

    useEffect(() => {
        obtenerParticipantesActividad(actividadSeleccionada, nombreActividad);
    }, [actividadSeleccionada, nombreActividad]);

    const toggleAsistencia = async (actividad_id, no_cuenta) => {
        try {
            const asistenciaActualizada = await actualizarAsistencia({ actividadId: actividad_id, noCuenta: no_cuenta });
            // Actualizar el estado en el frontend
            setParticipantesActividad((prev) =>
                prev.map((becario) =>
                    becario["No. Cuenta"] === no_cuenta
                        ? { ...becario, Asistencia: !becario.Asistencia }
                        : becario
                )
            );

            participantesActividad.map((becario) => {
                if (becario["No. Cuenta"] === no_cuenta) {
                    if (!becario.Asistencia) {
                        toast.success(`${asistenciaActualizada.body}`);
                    } else {
                        toast.warning(`Asistencia desmarcada.`);
                    }
                }
            });

        } catch (error) {
            console.error("Error al actualizar la asistencia:", error);
        }
    };

    return (
        <div className="p-4">
            <Row>
                {/* Card de Actividades */}
                <Col md={5} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Actividades</Card.Title>
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} text={<MdSearch />} />
                            <div className="scrollable-card">
                                {dataFetch.actividades.data.filter(item =>
                                    item.nombre_actividad.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                ).length > 0 ? (
                                    <ListGroup>
                                        {dataFetch.actividades.data.filter(item =>
                                            item.nombre_actividad.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                        )
                                            .filter(actividadEstado =>
                                                actividadEstado.estado_actividad != 'Cancelada'
                                            )
                                            .map((actividad) => (
                                                <ListGroup.Item
                                                    key={actividad.actividad_id}
                                                    action
                                                    active={actividadSeleccionada === actividad.actividad_id}
                                                    onClick={() => { obtenerParticipantesActividad(actividad.actividad_id, actividad.nombre_actividad); }}
                                                    style={{fontSize: '0.9rem'}}
                                                >
                                                    {actividad.nombre_actividad}
                                                </ListGroup.Item>
                                            ))}
                                    </ListGroup>
                                ) : (
                                    <p className="no-results">No se encontraron resultados</p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Card de Lista de Asistencia */}
                <Col md={7} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>{`Lista de Asistencia: ${nombreActividad}`}</Card.Title>
                            <span>{`Estado de la Actividad: ${estadoDeActivididad(actividadSeleccionada)}`}</span><br />
                            <span>{`No. de participantes: ${numeroParticipantes}`}</span>
                            {!loading ? (
                                <div className="scrollable-card">
                                    <Table striped bordered hover>
                                        <thead className="table-thead">
                                            <tr>
                                                <th>No. Cuenta</th>
                                                <th>Becario</th>
                                                <th>Correo Institucional</th>
                                                <th>Asistencia</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-tbody">
                                            {participantesActividad && participantesActividad.length > 0 ? (
                                                participantesActividad.map((becario) => (
                                                    <tr key={becario["No. Cuenta"]}>
                                                        <td>{becario["No. Cuenta"]}</td>
                                                        <td style={{ textAlign: 'left' }}>{becario["Nombre Completo"]}</td>
                                                        <td style={{ textAlign: 'left' }}>{becario["Correo Institucional"]}</td>
                                                        <td className="text-center">
                                                            <Form.Check
                                                                type="checkbox"
                                                                checked={becario.Asistencia}
                                                                onChange={() => toggleAsistencia(actividadSeleccionada, becario["No. Cuenta"])}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center">{error}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>

                                </div>
                            ) : (
                                <div className="colorful"></div>
                            )}

                        </Card.Body>
                    </Card>
                    <Button variant="primary" className="button-asistencia mt-3" onClick={() => generatePDF(participantesActividad, dataFetch.actividades.data.find(a => a.actividad_id === actividadSeleccionada).nombre_actividad)}>
                        Descargar Lista
                    </Button>
                </Col>
            </Row>
        </div >
    );
};

export default ListadoAsistencia;
