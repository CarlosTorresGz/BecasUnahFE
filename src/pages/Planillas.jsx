import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { FaDownload, FaPlusCircle, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import '../styles/Planillas.css';
import Modal from "../components/Modal";
import { obtenerAniosDisponibles } from "../util/formatearfechaCreacion";
import useCentrosEstudio from "../hooks/useCentrosEstudio";
import { useDashboard } from '../context/DashboardContext';
import { handleEliminarPlanilla } from "../services/Planilla/Administracion/EliminarPlanilllas/handleEliminarPlanila";
import { confirmarYCrearPlanilla } from "../services/Planilla/Administracion/CreacionPlanillas/confirmacionCreacionPlanilla";
import useInputChange from "../hooks/handleInputChange"; // Importar el hook personalizado
import { handleDescargarPDF } from "../services/Planilla/Administracion/Descargas/handleDescargarPDF";

handleDescargarPDF
const PlanillasPagoBecarios = () => {
  const [planillas, setPlanillas] = useState([]);
  const [planillaNueva, setPlanillaNueva] = useState(false);

  const { refreshPlanillatadmin, dataFetch } = useDashboard();
  
  const { formData, handleInputChange } = useInputChange({
    mes: "",
    anio: new Date().getFullYear(),
    centro_estudio_id: 0
  });

  const { centrosEstudio, loading, error } = useCentrosEstudio();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setPlanillas(dataFetch?.planilla?.data || []);
      } catch (error) {
        console.error("Error al obtener planillas:", error);
        toast.error("Error al cargar las planillas");
      }
    };

    obtenerDatos();
  }, [dataFetch]);

  const cancelGenerate = () => {
    setPlanillaNueva(false);
  };

  const confirmarCreacionPlanilla = async () => {
    await confirmarYCrearPlanilla({
      formData,
      refresh: refreshPlanillatadmin,
      cerrarModal: () => setPlanillaNueva(false)
    });
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };


  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 planillas-container">
        <h1>Planillas de pago corrientes</h1>
        <Button variant="primary" onClick={() => setPlanillaNueva(true)}>
          <FaPlusCircle className="me-2" /> Nueva Planilla
        </Button>
      </div>

      {!planillas || planillas.length === 0 ? (
        <p className="text-muted">No hay planillas registradas en el año actual.</p>
      ) : (
        <Row>
          {planillas.map((planilla, index) => {
            const backgroundColor = index % 2 === 0 ? '#F4F4F9' : '#E6EBE0';
            return (
              <Col md={6} lg={4} key={planilla.planilla_id} className="mb-4">
                <Card style={{ border: 'none', backgroundColor }}>
                  <Card.Body>
                    <Card.Text className="titulo">{planilla.descripcionPlanilla}</Card.Text>
                    <Card.Text className="text-muted">
                      Planilla de pago correspondiente para el mes de {planilla.mes} del año {planilla.anio}
                    </Card.Text>
                    <Card.Text className="centro-estudio">
                      Centro de Estudio: {planilla.nombre_centro_estudio}
                    </Card.Text>
                    <Card.Text className="generada-por">
                      Generada por {planilla.NombreCompleto}
                    </Card.Text>

                    <div className="d-flex align-items-center gap-2">
                      <Button variant="outline-secondary" size="sm" onClick={() => handleDescargarPDF(planilla)}>
                        <FaDownload className="me-2" /> Descargar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleEliminarPlanilla(planilla.planilla_id, refreshPlanillatadmin)}>
                        <FaTrash className="me-2" /> Eliminar
                      </Button>
                      <div className="d-flex align-items-center text-muted planilla-info">
                        <div className="icon-left"><FaCalendarAlt /> {formatearFecha(planilla.fecha_planilla_creacion)}</div>
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
        <Modal isOpen={planillaNueva} title="Generar Nueva Planilla" onConfirm={confirmarCreacionPlanilla} onCancel={cancelGenerate}>
          <Form>
            <Form.Group controlId="formMes">
              <Form.Label>Mes</Form.Label>
              <Form.Control as="select" name="mes" value={formData.mes} onChange={handleInputChange}>
                <option value="Enero">Enero</option>
                <option value="Febrero">Febrero</option>
                <option value="Marzo">Marzo</option>
                <option value="Abril">Abril</option>
                <option value="Mayo">Mayo</option>
                <option value="Junio">Junio</option>
                <option value="Julio">Julio</option>
                <option value="Agosto">Agosto</option>
                <option value="Septiembre">Septiembre</option>
                <option value="Octubre">Octubre</option>
                <option value="Noviembre">Noviembre</option>
                <option value="Diciembre">Diciembre</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formAnio">
              <Form.Label>Año</Form.Label>
              <Form.Control as="select" name="anio" value={formData.anio} onChange={handleInputChange}>
                {obtenerAniosDisponibles().map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formCentroEstudio">
              <Form.Label>Centro de Estudio</Form.Label>
              <Form.Control as="select" name="centro_estudio_id" value={formData.centro_estudio_id} onChange={handleInputChange}>
                {loading && <option>Cargando...</option>}
                {error && <option>Error al cargar centros de estudio</option>}
                {!loading && !error && centrosEstudio.map(centro => (
                  <option key={centro.centro_estudio_id} value={centro.centro_estudio_id}>
                    {centro.nombre_centro_estudio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default PlanillasPagoBecarios;
