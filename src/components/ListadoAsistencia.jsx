import React, { useState, useEffect } from "react";
import { Card, Table, Button, ListGroup, Form, Row, Col } from "react-bootstrap";
import { jsPDF } from "jspdf";
import "../styles/ListadoAsistencia.css"

const becarios = {
    A00000: [
        { id: 101, nombre: "Juan Pérez" },
        { id: 102, nombre: "Ana Gómez" },
    ],
    A00001: [
        { id: 201, nombre: "Carlos Rodríguez" },
        { id: 202, nombre: "María López" },
    ],
    A00002: [
        { id: 301, nombre: "Luis Fernández" },
        { id: 302, nombre: "Sofía Méndez" },
    ],
};

const ListadoAsistencia = ({ data }) => {
    const [actividades, setActividades] = useState(data);
    const [actividadSeleccionada, setActividadSeleccionada] = useState(1);
    const [asistencia, setAsistencia] = useState({});

    const toggleAsistencia = (id) => {
        setAsistencia((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Cargar el estado de la asistencia desde localStorage cuando se monta el componente
    useEffect(() => {
        const storedAsistencia = JSON.parse(localStorage.getItem("asistencia"));
        if (storedAsistencia) {
            setAsistencia(storedAsistencia);
        }
    }, []);

    // Guardar el estado de la asistencia en localStorage cada vez que cambie
    useEffect(() => {
        if (Object.keys(asistencia).length > 0) {
            localStorage.setItem("asistencia", JSON.stringify(asistencia));
        }
    }, [asistencia]);

    const descargarLista = () => {
        const doc = new jsPDF();
        doc.text(`Lista de Asistencia - ${actividades.find(a => a.actividad_id === actividadSeleccionada).nombre_actividad}`, 10, 10);
        becarios[actividadSeleccionada].forEach((b, index) => {
            doc.text(`${index + 1}. ${b.nombre} - ${asistencia[b.id] ? "Asistió" : "No asistió"}`, 10, 20 + index * 10);
        });

        const nombreArchivo = `lista_asistencia_${actividades.find(a => a.actividad_id === actividadSeleccionada).nombre_actividad}.pdf`;
        doc.save(nombreArchivo);
    };

    return (
        <div className="p-4">
            <Row>
                {/* Card de Actividades */}
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Actividades</Card.Title>
                            <div className="scrollable-card">
                                <ListGroup>
                                    {actividades.map((actividad) => (
                                        <ListGroup.Item
                                            key={actividad.actividad_id}
                                            action
                                            active={actividadSeleccionada === actividad.actividad_id}
                                            onClick={() => setActividadSeleccionada(actividad.actividad_id)}
                                        >
                                            {actividad.nombre_actividad}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Card de Lista de Asistencia */}
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Lista de Asistencia</Card.Title>
                            <div className="scrollable-card">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Becario</th>
                                            <th>Asistencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {becarios[actividadSeleccionada]?.map((becario) => (
                                            <tr key={becario.id}>
                                                <td>{becario.nombre}</td>
                                                <td className="text-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={asistencia[becario.id] || false}
                                                        onChange={() => toggleAsistencia(becario.id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="primary" onClick={descargarLista}>
                                    Descargar Lista
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div >
    );
};

export default ListadoAsistencia;
