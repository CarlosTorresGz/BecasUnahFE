import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { FaDownload, FaPlusCircle } from "react-icons/fa";
import { format } from "date-fns";

const Planillas = () => {
  const [planillas, setPlanillas] = useState([]);
  const [becariosActivos, setBecariosActivos] = useState([]);

  useEffect(() => {
    // Simulación de carga de planillas del año actual
    const añoActual = new Date().getFullYear();
    fetch(`/api/planillas?year=${añoActual}`)
      .then(res => res.json())
      .then(data => setPlanillas(data));

    // Simulación de carga de becarios activos
    fetch("/api/becarios?estado=activo")
      .then(res => res.json())
      .then(data => setBecariosActivos(data));
  }, []);

  const generarNuevaPlanilla = () => {
    // Aquí se generaría una nueva planilla para los becarios activos
    fetch("/api/planillas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ becarios: becariosActivos })
    })
      .then(res => res.json())
      .then(nuevaPlanilla => setPlanillas(prev => [nuevaPlanilla, ...prev]));
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Planillas de Pago - {new Date().getFullYear()}</h1>
        <Button variant="primary" onClick={generarNuevaPlanilla} disabled={becariosActivos.length === 0}>
          <FaPlusCircle className="me-2" /> Nueva Planilla
        </Button>
      </div>

      {planillas.length === 0 ? (
        <p className="text-muted">No hay planillas registradas en el año actual.</p>
      ) : (
        <Row>
          {planillas.map(planilla => (
            <Col md={6} lg={4} key={planilla.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{planilla.titulo}</Card.Title>
                  <Card.Text className="text-muted">
                    Generada el {format(new Date(planilla.fecha), "PPP")}
                  </Card.Text>
                  <Button variant="outline-secondary" onClick={() => window.open(planilla.url_descarga, "_blank")}> 
                    <FaDownload className="me-2" /> Descargar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Planillas;
