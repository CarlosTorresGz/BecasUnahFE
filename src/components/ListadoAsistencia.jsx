import React, { useState, useEffect } from "react";
import { Card, Table, Button, ListGroup, Form, Row, Col, InputGroup } from "react-bootstrap";
import "../styles/ListadoAsistencia.css"
import generatePDF from "../services/listGenerator";
import { fetchParticipantesActividadById, actualizarAsistencia } from "../services/participantesActividadAPI";
import { toast } from "sonner";
import { MdSearch } from "react-icons/md";

const ListadoAsistencia = ({ data }) => {
    const [actividadSeleccionada, setActividadSeleccionada] = useState(data[0].actividad_id);
    const [participantesActividad, setParticipantesActividad] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");

    const obtenerParticipantesActividad = async (actividad_id) => {
        setActividadSeleccionada(actividad_id);

        const response = await fetchParticipantesActividadById({ actividad_id });

        if (response.state) {
            setParticipantesActividad(response.body);
        } else {
            setParticipantesActividad([]);
            setError(response.body.error);
        }
    }

    useEffect(() => {
        obtenerParticipantesActividad(actividadSeleccionada);
    }, [actividadSeleccionada]);

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
                    }else {
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
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Buscar"
                                    aria-label="Buscar"
                                    aria-describedby="basic-addon2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline-secondary" id="button-addon2">
                                    <MdSearch />
                                </Button>
                            </InputGroup>
                            <div className="scrollable-card">
                                {data.filter(item =>
                                    item.nombre_actividad.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                ).length > 0 ? (
                                    <ListGroup>
                                        {data.filter(item =>
                                            item.nombre_actividad.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                        )
                                            .map((actividad) => (
                                                <ListGroup.Item
                                                    key={actividad.actividad_id}
                                                    action
                                                    active={actividadSeleccionada === actividad.actividad_id}
                                                    onClick={() => {
                                                        /*setActividadSeleccionada(actividad.actividad_id);
                                                        obtenerParticipantesActividad(actividadSeleccionada);*/
                                                        obtenerParticipantesActividad(actividad.actividad_id);
                                                    }
                                                    }
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
                            <Card.Title>Lista de Asistencia</Card.Title>
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
                        </Card.Body>
                    </Card>
                    <Button variant="primary" className="button-asistencia mt-3" onClick={() => generatePDF(participantesActividad, data.find(a => a.actividad_id === actividadSeleccionada).nombre_actividad)}>
                        Descargar Lista
                    </Button>
                </Col>
            </Row>
        </div >
    );
};

export default ListadoAsistencia;
