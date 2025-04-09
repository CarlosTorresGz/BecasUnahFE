import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Modal } from "react-bootstrap";
import { FaDownload, FaPlusCircle, FaEye, FaCloudDownloadAlt, FaCalendarAlt } from "react-icons/fa";
import useGenerarPDF from "../hooks/useGenerarPDF";
import '../styles/Planillas.css';
import { useAuth } from "../context/AuthContext";

const PlanillasPagoBecarios = () => {
  const { user } = useAuth();
  const [planillas, setPlanillas] = useState([]);
  const [becariosActivos, setBecariosActivos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const generarPDF = useGenerarPDF();

  useEffect(() => {
    const datosFicticiosPlanillas = [
      {
        id: "PLN-202503-001",
        titulo: "Planilla Enero 2025",
        fecha: "2025-01-30",
        vistas: 12
      },
      {
        id: "PLN-202503-002",
        titulo: "Planilla Febrero 2025",
        fecha: "2025-02-28",
        vistas: 7
      },
      {
        id: "PLN-202503-003",
        titulo: "Planilla Marzo 2025",
        fecha: "2025-03-31",
        vistas: 5
      }
    ];

    const datosFicticiosBecarios = [
      {
        id: 101,
        nombre: "Juan Galindo",
        carrera: "Ingeniería en Sistemas",
        centro: "CU Tegucigalpa",
        monto: "L. 3,500.00",
        estado: "Aprobado"
      },
      {
        id: 102,
        nombre: "Ana Cáceres",
        carrera: "Administración de Empresas",
        centro: "CU Valle de Sula",
        monto: "L. 3,500.00",
        estado: "Aprobado"
      }
    ];

    setPlanillas(datosFicticiosPlanillas);
    setBecariosActivos(datosFicticiosBecarios);
  }, []);

  const generarNuevaPlanilla = () => {
    const hoy = new Date();
    const opciones = { month: 'long', year: 'numeric' };
    const mesAnio = hoy.toLocaleDateString('es-ES', opciones);
    const mesCapitalizado = mesAnio.charAt(0).toUpperCase() + mesAnio.slice(1);

    // Contar cuántas planillas hay ya con este mes y año
    const cantidadExistente = planillas.filter(p => {
      const fechaPlanilla = new Date(p.fecha);
      return (
        fechaPlanilla.getMonth() === hoy.getMonth() &&
        fechaPlanilla.getFullYear() === hoy.getFullYear()
      );
    }).length;

    const tituloBase = `Planilla ${mesCapitalizado}`;
    const tituloFinal = cantidadExistente > 0
      ? `${tituloBase} (${cantidadExistente + 1})`
      : tituloBase;

    const nuevaPlanilla = {
      id: `PLN-${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}-${planillas.length + 1}`,
      titulo: tituloFinal,
      fecha: hoy.toISOString(),
      vistas: 0,
      administrador: user ? user.noEmpleado : "Desconocido"
    };

    setPlanillas(prev => [nuevaPlanilla, ...prev]);
    setShowModal(false);
  };


  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const obtenerMes = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const opciones = { month: 'long' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 planillas-container">
        <h1>Planillas de pago corrientes</h1>
        <Button variant="primary" onClick={() => setShowModal(true)} disabled={becariosActivos.length === 0}>
          <FaPlusCircle className="me-2" /> Nueva Planilla
        </Button>
      </div>

      {planillas.length === 0 ? (
        <p className="text-muted">No hay planillas registradas en el año actual.</p>
      ) : (
        <Row>
          {planillas.map((planilla, index) => {
            const backgroundColor = index % 2 === 0 ? '#F4F4F9' : '#E6EBE0';
            return (
              <Col md={6} lg={4} key={planilla.id} className="mb-4">
                <Card style={{ border: 'none', backgroundColor }}>
                  <Card.Body>
                    <Card.Text className="title">{planilla.titulo}</Card.Text>
                    <Card.Text className="text-muted">
                      Planilla de pago correspondiente para el mes de {obtenerMes(planilla.fecha)}
                    </Card.Text>
                    <Card.Text className="generada-por">
                      Generada por {planilla.administrador}
                    </Card.Text>
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => generarPDF(planilla, becariosActivos)}
                      >
                        <FaDownload className="me-2" /> Descargar
                      </Button>
                      <div className="d-flex align-items-center text-muted planilla-info">
                        <FaEye />{planilla.vistas}
                        <div className="icon-left"><FaCloudDownloadAlt /> {(Math.random() * (9.9 - 1.2) + 1.2).toFixed(1)} MB</div>
                        <div className="icon-left"><FaCalendarAlt /> {formatearFecha(planilla.fecha)}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal" centered>
        <Modal.Header className="modal-header">
          <Modal.Title>Confirmar Nueva Planilla</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-content">
          ¿Estás seguro de que deseas generar una nueva planilla de pago para el mes actual?
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={generarNuevaPlanilla}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PlanillasPagoBecarios;
