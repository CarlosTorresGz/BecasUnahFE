import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { FaDownload, FaPlusCircle, FaEye, FaCloudDownloadAlt, FaCalendarAlt } from "react-icons/fa";
import useGenerarPDF from "../hooks/useGenerarPDF";
import '../styles/Planillas.css';
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

import {fetchAllPlanilla} from "../services/Planilla/Administracion/planillaAdmin";
import { adaptarPlanillas } from "../services/Planilla/Administracion/planillaAdapter";

const PlanillasPagoBecarios = () => {
  const { user } = useAuth();
  const [planillas, setPlanillas] = useState([]);
  const [becariosActivos, setBecariosActivos] = useState([]);
  const [planillaNueva, setPlanillaNueva] = useState(false);
  const generarPDF = useGenerarPDF();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await fetchAllPlanilla();
        const planillasAdaptadas = adaptarPlanillas(data);
        setPlanillas(planillasAdaptadas);

        // Simulamos becarios (puedes crear un adaptador y fetch real después)
        const becariosDummy = [
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
        setBecariosActivos(becariosDummy);
      } catch (error) {
        console.error("Error al obtener planillas:", error);
      }
    };

    obtenerDatos();
  }, []);

  const cancelGenerate = () => setPlanillaNueva(false);

  const generarNuevaPlanilla = () => {
    const hoy = new Date();
    const opciones = { month: 'long', year: 'numeric' };
    const mesAnio = hoy.toLocaleDateString('es-ES', opciones);
    const mesCapitalizado = mesAnio.charAt(0).toUpperCase() + mesAnio.slice(1);

    const cantidadExistente = planillas.filter(p => {
      const fechaPlanilla = new Date(p.fecha);
      return fechaPlanilla.getMonth() === hoy.getMonth() &&
        fechaPlanilla.getFullYear() === hoy.getFullYear();
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
    setPlanillaNueva(false);
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const obtenerMes = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { month: 'long' });
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 planillas-container">
        <h1>Planillas de pago corrientes</h1>
        <Button variant="primary" onClick={() => setPlanillaNueva(true)} disabled={becariosActivos.length === 0}>
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
                    <Card.Text className="titulo">{planilla.descripcionPlanilla}</Card.Text>
                    <Card.Text className="text-muted">
                      Planilla de pago correspondiente para el mes de {planilla.mes} del año {planilla.anio}
                    </Card.Text>
                    <Card.Text className="centro-estudio">
                      Centro de Estudio:  {planilla.nombre_centro_estudio}
                    </Card.Text>
                    <Card.Text className="generada-por">
                      Generada por {planilla.administrador}
                    </Card.Text>

                    <div className="d-flex align-items-center gap-2">
                      <Button variant="outline-secondary" size="sm" onClick={() => generarPDF(planilla, becariosActivos)}>
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

      {planillaNueva && (
        <Modal
          isOpen={planillaNueva}
          title="Confirmar Nueva Planilla"
          onConfirm={generarNuevaPlanilla}
          onCancel={cancelGenerate}
        >
          <p>¿Estás seguro de que deseas generar una nueva planilla de pago para el mes actual?</p>
        </Modal>
      )}
    </Container>
  );
};

export default PlanillasPagoBecarios;